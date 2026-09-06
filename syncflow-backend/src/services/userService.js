import mongoose from 'mongoose';
import User from '../models/user.js';

// Disable Mongoose command buffering so DB calls fail fast instead of hanging 10s if Mongo is down
mongoose.set('bufferCommands', false);

// In-Memory User Store: userId -> userObject, email -> userId
const memoryUsers = new Map();
const emailToIdMap = new Map();

// Helper to check if Mongoose DB is currently connected
export const isDbConnected = () => {
    return mongoose.connection && mongoose.connection.readyState === 1;
};

// 1. Find User by Email
export const findUserByEmail = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    if (isDbConnected()) {
        try {
            return await User.findOne({ email: normalizedEmail });
        } catch (e) {
            console.warn('DB findOne failed, checking memory store:', e.message);
        }
    }
    const id = emailToIdMap.get(normalizedEmail);
    return id ? memoryUsers.get(id) || null : null;
};

// 2. Find User by ID
export const findUserById = async (id) => {
    if (!id) return null;
    const stringId = id.toString();
    if (isDbConnected()) {
        try {
            return await User.findById(stringId).select('-password');
        } catch (e) {
            console.warn('DB findById failed, checking memory store:', e.message);
        }
    }
    const user = memoryUsers.get(stringId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// 3. Create User
export const createUser = async (userData) => {
    const normalizedEmail = userData.email.toLowerCase().trim();
    if (isDbConnected()) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (e) {
            console.warn('DB createUser failed, checking memory store:', e.message);
        }
    }

    const _id = new mongoose.Types.ObjectId().toString();
    const newUser = {
        ...userData,
        _id,
        id: _id,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        save: async function() {
            memoryUsers.set(this._id.toString(), this);
            emailToIdMap.set(this.email, this._id.toString());
            return this;
        }
    };
    memoryUsers.set(_id, newUser);
    emailToIdMap.set(normalizedEmail, _id);
    return newUser;
};

// 4. Update User
export const updateUser = async (id, updateData) => {
    if (!id) return null;
    const stringId = id.toString();
    if (isDbConnected()) {
        try {
            return await User.findByIdAndUpdate(
                stringId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select('-password');
        } catch (e) {
            console.warn('DB updateUser failed, checking memory store:', e.message);
        }
    }

    const existing = memoryUsers.get(stringId);
    if (!existing) return null;

    Object.assign(existing, updateData, { updatedAt: new Date().toISOString() });
    memoryUsers.set(stringId, existing);
    
    const { password, ...userWithoutPassword } = existing;
    return userWithoutPassword;
};

// 5. Get Developers
export const getDevelopers = async ({ currentUserId, skill, search }) => {
    if (isDbConnected()) {
        try {
            let query = {};
            if (currentUserId) query._id = { $ne: currentUserId };
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
            return await User.find(query).select('-password').sort({ isOnline: -1, updatedAt: -1 });
        } catch (e) {
            console.warn('DB getDevelopers failed, checking memory store:', e.message);
        }
    }

    const allUsers = Array.from(memoryUsers.values());
    return allUsers.filter(u => {
        if (currentUserId && (u._id.toString() === currentUserId.toString() || u.id === currentUserId.toString())) {
            return false;
        }
        if (skill && skill !== 'all') {
            const hasSkill = u.skills && u.skills.some(s => s.toLowerCase() === skill.toLowerCase());
            if (!hasSkill) return false;
        }
        if (search) {
            const q = search.toLowerCase();
            const match = (u.username && u.username.toLowerCase().includes(q)) ||
                          (u.fullName && u.fullName.toLowerCase().includes(q)) ||
                          (u.bio && u.bio.toLowerCase().includes(q)) ||
                          (u.skills && u.skills.some(s => s.toLowerCase().includes(q)));
            if (!match) return false;
        }
        return true;
    }).map(({ password, ...u }) => u);
};
