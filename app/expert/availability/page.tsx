"use client";

import React, { useState, useEffect } from 'react';
import { ExpertSidebar } from '../../../components/layout/ExpertSidebar';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { createClient } from '../../../utils/supabase/client';
import { updateExpertAvailability } from '../../actions/expert';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<any>(
    DAYS.reduce((acc, day) => {
      acc[day] = { enabled: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day), slots: [{ start: '09:00', end: '17:00' }] };
      return acc;
    }, {} as any)
  );

  useEffect(() => {
    async function fetchAvailability() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('expert_profiles')
        .select('weekly_schedule')
        .eq('id', user.id)
        .single();

      if (data && data.weekly_schedule && Object.keys(data.weekly_schedule).length > 0) {
        setAvailability(data.weekly_schedule);
      }
      setLoading(false);
    }
    fetchAvailability();
  }, []);

  const toggleDay = (day: string) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const addSlot = (day: string) => {
    setAvailability((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, { start: '09:00', end: '17:00' }] }
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setAvailability((prev: any) => {
      const newSlots = [...prev[day].slots];
      newSlots.splice(index, 1);
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots }
      };
    });
  };

  const updateSlot = (day: string, index: number, field: 'start'|'end', value: string) => {
    setAvailability((prev: any) => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateExpertAvailability(availability);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Availability updated successfully");
    }
    setSaving(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hourStr = i.toString().padStart(2, '0');
        const minStr = j.toString().padStart(2, '0');
        options.push(`${hourStr}:${minStr}`);
      }
    }
    return options;
  };
  const timeOptions = generateTimeOptions();

  if (loading) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ExpertSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Availability</h1>
                <p className="text-[15px] text-text-sub">Set your weekly schedule for 1-on-1 consultations.</p>
              </div>
              <Button onClick={handleSave} disabled={saving} className="shrink-0 gap-2">
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-surface-1">
                <h2 className="text-[16px] font-bold text-navy-DEFAULT">Weekly Hours</h2>
              </div>
              
              <div className="flex flex-col">
                {DAYS.map((day, i) => (
                  <div key={day} className={`p-6 flex flex-col md:flex-row md:items-start gap-6 ${i !== DAYS.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="w-[140px] flex items-center gap-3 shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={availability[day]?.enabled} onChange={() => toggleDay(day)} />
                        <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-DEFAULT"></div>
                      </label>
                      <span className={`text-[15px] font-bold ${availability[day]?.enabled ? 'text-navy-DEFAULT' : 'text-text-muted'}`}>{day}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      {availability[day]?.enabled ? (
                        <>
                          {availability[day].slots.map((slot: any, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <select value={slot.start} onChange={(e) => updateSlot(day, index, 'start', e.target.value)} className="h-[44px] px-3 bg-white border border-border rounded-[8px] text-[14px] text-navy-DEFAULT focus:border-teal-DEFAULT outline-none transition-colors">
                                {timeOptions.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
                              </select>
                              <span className="text-text-muted">-</span>
                              <select value={slot.end} onChange={(e) => updateSlot(day, index, 'end', e.target.value)} className="h-[44px] px-3 bg-white border border-border rounded-[8px] text-[14px] text-navy-DEFAULT focus:border-teal-DEFAULT outline-none transition-colors">
                                {timeOptions.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
                              </select>
                              <button onClick={() => removeSlot(day, index)} className="w-[44px] h-[44px] flex items-center justify-center text-text-muted hover:text-red-DEFAULT hover:bg-red-50 rounded-[8px] transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => addSlot(day)} className="text-[14px] font-semibold text-teal-DEFAULT hover:text-teal-dark flex items-center gap-2 self-start mt-1">
                            <Plus size={16} /> Add slot
                          </button>
                        </>
                      ) : (
                        <div className="h-[44px] flex items-center text-[15px] text-text-muted italic">Unavailable</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
