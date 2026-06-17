"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
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
                <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">Services</h1>
                <p className="text-[15px] text-muted">Create and manage your consultation offerings.</p>
              </div>
              <Button onClick={() => setShowModal(true)} className="shrink-0">
                <Plus size={18} className="mr-2" /> New Service
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted">Loading...</div>
            ) : services.length === 0 ? (
              <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-muted mb-4">
                  <FileText size={28} />
                </div>
                <h3 className="text-[20px] font-bold text-primary mb-2">Create your first service</h3>
                <p className="text-[15px] text-muted max-w-md mx-auto mb-6">Offer 1-on-1 consultations, code reviews, or mock interviews to your audience.</p>
                <Button onClick={() => setShowModal(true)} variant="primary">
                  <Plus size={18} className="mr-2" /> Create Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full">
                    {/* Delete Action - Top Right */}
                    <button 
                      onClick={() => handleDelete(service.id)} 
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 transform hover:scale-110"
                      title="Delete Service"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal/10 group-hover:bg-teal group-hover:text-white transition-colors duration-300">
                        <FileText size={22} className="text-teal group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="pt-1 pr-6">
                        <div className="text-[12px] font-bold text-teal uppercase tracking-wider mb-1">1-ON-1 SESSION</div>
                        <h3 className="text-[18px] font-extrabold text-primary leading-tight line-clamp-2">{service.title}</h3>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="text-[14px] text-muted line-clamp-2 mb-6 flex-grow leading-relaxed">
                      {service.description}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-1.5 text-[14px] font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {service.duration_minutes} Mins
                      </div>
                      <div className="text-[20px] font-extrabold text-primary">
                        ₹{service.price}
                      </div>
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[24px] shadow-xl w-full max-w-[500px] flex flex-col relative">
            <div className="flex items-center justify-between p-6 border-b border-border bg-bg rounded-t-[24px]">
              <h2 className="text-[18px] font-bold text-primary">Create New Service</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-muted hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[14px] font-bold text-primary mb-2">Service Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 1-on-1 Mentorship" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-primary mb-2">Description</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What will the mentee gain from this session?" className="w-full p-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-bold text-primary mb-2">Duration (Mins)</label>
                  <CustomSelect 
                    value={duration} 
                    onChange={setDuration} 
                    options={[
                      { label: '15 minutes', value: '15' },
                      { label: '30 minutes', value: '30' },
                      { label: '45 minutes', value: '45' },
                      { label: '60 minutes', value: '60' },
                    ]} 
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-primary mb-2">Price (₹)</label>
                  <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="1000" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
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
