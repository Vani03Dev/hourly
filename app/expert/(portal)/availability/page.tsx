"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Save,
  Calendar as CalendarIcon, Clock, Ban, Video, Copy, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import { updateExpertAvailability } from '@/app/actions/expert';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type TimeSlot = { start: string; end: string };
type DaySchedule = { enabled: boolean; slots: TimeSlot[] };
type WeeklySchedule = Record<string, DaySchedule>;
type DateOverrides = Record<string, TimeSlot[]>;
type Booking = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  client_profiles?: { first_name?: string; last_name?: string } | null;
};

const defaultWeeklySchedule = (): WeeklySchedule =>
  DAYS.reduce((acc, day) => {
    acc[day] = {
      enabled: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day),
      slots: [{ start: '09:00', end: '17:00' }],
    };
    return acc;
  }, {} as WeeklySchedule);

function formatDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function generateTimeOptions() {
  const options: string[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      options.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();

function normalizeTime(value: string): string {
  if (!value) return '09:00';
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '09:00';

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function normalizeSlot(slot: Partial<TimeSlot>): TimeSlot {
  return {
    start: normalizeTime(slot.start || '09:00'),
    end: normalizeTime(slot.end || '17:00'),
  };
}

function normalizeWeeklySchedule(raw: unknown): WeeklySchedule {
  const result = defaultWeeklySchedule();
  if (!raw || typeof raw !== 'object') return result;

  for (const day of DAYS) {
    const dayData = (raw as Record<string, unknown>)[day];
    if (!dayData) continue;

    if (typeof dayData === 'object' && dayData !== null && 'enabled' in dayData) {
      const schedule = dayData as DaySchedule;
      const slots = Array.isArray(schedule.slots)
        ? schedule.slots.map((slot) => normalizeSlot(slot))
        : [{ start: '09:00', end: '17:00' }];

      result[day] = {
        enabled: !!schedule.enabled,
        slots: slots.length > 0 ? slots : [{ start: '09:00', end: '17:00' }],
      };
      continue;
    }

    if (Array.isArray(dayData)) {
      const slots = dayData.map((slot) => normalizeSlot(slot as Partial<TimeSlot>));
      result[day] = {
        enabled: slots.length > 0,
        slots: slots.length > 0 ? slots : [{ start: '09:00', end: '17:00' }],
      };
    }
  }

  return result;
}

function timeToMinutes(time: string) {
  const [h, m] = normalizeTime(time).split(':').map(Number);
  return h * 60 + m;
}

function formatDuration(start: string, end: string) {
  const diff = timeToMinutes(end) - timeToMinutes(start);
  if (diff <= 0) return 'Invalid';
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<WeeklySchedule>(defaultWeeklySchedule);
  const [dateOverrides, setDateOverrides] = useState<DateOverrides>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const now = new Date();
    return formatDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [selectedWeekday, setSelectedWeekday] = useState<string>('Monday');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markDirty = () => setHasUnsavedChanges(true);

  const fetchMonthBookings = useCallback(async (year: number, month: number, expertId: string) => {
    const supabase = createClient();
    const monthStart = formatDateStr(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const monthEnd = formatDateStr(year, month, lastDay);

    const { data } = await supabase
      .from('bookings')
      .select(`
        id, booking_date, start_time, end_time, status, payment_status,
        client_profiles(first_name, last_name)
      `)
      .eq('expert_id', expertId)
      .gte('booking_date', monthStart)
      .lte('booking_date', monthEnd)
      .neq('status', 'canceled')
      .order('booking_date', { ascending: true });

    setBookings(data || []);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('expert_profiles')
        .select('weekly_schedule, date_overrides')
        .eq('id', user.id)
        .single();

      if (data?.weekly_schedule && Object.keys(data.weekly_schedule).length > 0) {
        setAvailability(normalizeWeeklySchedule(data.weekly_schedule));
      }
      if (data?.date_overrides) {
        setDateOverrides(data.date_overrides);
      }

      await fetchMonthBookings(calendarYear, calendarMonth, user.id);
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadBookings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await fetchMonthBookings(calendarYear, calendarMonth, user.id);
    }
    if (!loading) loadBookings();
  }, [calendarYear, calendarMonth, fetchMonthBookings, loading]);

  const { daysInMonth, firstDayIndex } = useMemo(() => {
    const total = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    let first = new Date(calendarYear, calendarMonth, 1).getDay() - 1;
    if (first === -1) first = 6;
    return { daysInMonth: total, firstDayIndex: first };
  }, [calendarYear, calendarMonth]);

  const monthLabel = new Date(calendarYear, calendarMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.booking_date]) map[b.booking_date] = [];
      map[b.booking_date].push(b);
    });
    return map;
  }, [bookings]);

  const getDayStatus = (day: number) => {
    const dateStr = formatDateStr(calendarYear, calendarMonth, day);
    const dateObj = new Date(calendarYear, calendarMonth, day);
    const dayName = DAY_NAMES[dateObj.getDay()];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = dateObj < today;

    const override = dateOverrides[dateStr];
    const isBlocked = override !== undefined && Array.isArray(override) && override.length === 0;
    const weeklyAvailable = availability[dayName]?.enabled && (availability[dayName]?.slots?.length ?? 0) > 0;
    const isAvailable = override !== undefined
      ? Array.isArray(override) && override.length > 0
      : weeklyAvailable;

    const dayBookings = bookingsByDate[dateStr] || [];

    if (isPast) return { dateStr, status: 'past' as const, dayBookings, isBlocked, isAvailable };
    if (isBlocked) return { dateStr, status: 'blocked' as const, dayBookings, isBlocked, isAvailable };
    if (dayBookings.length > 0) return { dateStr, status: 'booked' as const, dayBookings, isBlocked, isAvailable };
    if (isAvailable) return { dateStr, status: 'available' as const, dayBookings, isBlocked, isAvailable };
    return { dateStr, status: 'unavailable' as const, dayBookings, isBlocked, isAvailable };
  };

  const selectedDayBookings = selectedDate ? bookingsByDate[selectedDate] || [] : [];
  const selectedOverride = selectedDate ? dateOverrides[selectedDate] : undefined;
  const selectedIsBlocked = selectedOverride !== undefined && Array.isArray(selectedOverride) && selectedOverride.length === 0;

  const changeMonth = (delta: number) => {
    let newMonth = calendarMonth + delta;
    let newYear = calendarYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => {
      const current = prev[day] || { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
      const enabled = !current.enabled;
      return {
        ...prev,
        [day]: {
          enabled,
          slots: enabled && current.slots.length === 0
            ? [{ start: '09:00', end: '17:00' }]
            : current.slots,
        },
      };
    });
    markDirty();
  };

  const addSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, { start: '09:00', end: '17:00' }] },
    }));
    markDirty();
  };

  const removeSlot = (day: string, index: number) => {
    setAvailability((prev) => {
      const newSlots = [...prev[day].slots];
      newSlots.splice(index, 1);
      const enabled = newSlots.length > 0 ? prev[day].enabled : false;
      return {
        ...prev,
        [day]: {
          enabled,
          slots: newSlots.length > 0 ? newSlots : [{ start: '09:00', end: '17:00' }],
        },
      };
    });
    markDirty();
  };

  const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability((prev) => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, [day]: { ...prev[day], slots: newSlots } };
    });
    markDirty();
  };

  const applyWeekdayPreset = () => {
    const preset: DaySchedule = {
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }],
    };
    setAvailability((prev) => {
      const next = { ...prev };
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
        next[day] = { ...preset, slots: [{ ...preset.slots[0] }] };
      });
      ['Saturday', 'Sunday'].forEach((day) => {
        next[day] = { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
      });
      return next;
    });
    toast.success('Weekdays set to 9 AM – 5 PM');
    markDirty();
  };

  const copyDayToWeekdays = (sourceDay: string) => {
    const source = availability[sourceDay];
    if (!source?.enabled) {
      toast.error('Enable and configure this day first');
      return;
    }
    setAvailability((prev) => {
      const next = { ...prev };
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
        next[day] = {
          enabled: true,
          slots: source.slots.map((slot) => ({ ...slot })),
        };
      });
      return next;
    });
    toast.success(`Copied ${sourceDay} to all weekdays`);
    markDirty();
  };

  const activeDaySchedule = availability[selectedWeekday] || { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
  const activeDayTotal = activeDaySchedule.enabled
    ? activeDaySchedule.slots.reduce((sum, slot) => {
        const diff = timeToMinutes(slot.end) - timeToMinutes(slot.start);
        return sum + (diff > 0 ? diff : 0);
      }, 0)
    : 0;

  const toggleBlockSelectedDate = () => {
    if (!selectedDate) return;
    setDateOverrides((prev) => {
      const next = { ...prev };
      if (next[selectedDate] !== undefined && Array.isArray(next[selectedDate]) && next[selectedDate].length === 0) {
        delete next[selectedDate];
        toast.success('Date unblocked — follows weekly schedule');
      } else {
        next[selectedDate] = [];
        toast.success('Date blocked');
      }
      return next;
    });
    markDirty();
  };

  const handleSave = async () => {
    for (const day of DAYS) {
      const schedule = availability[day];
      if (!schedule?.enabled) continue;
      for (const slot of schedule.slots) {
        if (timeToMinutes(slot.end) <= timeToMinutes(slot.start)) {
          toast.error(`${day}: end time must be after start time`);
          return;
        }
      }
    }

    setSaving(true);
    const result = await updateExpertAvailability(availability, dateOverrides);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Availability saved successfully');
      setHasUnsavedChanges(false);
    }
    setSaving(false);
  };

  const dayCellClass = (status: string, isSelected: boolean) => {
    const base = 'aspect-square flex flex-col items-center justify-center rounded-[10px] text-[14px] font-semibold transition-all border-2 relative';
    if (isSelected) return `${base} border-teal bg-teal text-white shadow-sm`;
    switch (status) {
      case 'past':
        return `${base} border-transparent text-gray-300 cursor-default`;
      case 'blocked':
        return `${base} border-transparent bg-red-50 text-red-500 cursor-pointer hover:border-red-200`;
      case 'booked':
        return `${base} border-transparent bg-teal-50 text-teal cursor-pointer hover:border-teal/30`;
      case 'available':
        return `${base} border-transparent bg-gray-50 text-primary cursor-pointer hover:border-teal/30 hover:bg-teal-50/50`;
      default:
        return `${base} border-transparent text-gray-300 cursor-pointer hover:border-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-100 rounded w-1/3" />
          <div className="h-[360px] bg-gray-100 rounded-[16px]" />
          <div className="h-[200px] bg-gray-100 rounded-[16px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">Availability</h1>
          <p className="text-[15px] text-muted">Manage your weekly hours, block dates, and view upcoming bookings.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shrink-0 gap-2">
          <Save size={16} /> {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes*' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-primary flex items-center gap-2">
              <CalendarIcon size={18} className="text-teal" />
              {monthLabel}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="w-9 h-9 flex items-center justify-center border border-border rounded-[8px] hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="w-9 h-9 flex items-center justify-center border border-border rounded-[8px] hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEKDAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[11px] font-bold text-muted uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { dateStr, status, dayBookings } = getDayStatus(day);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={status === 'past'}
                    onClick={() => setSelectedDate(dateStr)}
                    className={dayCellClass(status, isSelected)}
                  >
                    <span>{day}</span>
                    {dayBookings.length > 0 && !isSelected && (
                      <span className="absolute bottom-1 flex gap-0.5">
                        {dayBookings.slice(0, 3).map((_, idx) => (
                          <span key={idx} className="w-1 h-1 rounded-full bg-teal" />
                        ))}
                      </span>
                    )}
                    {status === 'blocked' && !isSelected && (
                      <Ban size={10} className="absolute bottom-1 text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
              {[
                { color: 'bg-gray-50 border-gray-200', label: 'Available' },
                { color: 'bg-teal-50 border-teal/20', label: 'Has booking' },
                { color: 'bg-red-50 border-red-200', label: 'Blocked' },
                { color: 'bg-white border-gray-200', label: 'Unavailable' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[12px] text-muted">
                  <span className={`w-3 h-3 rounded-full border ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected date panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-border rounded-[16px] shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-primary mb-1">
              {selectedDate
                ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })
                : 'Select a date'}
            </h3>
            <p className="text-[13px] text-muted mb-4">
              {selectedIsBlocked
                ? 'This date is manually blocked.'
                : selectedDayBookings.length > 0
                  ? `${selectedDayBookings.length} booking${selectedDayBookings.length > 1 ? 's' : ''} scheduled`
                  : 'No bookings on this date.'}
            </p>

            {selectedDate && (
              <Button
                variant={selectedIsBlocked ? 'outline' : 'danger'}
                size="sm"
                className="w-full gap-2 mb-4"
                onClick={toggleBlockSelectedDate}
              >
                <Ban size={14} />
                {selectedIsBlocked ? 'Unblock this date' : 'Block this date'}
              </Button>
            )}

            {selectedDayBookings.length > 0 ? (
              <div className="space-y-3">
                {selectedDayBookings.map((booking) => {
                  const client = booking.client_profiles;
                  const clientName = `${client?.first_name || ''} ${client?.last_name || ''}`.trim() || 'Client';
                  return (
                    <div key={booking.id} className="p-4 rounded-[10px] border border-border bg-gray-50/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal flex items-center justify-center font-bold text-[13px]">
                          {clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-primary">{clientName}</div>
                          <div className="text-[12px] text-muted capitalize">{booking.payment_status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-primary font-medium">
                        <Clock size={14} className="text-teal" />
                        {booking.start_time} – {booking.end_time}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted text-[13px]">
                <Video size={24} className="mx-auto mb-2 opacity-40" />
                No sessions booked for this day
              </div>
            )}
          </div>

          <div className="bg-white border border-border rounded-[16px] shadow-sm p-6">
            <h2 className="text-[14px] font-bold text-primary mb-2">Google Calendar Sync</h2>
            <p className="text-[13px] text-muted mb-4">
              Connect Google Calendar to auto-block busy times and prevent double bookings.
            </p>
            <a
              href="/api/auth/google"
              className="inline-flex items-center justify-center w-full h-[40px] bg-gray-50 hover:bg-gray-100 border border-border text-primary font-semibold text-[14px] rounded-[8px] transition-colors"
            >
              Connect Calendar
            </a>
          </div>
        </div>
      </div>

      {/* Weekly hours */}
      <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-primary">Weekly Hours</h2>
            <p className="text-[13px] text-muted mt-1">Tap a day to edit. Toggle on/off and set your available time slots.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={applyWeekdayPreset}>
              <Zap size={14} /> Weekdays 9–5
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => copyDayToWeekdays(selectedWeekday)}
            >
              <Copy size={14} /> Copy {selectedWeekday.slice(0, 3)} to weekdays
            </Button>
          </div>
        </div>

        {/* Day selector pills */}
        <div className="p-4 md:px-6 border-b border-border flex gap-2 overflow-x-auto">
          {DAYS.map((day) => {
            const schedule = availability[day];
            const isActive = selectedWeekday === day;
            const isEnabled = schedule?.enabled;
            const slotCount = schedule?.slots?.length ?? 0;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedWeekday(day)}
                className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-[12px] border-2 transition-all min-w-[72px] ${
                  isActive
                    ? 'border-teal bg-teal-50 shadow-sm'
                    : 'border-transparent bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className={`text-[13px] font-bold ${isActive ? 'text-teal' : isEnabled ? 'text-primary' : 'text-muted'}`}>
                  {day.slice(0, 3)}
                </span>
                <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-teal' : 'bg-gray-300'}`} />
                {isEnabled && (
                  <span className="text-[10px] text-muted font-medium">{slotCount} slot{slotCount !== 1 ? 's' : ''}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active day editor */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                role="switch"
                aria-checked={activeDaySchedule.enabled}
                onClick={() => toggleDay(selectedWeekday)}
                className={`relative w-12 h-7 rounded-full transition-colors ${activeDaySchedule.enabled ? 'bg-teal' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    activeDaySchedule.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div>
                <h3 className="text-[18px] font-bold text-primary">{selectedWeekday}</h3>
                <p className="text-[13px] text-muted">
                  {activeDaySchedule.enabled
                    ? `${activeDayTotal >= 60 ? `${Math.floor(activeDayTotal / 60)}h ${activeDayTotal % 60 ? `${activeDayTotal % 60}m` : ''}`.trim() : `${activeDayTotal}m`} available`
                    : 'Day is off — clients cannot book'}
                </p>
              </div>
            </div>
            {activeDaySchedule.enabled && (
              <Button type="button" variant="teal-outline" size="sm" className="gap-2 shrink-0" onClick={() => addSlot(selectedWeekday)}>
                <Plus size={14} /> Add time slot
              </Button>
            )}
          </div>

          {activeDaySchedule.enabled ? (
            <div className="space-y-3">
              {activeDaySchedule.slots.map((slot, index) => {
                const isInvalid = timeToMinutes(slot.end) <= timeToMinutes(slot.start);
                return (
                  <div
                    key={`${selectedWeekday}-${index}`}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[12px] border transition-colors ${
                      isInvalid ? 'border-red-200 bg-red-50/50' : 'border-border bg-gray-50/30 hover:border-teal/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-muted shrink-0">
                      <Clock size={16} className="text-teal" />
                      Slot {index + 1}
                    </div>
                    <div className="flex flex-1 items-center gap-3 flex-wrap">
                      <select
                        value={slot.start}
                        onChange={(e) => updateSlot(selectedWeekday, index, 'start', e.target.value)}
                        className="h-[44px] px-3 bg-white border border-border rounded-[8px] text-[14px] text-primary focus:border-teal focus:ring-2 focus:ring-teal/15 outline-none transition-all min-w-[110px]"
                      >
                        {timeOptions.map((t) => (
                          <option key={`start-${selectedWeekday}-${index}-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="text-muted font-medium">to</span>
                      <select
                        value={slot.end}
                        onChange={(e) => updateSlot(selectedWeekday, index, 'end', e.target.value)}
                        className="h-[44px] px-3 bg-white border border-border rounded-[8px] text-[14px] text-primary focus:border-teal focus:ring-2 focus:ring-teal/15 outline-none transition-all min-w-[110px]"
                      >
                        {timeOptions.map((t) => (
                          <option key={`end-${selectedWeekday}-${index}-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className={`text-[12px] font-medium ${isInvalid ? 'text-red-500' : 'text-teal'}`}>
                        {formatDuration(slot.start, slot.end)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlot(selectedWeekday, index)}
                      disabled={activeDaySchedule.slots.length === 1}
                      className="w-[44px] h-[44px] flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 self-end sm:self-center"
                      title={activeDaySchedule.slots.length === 1 ? 'Disable day instead' : 'Remove slot'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-[12px] border border-dashed border-border bg-gray-50/50">
              <Clock size={32} className="mx-auto mb-3 text-muted opacity-40" />
              <p className="text-[15px] font-semibold text-primary mb-1">{selectedWeekday} is unavailable</p>
              <p className="text-[13px] text-muted mb-4">Turn on the toggle above to let clients book on this day.</p>
              <Button type="button" variant="outline" size="sm" onClick={() => toggleDay(selectedWeekday)}>
                Enable {selectedWeekday}
              </Button>
            </div>
          )}
        </div>

        {/* Week overview strip */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day) => {
              const schedule = availability[day];
              const enabled = schedule?.enabled;
              const firstSlot = enabled && schedule.slots[0];
              return (
                <button
                  key={`overview-${day}`}
                  type="button"
                  onClick={() => setSelectedWeekday(day)}
                  className={`p-3 rounded-[10px] text-left border transition-all ${
                    selectedWeekday === day ? 'border-teal bg-teal-50' : 'border-border bg-white hover:border-teal/30'
                  }`}
                >
                  <div className="text-[11px] font-bold text-muted uppercase mb-1">{day.slice(0, 3)}</div>
                  {enabled && firstSlot ? (
                    <div className="text-[12px] font-semibold text-primary leading-tight">
                      {firstSlot.start}–{firstSlot.end}
                      {schedule.slots.length > 1 && (
                        <span className="block text-[10px] text-teal font-medium mt-0.5">+{schedule.slots.length - 1} more</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[12px] text-muted italic">Off</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
