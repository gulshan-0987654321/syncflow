import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const router = express.Router();

// In-Memory OTP Store: email -> { otp, expiresAt }
const otpStore = new Map();

// Helper to send real emails to Gmail
const sendVerificationEmail = async (toEmail, otp) => {
    try {
        const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
        const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

        let transporter;
        if (emailUser && emailPass) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: emailUser, pass: emailPass }
            });
        } else {
            // Ethereal / auto-fallback transport
            const testAccount = await nodemailer.createTestAccount().catch(() => null);
            if (testAccount) {
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: { user: testAccount.user, pass: testAccount.pass }
                });
            }
        }

        const mailOptions = {
            from: `"SyncFlow Verification" <${emailUser || 'auth@syncflow.io'}>`,
            to: toEmail,
            subject: `🔐 Your SyncFlow Verification Code: ${otp}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background: #161b22; color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #30363d;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #818cf8; margin: 0; font-size: 24px;">SyncFlow Pair Programming</h2>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Secure Email Identity Verification</p>
                    </div>
                    <p style="color: #cbd5e1; font-size: 14px; text-align: center;">Use the verification code below to securely verify your account:</p>
                    <div style="background: #0d1117; border: 2px dashed #6366f1; padding: 18px; text-align: center; border-radius: 14px; margin: 24px 0;">
                        <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #a5b4fc; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        if (transporter) {
            const info = await transporter.sendMail(mailOptions);
            console.log(`📨 [REAL EMAIL SENT] To: ${toEmail} | MessageID: ${info.messageId}`);
            if (nodemailer.getTestMessageUrl(info)) {
                console.log(`🔗 [Preview Email]: ${nodemailer.getTestMessageUrl(info)}`);
            }
        }
    } catch (mailErr) {
        console.warn('Mail delivery note:', mailErr.message);
    }
};

// Generate JWT Helper
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'fallback_secret_key_123456',
        { expiresIn: '7d' }
    );
};

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, skills, bio, avatar } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password!' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                existingUser.isOnline = true;
                await existingUser.save();
                const token = generateToken(existingUser._id);
                return res.status(200).json({
                    message: 'Logged in successfully!',
                    token,
                    user: existingUser
                });
            }
            return res.status(400).json({ message: 'An account with this email already exists with a different password. Please log in.' });
        }

        const safeUsername = (username || normalizedEmail.split('@')[0])
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .toLowerCase();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: safeUsername,
            email: normalizedEmail,
            password: hashedPassword,
            skills: skills && skills.length > 0 ? skills : ['React', 'Node.js', 'JavaScript'],
            bio: bio || 'Full Stack Developer ready for live pair-programming! 🚀',
            avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
            isOnline: true,
            isVerified: true,
            availabilityStatus: 'available'
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: newUser
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password!' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const safeUsername = normalizedEmail.split('@')[0]
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase();

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                username: safeUsername || `user_${Date.now().toString().slice(-4)}`,
                email: normalizedEmail,
                password: hashedPassword,
                skills: ['React', 'JavaScript', 'Node.js'],
                bio: 'Passionate Developer on SyncFlow 🚀',
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
                isOnline: true,
                isVerified: true,
                availabilityStatus: 'available'
            });

            await user.save();
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password for this email! Please try again.' });
            }
        }

        user.isOnline = true;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful!',
            token,
            user
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
});

// 3. SEND 6-DIGIT EMAIL VERIFICATION CODE (OTP) TO USER'S INBOX
router.post('/send-verification-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'A valid email address is required!' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(normalizedEmail, { otp, expiresAt });

        // Send email via Nodemailer asynchronously in background
        sendVerificationEmail(normalizedEmail, otp).catch((e) => console.warn('Mail send note:', e.message));

        res.status(200).json({
            message: `Verification code sent directly to ${normalizedEmail}!`,
            otp, // returned for verification
            expiresInSeconds: 600
        });
    } catch (error) {
        console.error('Send OTP Error:', error.message);
        res.status(500).json({ message: 'Error sending verification code' });
    }
});

// 4. VERIFY EMAIL OTP AND AUTHENTICATE
router.post('/verify-email-otp', async (req, res) => {
    try {
        const { email, otp, name, avatar, skills } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and 6-digit verification code are required!' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const stored = otpStore.get(normalizedEmail);

        if (!stored) {
            return res.status(400).json({ message: 'No verification code was requested for this email or it has expired.' });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
        }

        if (stored.otp !== otp.toString().trim()) {
            return res.status(400).json({ message: 'Invalid 6-digit verification code! Please check and try again.' });
        }

        otpStore.delete(normalizedEmail);

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const baseUsername = (name || normalizedEmail.split('@')[0])
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase();

            let uniqueUsername = baseUsername || `user_${Date.now().toString().slice(-4)}`;
            const existingUsername = await User.findOne({ username: uniqueUsername });
            if (existingUsername) {
                uniqueUsername = `${uniqueUsername}_${Math.floor(Math.random() * 1000)}`;
            }

            const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                username: uniqueUsername,
                fullName: name || uniqueUsername,
                email: normalizedEmail,
                password: hashedPassword,
                avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
                bio: 'Verified Developer on SyncFlow 🚀',
                skills: skills && skills.length > 0 ? skills : ['React', 'JavaScript', 'Node.js', 'Python'],
                isOnline: true,
                isVerified: true,
                availabilityStatus: 'available'
            });

            await user.save();
        } else {
            user.isOnline = true;
            user.isVerified = true;
            if (name && !user.fullName) user.fullName = name;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Email verified and logged in successfully!',
            token,
            user
        });

    } catch (error) {
        console.error('Verify OTP Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during email verification' });
    }
});

// 5. GOOGLE AUTH
router.post('/google', async (req, res) => {
    try {
        const { email, name, avatar } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Google authentication failed: Email is required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const baseUsername = (name || normalizedEmail.split('@')[0])
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_]/g, '')
                .toLowerCase();
            
            let uniqueUsername = baseUsername || `user_${Date.now().toString().slice(-4)}`;
            const existingUsername = await User.findOne({ username: uniqueUsername });
            if (existingUsername) {
                uniqueUsername = `${uniqueUsername}_${Math.floor(Math.random() * 1000)}`;
            }

            const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                username: uniqueUsername,
                fullName: name || uniqueUsername,
                email: normalizedEmail,
                password: hashedPassword,
                avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
                bio: 'Google Verified Developer on SyncFlow 🚀',
                skills: ['React', 'JavaScript', 'Node.js', 'Python'],
                isOnline: true,
                isVerified: true,
                availabilityStatus: 'available'
            });

            await user.save();
        } else {
            user.isOnline = true;
            user.isVerified = true;
            if (name && !user.fullName) user.fullName = name;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Google login successful!',
            token,
            user
        });

    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during Google login' });
    }
});

export default router;