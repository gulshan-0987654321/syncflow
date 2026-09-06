import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Sparkles,
  Briefcase,
  MapPin,
  Globe,
  Award,
  Clock,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  Eye,
  Camera,
  Link as LinkIcon,
} from 'lucide-react';

const POPULAR_SKILLS = [
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'React',
  'Node.js',
  'Next.js',
  'DSA',
  'System Design',
  'MongoDB',
  'PostgreSQL',
  'DevOps',
  'Docker',
  'AWS',
  'AI/ML',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
];

export default function MyProfileSection({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const fileInputRef = useRef(null);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [headline, setHeadline] = useState(currentUser?.headline || 'Software Engineer & Pair Programmer');
  const [yearsOfExperience, setYearsOfExperience] = useState(currentUser?.yearsOfExperience || 1);
  const [location, setLocation] = useState(currentUser?.location || 'Bengaluru, India');
  const [bio, setBio] = useState(
    currentUser?.bio ||
      'Passionate full stack developer looking forward to pair-programming and DSA problem solving! 🚀'
  );
  const [avatar, setAvatar] = useState(
    currentUser?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolioUrl || '');
  const [skills, setSkills] = useState(currentUser?.skills || ['React', 'JavaScript', 'Node.js', 'Python', 'C++']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkillInput.trim() && !skills.includes(customSkillInput.trim())) {
      setSkills([...skills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        fullName,
        username,
        headline,
        yearsOfExperience: Number(yearsOfExperience),
        location,
        bio,
        avatar,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        skills,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#1c2128]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">My Developer Profile</h2>
              <p className="text-xs text-slate-400">Manage your skills, bio, experience, and links</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Toggle: Edit vs Public Card Preview */}
            <div className="flex rounded-xl bg-[#0d1117] p-1 border border-[#30363d]">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'edit'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Card Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#21262d] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Profile updated successfully in database!</span>
            </div>
          )}

          {activeTab === 'edit' ? (
            /* 1. EDIT MODE FORM */
            <form onSubmit={handleSave} className="space-y-6">
              {/* Photo & Avatar Customization */}
              <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Profile Photo (Upload from Device)
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Clickable Avatar with Camera Icon Badge */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/50 shadow-lg cursor-pointer group shrink-0"
                    title="Click to change photo"
                  >
                    <img
                      src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition">
                      <Camera className="w-5 h-5" />
                      <span className="text-[9px] font-semibold mt-0.5">Change</span>
                    </div>
                  </div>

                  {/* Hidden File Input & Upload Controls */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Photo from Computer</span>
                      </button>

                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')}
                          className="px-3 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-400 hover:text-white text-xs font-semibold transition"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                      <span className="text-[11px] text-slate-400">Or pick preset:</span>
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition ${
                            avatar === preset ? 'border-indigo-500 scale-110' : 'border-[#30363d] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vishal Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. vishal_dev"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title / Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Bio / About Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">About Me / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other developers about yourself, your favorite tech stacks, or what you want to pair program on..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition leading-relaxed"
                />
              </div>

              {/* Social & Portfolio Links */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Links & Social Profiles
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="GitHub URL"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="Portfolio / Web"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tag Management */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Programming Languages & Tech Skills ({skills.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/60 ring-1 ring-indigo-500/30'
                            : 'bg-[#0d1117] text-slate-400 border-[#30363d] hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add custom skill or framework..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-300 text-xs font-semibold transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* 2. PUBLIC CARD PREVIEW MODE */
            <div className="space-y-6 animate-in fade-in">
              <div className="text-xs text-slate-400">
                This is how other developers see your card on the platform:
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c2128] to-[#161b22] border border-indigo-500/40 shadow-2xl space-y-6">
                {/* Header Card */}
                <div className="flex items-start gap-4">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={username}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{fullName || username}</h3>
                      <span className="text-xs text-indigo-400 font-mono">@{username}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                      <span>{headline}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" /> {yearsOfExperience} Yrs Experience
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-3.5 rounded-2xl bg-[#0d1117] border border-[#30363d] text-xs text-slate-300 leading-relaxed">
                  {bio}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tech Stack & Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                {(githubUrl || linkedinUrl || portfolioUrl) && (
                  <div className="flex items-center gap-3 pt-2 border-t border-[#30363d]">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-300 hover:text-white border border-[#30363d] transition flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Globe className="w-4 h-4 text-indigo-400" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-300 hover:text-white border border-[#30363d] transition flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {portfolioUrl && (
                      <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-300 hover:text-white border border-[#30363d] transition flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
