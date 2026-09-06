import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        default: 'Software Engineer & Pair Programmer'
    },
    yearsOfExperience: {
        type: Number,
        default: 1
    },
    location: {
        type: String,
        default: 'Remote'
    },
    githubUrl: {
        type: String,
        default: ''
    },
    linkedinUrl: {
        type: String,
        default: ''
    },
    portfolioUrl: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: 'Passionate software developer interested in real-time collaboration and problem solving. 🚀'
    },
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    skills: {
        type: [String],
        default: ['React', 'JavaScript', 'Node.js', 'Python']
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'in_call', 'offline'],
        default: 'available'
    },
    rating: {
        type: Number,
        default: 5.0
    },
    sessionsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
