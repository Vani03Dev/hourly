"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Save, ArrowLeft, ExternalLink, ShieldCheck, Sparkles, X, Eye, Palette, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import { updateCreatorPage, updateAvatarUrl } from '@/app/actions/expert';
import toast from 'react-hot-toast';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
];

const THEME_OPTIONS = [
  { id: 'teal' as const, label: 'Teal', ring: 'ring-teal', badge: 'bg-teal-50 text-teal border-teal/20' },
  { id: 'blue' as const, label: 'Blue', ring: 'ring-blue-500', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'navy' as const, label: 'Navy', ring: 'ring-[#0F2137]', badge: 'bg-gray-100 text-[#0F2137] border-gray-300' },
];

const TAG_SUGGESTIONS = ['CA & Tax', 'Startup Legal', 'Tech & CTO', 'Finance & CFO', 'Leadership'];

export default function CustomizeCreatorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [pageTheme, setPageTheme] = useState<'teal' | 'blue' | 'navy'>('teal');
  const [hourlyRate, setHourlyRate] = useState(1000);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setPageTheme(user.user_metadata?.page_theme || 'teal');

      const { data } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || AVATAR_PRESETS[0]);
        setTags(data.tags || []);
        setHourlyRate(data.hourly_rate || 1000);
      }

      setLoading(false);
    }
    load();
  }, []);

  const fullName = `${firstName} ${lastName}`.trim() || 'Your Name';
  const activeTheme = THEME_OPTIONS.find((t) => t.id === pageTheme) || THEME_OPTIONS[0];

  const handleAddTag = (tag?: string) => {
    const value = (tag || tagInput).trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateCreatorPage({
      title,
      bio,
      tags,
      avatarUrl,
      pageTheme,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Creator page updated!');
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    const toastId = toast.loading('Uploading photo...');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket')) {
           throw new Error("Please create a public storage bucket named 'avatars' in Supabase.");
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const newUrl = data.publicUrl;
      setAvatarUrl(newUrl);
      
      // Auto-save the avatar directly so the user doesn't have to hit "Publish changes" just for the picture
      await updateAvatarUrl(newUrl);
      
      toast.success('Photo uploaded successfully!', { id: toastId });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error uploading photo', { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const inputClass =
    'w-full h-[44px] px-4 rounded-[10px] border border-gray-200 bg-white text-[14px] text-primary placeholder:text-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all shadow-sm';

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[500px] bg-gray-100 rounded-[16px]" />
          <div className="h-[500px] bg-gray-100 rounded-[16px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/expert/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-primary mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">Customize Creator Page</h1>
          <p className="text-[15px] text-muted">Personalize how clients see your public booking page.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {username && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/${username}`} target="_blank">
                <ExternalLink size={14} /> Live page
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save size={16} /> {saving ? 'Saving...' : 'Publish changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Editor */}
        <div className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-primary mb-4">Profile Photo</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-white ring-2 ${activeTheme.ring} shrink-0`}>
                <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
                
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Button type="button" variant="outline" className="w-full gap-2" disabled={uploadingAvatar}>
                    <Upload size={14} />
                    {uploadingAvatar ? 'Uploading...' : 'Upload from device'}
                  </Button>
                </div>
                
                <p className="text-[11px] text-muted mt-1.5">Paste an image URL, upload a file, or pick a preset below</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_PRESETS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === url ? 'border-teal ring-2 ring-teal/30 scale-110' : 'border-gray-200 hover:border-teal/40'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-primary mb-4 flex items-center gap-2">
              <Palette size={16} className="text-teal" /> Page Theme
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setPageTheme(theme.id)}
                  className={`p-4 rounded-[12px] border-2 text-center transition-all ${
                    pageTheme === theme.id
                      ? 'border-teal bg-teal-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${theme.ring.replace('ring-', 'bg-').replace('ring-', '')} ${theme.id === 'teal' ? 'bg-teal' : theme.id === 'blue' ? 'bg-blue-500' : 'bg-[#0F2137]'}`} />
                  <span className="text-[12px] font-bold text-primary">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-[15px] font-bold text-primary">Page Content</h2>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-primary">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. SEBI Registered CA & Startup Advisor"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-[13px] font-semibold text-primary">Bio</label>
                <span className={`text-[12px] ${bio.length < 20 ? 'text-red-500' : 'text-muted'}`}>
                  {bio.length}/20 min
                </span>
              </div>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients what you help with and why they should book you..."
                className="w-full p-4 rounded-[10px] border border-gray-200 bg-white text-[14px] text-primary placeholder:text-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 resize-none shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-primary">Expertise Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 pl-3 pr-2 py-1 rounded-full text-[12px] font-semibold border ${activeTheme.badge}`}
                  >
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag..."
                  className={`${inputClass} flex-1`}
                />
                <Button type="button" variant="outline" onClick={() => handleAddTag()}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {TAG_SUGGESTIONS.filter((s) => !tags.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddTag(s)}
                    className="text-[11px] font-semibold px-2 py-1 rounded-full border border-gray-200 text-muted hover:border-teal/40 hover:text-teal"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-[88px]">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-teal" />
            <span className="text-[13px] font-bold text-primary uppercase tracking-wider">Live Preview</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-[16px] shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <span className="text-[12px] font-mono text-muted">
                {username ? `sessionly.in/${username}` : 'sessionly.in/username'}
              </span>
              <span className="text-[11px] font-bold text-teal uppercase">Preview</span>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-white ring-[3px] mb-4 ${activeTheme.ring}`}>
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border mb-3 ${activeTheme.badge}`}>
                  <ShieldCheck size={12} /> Verified Expert
                </span>
                <h2 className="text-[22px] font-extrabold text-primary leading-tight">{fullName}</h2>
                <p className="text-[15px] text-muted mt-1 font-medium">{title || 'Your professional title'}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {tags.length > 0 ? tags.map((tag) => (
                  <span key={tag} className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${activeTheme.badge}`}>
                    {tag}
                  </span>
                )) : (
                  <span className="text-[12px] text-muted italic">Add expertise tags</span>
                )}
              </div>

              <p className="text-[14px] text-gray-600 leading-relaxed text-center mb-6">
                {bio || 'Your bio will appear here. Write a compelling description of your expertise.'}
              </p>

              <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 text-center">
                <p className="text-[12px] text-muted mb-1">Starting from</p>
                <p className="text-[24px] font-bold text-primary font-mono">₹{hourlyRate}</p>
                <p className="text-[12px] text-muted">per session</p>
                <Button className="w-full mt-4" disabled>
                  <Sparkles size={14} className="mr-2" /> Book a Session
                </Button>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-muted text-center mt-4">
            Changes appear on your live page after you click Publish changes.
          </p>
        </div>
      </div>
    </div>
  );
}
