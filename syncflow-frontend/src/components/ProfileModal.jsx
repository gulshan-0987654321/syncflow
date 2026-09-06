import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Plus, Check, User } from 'lucide-react';

const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'Python',
  'DSA',
  'C++',
  'Java',
  'Next.js',
  'MongoDB',
  'SQL',
  'DevOps',
  'Docker',
  'AI/ML',
  'System Design',
];

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth();

  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState(currentUser?.skills || ['React', 'JavaScript']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !currentUser) return null;

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({
        bio,
        skills,
        avatar,
      });
      onClose();
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Your Dev Profile & Skills</h2>
              <p className="text-xs text-slate-400">
                Skills you add here will help peers find you for pair programming.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Bio / What you want to teach or learn
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Full stack developer ready to help with React & Node, learning System Design..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Skill Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Your Tech Skills & Topics
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 ring-1 ring-indigo-500/30'
                        : 'bg-[#21262d] text-slate-400 border-[#30363d] hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <form onSubmit={handleAddCustomSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add custom skill (e.g. Rust, GraphQL)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#30363d]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile & Skills'}
          </button>
        </div>
      </div>
    </div>
  );
}
