import express from 'express';
import verifyToken from '../middleware/authmiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// 1. Get current logged in user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        
        if (!userId) {
            return res.status(400).json({ message: 'Invalid token payload: User ID missing' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({
            message: 'Protected data available!',
            userData: user
        });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ message: 'Something went wrong!', error: err.message });
    }
});

// 2. Update user profile (fullName, headline, yearsOfExperience, bio, skills, avatar, location, links)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId || req.user._id;
        const {
            fullName,
            username,
            headline,
            yearsOfExperience,
            location,
            githubUrl,
            linkedinUrl,
            portfolioUrl,
            bio,
            skills,
            avatar,
            availabilityStatus
        } = req.body;

        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (username !== undefined && username.trim()) updateData.username = username.trim().toLowerCase();
        if (headline !== undefined) updateData.headline = headline.trim();
        if (yearsOfExperience !== undefined) updateData.yearsOfExperience = Number(yearsOfExperience) || 0;
        if (location !== undefined) updateData.location = location.trim();
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl.trim();
        if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl.trim();
        if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (skills !== undefined) {
            updateData.skills = Array.isArray(skills) 
                ? skills 
                : String(skills).split(',').map(s => s.trim()).filter(Boolean);
        }
        if (avatar !== undefined) updateData.avatar = avatar.trim();
        if (availabilityStatus !== undefined) updateData.availabilityStatus = availabilityStatus;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({
            message: 'Profile updated successfully!',
            userData: updatedUser
        });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
});

// 3. Get all developers with search and filtering
router.get('/developers', verifyToken, async (req, res) => {
    try {
        const currentUserId = req.user.id || req.user.userId || req.user._id;
        const { skill, search } = req.query;

        let query = {};
        if (currentUserId) {
            query._id = { $ne: currentUserId };
        }

        if (skill && skill !== 'all') {
            query.skills = { $in: [new RegExp(`^${skill}$`, 'i')] };
        }

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { headline: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const developers = await User.find(query).select('-password').sort({ isOnline: -1, updatedAt: -1 });

        res.status(200).json({
            count: developers.length,
            registeredMembers: developers,
            developers
        });
    } catch (err) {
        console.error('Error fetching developers:', err.message);
        res.status(500).json({ message: 'Error fetching developers', error: err.message });
    }
});

// 4. Get specific developer by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Developer not found!' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching developer details' });
    }
});

export default router;