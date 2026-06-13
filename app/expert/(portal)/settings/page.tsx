"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Save, User, Link as LinkIcon, IndianRupee,
  Copy, ExternalLink, X, Bell, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import { updateExpertProfile } from '@/app/actions/expert';
import toast from 'react-hot-toast';

const TIMEZONES = [
  { value: 'asia_kolkata', label: 'India (IST)' },
  { value: 'america_new_york', label: 'US Eastern' },
  { value: 'america_los_angeles', label: 'US Pacific' },
  { value: 'europe_london', label: 'UK (GMT)' },
  { value: 'asia_singapore', label: 'Singapore' },
];

const EXPERTISE_SUGGESTIONS = [
  'CA & Tax', 'Startup Legal', 'Tech & CTO', 'Finance & CFO', 'HR & People',
];

type SettingsTab = 'profile' | 'account';

export default function ExpertSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [email, setEmail] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [hourlyRate, setHourlyRate] = useState(1000);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [timezone, setTimezone] = useState('asia_kolkata');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);

  const markChanged = () => setHasChanges(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email || '');
      setTwitterUrl(user.user_metadata?.twitter_url || '');
      setEmailNotifications(user.user_metadata?.email_notifications !== false);
      setBookingAlerts(user.user_metadata?.booking_alerts !== false);

      const { data } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || user.user_metadata?.first_name || '');
        setLastName(data.last_name || user.user_metadata?.last_name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
        setUsername((data.username || '').replace(/^@/, ''));
        setHourlyRate(data.hourly_rate || 1000);
        setLinkedinUrl(data.linkedin_url || '');
        setTimezone(data.timezone || 'asia_kolkata');
        setTags(data.tags || []);
      }

      setLoading(false);
    }
    loadProfile();
  }, []);

  const profileUrl = username ? `sessionly.in/${username}` : '';

  const copyProfileLink = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied!');
  };

  const handleAddTag = (tag?: string) => {
    const newTag = (tag || tagInput).trim().replace(/,/g, '');
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
      markChanged();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
    markChanged();
  };

  const handleSave = async () => {
    if (tags.length === 0) {
      toast.error('Add at least one expertise tag');
      return;
    }
    if (bio.length < 20) {
      toast.error('Bio must be at least 20 characters');
      return;
    }

    setSaving(true);
    const result = await updateExpertProfile({
      firstName,
      lastName,
      title,
      bio,
      username: username.toLowerCase(),
      hourlyRate,
      linkedinUrl,
      twitterUrl,
      tags,
      timezone,
      emailNotifications,
      bookingAlerts,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Settings saved successfully');
      setHasChanges(false);
    }
    setSaving(false);
  };

  const inputClass =
    'w-full h-[44px] px-4 rounded-[10px] border border-gray-200 bg-white text-[14px] text-primary placeholder:text-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all shadow-sm';

  const labelClass = 'text-[13px] font-semibold text-primary';

  const Field = ({
    label,
    hint,
    children,
  }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="text-[12px] text-muted">{hint}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto p-6 md:p-10 lg:p-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-100 rounded w-1/3" />
          <div className="h-64 bg-gray-100 rounded-[16px]" />
          <div className="h-48 bg-gray-100 rounded-[16px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 md:p-10 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">Settings</h1>
          <p className="text-[15px] text-muted">Manage your public profile and account preferences.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 gap-2"
        >
          <Save size={16} /> {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile link preview */}
      {username && (
        <div className="mb-6 p-4 rounded-[12px] border border-teal/20 bg-teal-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-teal uppercase tracking-wider mb-1">Your public page</p>
            <p className="text-[15px] font-semibold text-primary truncate">{profileUrl}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={copyProfileLink}>
              <Copy size={14} /> Copy
            </Button>
            <Button variant="primary" size="sm" className="gap-2" asChild>
              <Link href={`/${username}`} target="_blank">
                <ExternalLink size={14} /> Preview
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main settings card */}
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden">
        {/* Tabs — full width */}
        <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50/80">
          {([
            { id: 'profile' as const, label: 'Public Profile', icon: User },
            { id: 'account' as const, label: 'Account', icon: Bell },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-4 text-[14px] font-bold transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-teal text-teal bg-white'
                  : 'border-transparent text-muted hover:text-primary hover:bg-white/60'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
      {activeTab === 'profile' ? (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2">
              <User className="text-teal" size={18} />
              Profile Details
            </h2>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="First Name">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); markChanged(); }}
                    className={inputClass}
                    placeholder="Rahul"
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); markChanged(); }}
                    className={inputClass}
                    placeholder="Sharma"
                  />
                </Field>
              </div>

              <Field label="Username" hint={`Your page: sessionly.in/${username || 'your-username'}`}>
                <div className="flex h-[44px] rounded-[10px] border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15 transition-all">
                  <span className="inline-flex items-center px-3 bg-gray-50 border-r border-gray-200 text-[13px] font-medium text-muted shrink-0">
                    sessionly.in/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); markChanged(); }}
                    className="flex-1 min-w-0 h-full px-3 bg-white text-[14px] text-primary placeholder:text-gray-400 focus:outline-none"
                    placeholder="your-username"
                  />
                </div>
              </Field>

              <Field label="Professional Title">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); markChanged(); }}
                  className={inputClass}
                  placeholder="e.g. SEBI Registered CA / ex-Razorpay Tech Lead"
                />
              </Field>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>Bio</label>
                  <span className={`text-[12px] font-medium ${bio.length < 20 ? 'text-red-500' : 'text-muted'}`}>
                    {bio.length}/20 min
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => { setBio(e.target.value); markChanged(); }}
                  placeholder="Briefly describe your expertise and what clients can expect..."
                  className="w-full p-4 rounded-[10px] border border-gray-200 bg-white text-[14px] text-primary placeholder:text-gray-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all resize-none shadow-sm"
                />
              </div>

              <Field label="Hourly Rate (₹)">
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={hourlyRate}
                    onChange={(e) => { setHourlyRate(parseInt(e.target.value, 10) || 0); markChanged(); }}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Expertise Tags</label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-teal-50 text-teal text-[12px] font-semibold border border-teal/20"
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add expertise tag..."
                    className={`${inputClass} flex-1`}
                  />
                  <Button type="button" variant="outline" onClick={() => handleAddTag()} className="shrink-0">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_SUGGESTIONS.filter((s) => !tags.includes(s)).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAddTag(suggestion)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 text-muted hover:border-teal/40 hover:text-teal hover:bg-teal-50/50 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2">
              <LinkIcon className="text-teal" size={18} />
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="LinkedIn">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => { setLinkedinUrl(e.target.value); markChanged(); }}
                  placeholder="https://linkedin.com/in/..."
                  className={inputClass}
                />
              </Field>
              <Field label="Twitter / X">
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => { setTwitterUrl(e.target.value); markChanged(); }}
                  placeholder="https://twitter.com/..."
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2">
              <Mail className="text-teal" size={18} />
              Account
            </h2>
            <div className="flex flex-col gap-5">
              <Field label="Email" hint="Contact support to change your email address.">
                <input type="email" value={email} disabled className={`${inputClass} bg-gray-50 text-muted cursor-not-allowed`} />
              </Field>

              <Field label="Timezone">
                <select
                  value={timezone}
                  onChange={(e) => { setTimezone(e.target.value); markChanged(); }}
                  className={inputClass}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2">
              <Bell className="text-teal" size={18} />
              Notifications
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Email notifications', desc: 'Receive updates about your account', value: emailNotifications, set: setEmailNotifications },
                { label: 'Booking alerts', desc: 'Get notified when a client books a session', value: bookingAlerts, set: setBookingAlerts },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-[12px] border border-gray-200 bg-gray-50/30 hover:border-teal/30 transition-colors">
                  <div>
                    <p className="text-[14px] font-bold text-primary">{item.label}</p>
                    <p className="text-[12px] text-muted mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.value}
                    onClick={() => { item.set(!item.value); markChanged(); }}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.value ? 'bg-teal' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
