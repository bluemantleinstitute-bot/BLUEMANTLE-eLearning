"use client";

import { useState, useEffect } from "react";
import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { 
  Calendar, Clock, MapPin, Users, BookOpen, 
  AlertCircle, ChevronRight, Activity, MoreVertical,
  CalendarDays, Share2, UserCheck, MessageSquare, CheckCircle2,
  Plus, Trash2, Edit2, RefreshCw, X
} from "lucide-react";
import { db } from "@/lib/db";

export default function ClassSchedule() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeActions, setActiveActions] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    batchId: "",
    topic: "",
    date: "",
    duration: 60
  });

  // Edit Modal State
  const [editingClass, setEditingClass] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, teacherData] = await Promise.all([
        db.user.getTeacherClasses(),
        db.user.getTeacherData()
      ]);
      setSchedule(classesData || []);
      setBatches(teacherData.assignedBatches || []);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const triggerNotification = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchId || !formData.date) return;

    try {
      setSubmitting(true);
      const res = await db.user.scheduleLiveClass(formData);
      if (res.success) {
        triggerNotification("Live class scheduled successfully!");
        setFormData({ batchId: "", topic: "", date: "", duration: 60 });
        await fetchData();
      } else {
        alert(res.message || "Failed to schedule class");
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled class?")) return;
    try {
      const res = await db.user.deleteLiveClass(id);
      if (res.success) {
        triggerNotification("Class cancelled successfully.");
        await fetchData();
      }
    } catch (err) {
      alert("Error deleting class");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await db.user.updateLiveClass(editingClass._id, editingClass);
      if (res.success) {
        triggerNotification("Class updated successfully.");
        setEditingClass(null);
        await fetchData();
      }
    } catch (err) {
      alert("Error updating class");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-on_surface_variant animate-pulse font-medium">Synchronizing Academic Calendar...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {statusMsg && (
        <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-8 fade-in flex items-center gap-3 bg-secondary_container text-on_secondary_container p-4 rounded-2xl shadow-ambient border border-secondary/20">
           <div className="p-2 bg-secondary text-on_secondary rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
           </div>
           <div>
              <p className="font-bold text-sm">Action Confirmed</p>
              <p className="text-xs opacity-80">{statusMsg}</p>
           </div>
        </div>
      )}

      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-manrope font-bold tracking-tight mb-2">Class Schedule</h1>
          <p className="text-on_surface_variant max-w-2xl text-sm italic">
            "Orchestrate your live teaching sessions with surgical precision."
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LHS: Scheduled Classes */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-2">
              <div className="flex gap-4 items-center">
                 <h2 className="text-xl font-bold font-manrope text-on_surface">Scheduled Sessions</h2>
                 <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{schedule.length} Total</span>
              </div>
           </div>

           <div className="space-y-4">
              {schedule.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-outline_variant/20 rounded-3xl">
                   <Calendar className="w-10 h-10 text-outline/30 mx-auto mb-4" />
                   <p className="text-on_surface_variant font-medium">No live classes scheduled.</p>
                </div>
              ) : (
                schedule.map((item) => (
                  <div key={item._id} className="relative group">
                    <KnowledgeCard className="p-0 overflow-hidden hover:border-primary/30 transition-all shadow-sm">
                      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-outline_variant/10">
                          <div className="p-6 md:w-48 bg-surface_container_low/50 flex flex-col justify-center items-center md:items-start relative overflow-hidden">
                             <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}
                             </p>
                             <h4 className="text-xl font-bold font-manrope text-on_surface">
                                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </h4>
                             <div className="absolute top-0 right-0 p-2 opacity-5">
                                <CalendarDays className="w-12 h-12" />
                             </div>
                          </div>
                          
                          <div className="p-6 flex-1 flex flex-col justify-center relative">
                             <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg text-on_surface group-hover:text-primary transition-colors leading-snug">{item.topic}</h3>
                                <div className="flex gap-2">
                                   <button 
                                      onClick={() => setEditingClass(item)}
                                      className="p-2 hover:bg-surface_container_high rounded-lg text-outline hover:text-primary transition-colors"
                                   >
                                      <Edit2 className="w-4 h-4" />
                                   </button>
                                   <button 
                                      onClick={() => handleDelete(item._id)}
                                      className="p-2 hover:bg-surface_container_high rounded-lg text-outline hover:text-error transition-colors"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3">
                                Date: {new Date(item.date).toLocaleDateString()} · Duration: {item.duration} Mins
                             </p>
                             <div className="flex flex-wrap items-center gap-4">
                                <span className="text-xs text-on_surface_variant flex items-center gap-1.5 font-medium bg-surface_container_high px-3 py-1 rounded-full">
                                   <Users className="w-3.5 h-3.5 text-primary" /> {item.batchId?.name}
                                </span>
                                <span className="text-xs text-on_surface_variant flex items-center gap-1.5 font-medium bg-surface_container_high px-3 py-1 rounded-full">
                                   <Activity className={`w-3.5 h-3.5 ${item.status === 'live' ? 'text-error animate-pulse' : 'text-outline'}`} /> 
                                   Status: {item.status.toUpperCase()}
                                </span>
                             </div>
                          </div>
                      </div>
                    </KnowledgeCard>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* RHS: Schedule Form */}
        <div className="space-y-8">
           <KnowledgeCard className="p-8 border-primary/20 shadow-glow-primary/5">
              <div className="flex gap-4 items-center mb-8">
                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Plus className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider leading-none mb-1">Provisioning</p>
                    <h3 className="text-xl font-bold font-manrope">New Live Class</h3>
                 </div>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Target Batch *</label>
                    <select 
                       required
                       suppressHydrationWarning
                       value={formData.batchId}
                       onChange={e => setFormData({...formData, batchId: e.target.value})}
                       className="w-full bg-surface_container_low border border-outline_variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                    >
                       <option value="">Select Batch</option>
                       {batches.map(b => (
                         <option key={b._id} value={b._id}>{b.name}</option>
                       ))}
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Session Topic *</label>
                    <input 
                       required
                       suppressHydrationWarning
                       type="text"
                       placeholder="e.g. Technical Analysis Deep Dive"
                       value={formData.topic}
                       onChange={e => setFormData({...formData, topic: e.target.value})}
                       className="w-full bg-surface_container_low border border-outline_variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Date & Time *</label>
                       <input 
                          required
                          suppressHydrationWarning
                          type="datetime-local"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-surface_container_low border border-outline_variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Duration (Mins)</label>
                       <input 
                          required
                          suppressHydrationWarning
                          type="number"
                          value={formData.duration}
                          onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                          className="w-full bg-surface_container_low border border-outline_variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                       />
                    </div>
                 </div>

                 <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-sm shadow-ambient hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Confirm Schedule
                 </button>
              </form>
           </KnowledgeCard>

           <div className="p-8 rounded-[2rem] bg-surface_container_low border border-outline_variant/20 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
                 <Share2 className="w-24 h-24" />
              </div>
              <div className="flex gap-4 items-start mb-4">
                 <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <h4 className="font-bold text-on_surface text-sm">System Protocol</h4>
              </div>
              <p className="text-[11px] text-on_surface_variant leading-relaxed mb-6">
                 All schedule changes trigger automated WhatsApp and Email notifications to enrolled students. Class recordings will be automatically processed and available in the curriculum workspace within 2 hours of completion.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                 <Activity className="w-3 h-3" /> Zoom Gateway: Online
              </div>
           </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-surface_container_lowest w-full max-w-lg rounded-3xl shadow-ambient border border-outline_variant/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-8 border-b border-outline_variant/10">
                 <h2 className="text-2xl font-bold text-on_surface font-manrope">Edit Scheduled Class</h2>
                 <button onClick={() => setEditingClass(null)} className="text-on_surface_variant hover:text-on_surface p-2 rounded-full hover:bg-surface_container_high transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Topic</label>
                    <input 
                       required
                       type="text"
                       value={editingClass.topic}
                       onChange={e => setEditingClass({...editingClass, topic: e.target.value})}
                       className="w-full bg-surface_container_high border border-outline_variant/30 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Date & Time</label>
                       <input 
                          required
                          type="datetime-local"
                          value={new Date(new Date(editingClass.date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                          onChange={e => setEditingClass({...editingClass, date: e.target.value})}
                          className="w-full bg-surface_container_high border border-outline_variant/30 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Duration (Mins)</label>
                       <input 
                          required
                          type="number"
                          value={editingClass.duration}
                          onChange={e => setEditingClass({...editingClass, duration: parseInt(e.target.value)})}
                          className="w-full bg-surface_container_high border border-outline_variant/30 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/50 text-on_surface"
                       />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingClass(null)} className="flex-1 py-4 rounded-2xl font-bold text-sm text-on_surface_variant hover:bg-surface_container_high transition-colors">
                       Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="flex-1 bg-primary text-on_primary py-4 rounded-2xl font-bold text-sm shadow-ambient hover:scale-[1.02] transition-all disabled:opacity-50">
                       {submitting ? "Saving..." : "Update Schedule"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
