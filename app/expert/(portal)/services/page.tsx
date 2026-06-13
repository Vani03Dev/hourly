"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import { createService, deleteService } from '@/app/actions/expert';
import toast from 'react-hot-toast';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('');

  const fetchServices = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('expert_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      // Defer to prevent synchronous render cascades
      await new Promise(resolve => setTimeout(resolve, 0));
      if (active) {
        fetchServices();
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = await createService({
      title,
      description,
      duration_minutes: parseInt(duration, 10),
      price: parseInt(price, 10)
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Service created successfully!');
      setShowModal(false);
      setTitle('');
      setDescription('');
      setPrice('');
      fetchServices();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const result = await deleteService(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Service deleted');
      fetchServices();
    }
  };

  return (
    <>
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12 relative">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Services</h1>
                <p className="text-[15px] text-text-sub">Create and manage your consultation offerings.</p>
              </div>
              <Button onClick={() => setShowModal(true)} className="shrink-0">
                <Plus size={18} className="mr-2" /> New Service
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-text-muted">Loading...</div>
            ) : services.length === 0 ? (
              <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4">
                  <FileText size={28} />
                </div>
                <h3 className="text-[20px] font-bold text-navy-DEFAULT mb-2">Create your first service</h3>
                <p className="text-[15px] text-text-sub max-w-md mx-auto mb-6">Offer 1-on-1 consultations, code reviews, or mock interviews to your audience.</p>
                <Button onClick={() => setShowModal(true)} variant="primary">
                  <Plus size={18} className="mr-2" /> Create Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white border border-border rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                    <button onClick={() => handleDelete(service.id)} className="absolute top-4 right-4 text-text-muted hover:text-red-DEFAULT opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-[18px] font-bold text-navy-DEFAULT mb-2 pr-6">{service.title}</div>
                    <div className="text-[14px] text-text-sub line-clamp-2 mb-4 h-[40px]">{service.description}</div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-[14px] font-medium text-text-muted">{service.duration_minutes} mins</div>
                      <div className="text-[16px] font-bold text-teal-DEFAULT">₹{service.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[24px] shadow-xl w-full max-w-[500px] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface-1">
              <h2 className="text-[18px] font-bold text-navy-DEFAULT">Create New Service</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-navy-DEFAULT">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[14px] font-bold text-navy-DEFAULT mb-2">Service Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 1-on-1 Mentorship" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-navy-DEFAULT mb-2">Description</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What will the mentee gain from this session?" className="w-full p-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-bold text-navy-DEFAULT mb-2">Duration (Mins)</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-navy-DEFAULT mb-2">Price (₹)</label>
                  <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="1000" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-1">{submitting ? 'Creating...' : 'Create Service'}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
