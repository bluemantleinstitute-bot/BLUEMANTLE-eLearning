"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { 
  Users, MessageSquare, Zap, ShieldAlert, 
  UserX, UserCheck, Scale, History, 
  Send, BrainCircuit, Activity, Clock, Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";

function ControlCenterContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const batchId = searchParams.get("batchId");

  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, user: "Julian Mayer", text: "Can you explain the structural integrity of the 'Void' concept in Mies van der Rohe's work?", time: "2m ago" },
    { id: 2, user: "Sarah Chen", text: "Is the lighting simulation for the Barcelona Pavilion based on seasonal variations?", time: "5m ago" }
  ]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatchData = async () => {
      if (!batchId) return;
      try {
        const res = await apiRequest(`/batches/${batchId}`);
        if (res.success && res.data.students) {
          // Map students to local state format
          const mappedStudents = res.data.students.map((s: any) => ({
            id: s._id,
            name: s.name,
            email: s.email,
            status: "active" // Default status
          }));
          setStudents(mappedStudents);
        }
      } catch (err) {
        console.error("Failed to load batch students", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBatchData();
  }, [batchId]);

  const handleSuspend = async (studentId: string) => {
    // Optimistic UI update
    setStudents(students.map(s => s.id === studentId ? { ...s, status: "suspended" } : s));
    alert(`Account Protocol Initiated: ${studentId} suspended for this session.`);
    // Note: To persist this, we would call an API like POST /api/live-classes/${classId}/suspend
  };

  const handleAiSuggest = (text: string) => {
    setAiSuggestion(`RE: ${text}\n\n"The concept of 'Void' in Modernist architecture refers to the intentional use of open space as a positive structural element..."`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-background min-h-screen">
      <header className="flex justify-between items-center border-b border-outline_variant/10 pb-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <Activity className="w-6 h-6 animate-pulse" />
           </div>
           <div>
              <h1 className="text-2xl font-manrope font-black tracking-tight">Mission Control</h1>
              <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Live Session Orchestration</p>
           </div>
        </div>
        
        <div className="flex gap-6">
           <div className="text-right">
              <p className="text-[10px] font-bold text-outline uppercase">Total Batch Capacity</p>
              <p className="text-xl font-black text-on_surface">{students.length}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-outline uppercase">Uptime</p>
              <p className="text-xl font-black text-secondary">00:00:00</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left: Audience Telemetry */}
        <div className="col-span-8 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <KnowledgeCard>
                 <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-sm">Live Interaction Stream</CardTitle>
                    <MessageSquare className="w-4 h-4 text-primary" />
                 </CardHeader>
                 <CardBody className="h-[400px] overflow-y-auto pr-4 space-y-6">
                    {messages.map(msg => (
                      <div key={msg.id} className="p-4 bg-surface_container_low rounded-2xl border border-outline_variant/10 relative group">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-on_surface uppercase">{msg.user}</span>
                            <span className="text-[10px] text-outline">{msg.time}</span>
                         </div>
                         <p className="text-sm leading-relaxed mb-4">{msg.text}</p>
                         <button 
                           onClick={() => handleAiSuggest(msg.text)}
                           className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                         >
                            <BrainCircuit className="w-3.5 h-3.5" /> AI Suggestion
                         </button>
                      </div>
                    ))}
                 </CardBody>
                 <div className="mt-6 pt-6 border-t border-outline_variant/10 flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Reply to session..."
                      className="flex-1 bg-surface_container_high border-none rounded-xl px-4 text-sm focus:ring-1 ring-primary outline-none"
                    />
                    <button className="p-3 bg-primary text-on_primary rounded-xl hover:scale-105 transition-transform">
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </KnowledgeCard>

              <div className="space-y-6">
                 {aiSuggestion && (
                   <KnowledgeCard className="bg-primary/5 border-primary/20 animate-in slide-in-from-right-4 duration-500">
                      <CardHeader className="flex justify-between items-center">
                         <CardTitle className="text-sm flex items-center gap-2">
                           <Zap className="w-4 h-4 text-primary" /> Copilot Recommendation
                         </CardTitle>
                      </CardHeader>
                      <CardBody>
                         <p className="text-xs italic leading-loose text-on_surface/80">
                            {aiSuggestion}
                         </p>
                         <button className="w-full mt-6 py-3 bg-primary/20 text-primary rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-on_primary transition-all" onClick={() => setAiSuggestion(null)}>
                            Insert Into Direct Feed
                         </button>
                      </CardBody>
                   </KnowledgeCard>
                 )}
                 
                 <KnowledgeCard className="bg-surface_container_highest border-none">
                    <CardHeader><CardTitle className="text-sm">Session Health</CardTitle></CardHeader>
                    <CardBody className="space-y-4">
                       <div className="flex justify-between items-center pb-3 border-b border-outline_variant/10">
                          <span className="text-[10px] font-bold uppercase text-outline">Network Latency</span>
                          <span className="text-xs font-black text-secondary">24ms</span>
                       </div>
                       <div className="flex justify-between items-center pb-3 border-b border-outline_variant/10">
                          <span className="text-[10px] font-bold uppercase text-outline">Frame Stability</span>
                          <span className="text-xs font-black text-secondary">99.8%</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase text-outline">Audio Stream</span>
                          <span className="text-xs font-black text-primary">OPTIMAL</span>
                       </div>
                    </CardBody>
                 </KnowledgeCard>
              </div>
           </div>
        </div>

        {/* Right: Disciplinary Control */}
        <div className="col-span-4 space-y-8">
           <KnowledgeCard className="border-error/10">
              <CardHeader className="flex justify-between items-center">
                 <CardTitle className="text-sm">Live Attendance & Conduct</CardTitle>
                 <Users className="w-4 h-4 text-outline" />
              </CardHeader>
              <CardBody className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                 {students.length === 0 && <p className="text-sm text-on_surface_variant">No students enrolled in this batch.</p>}
                 {students.map(s => (
                   <div key={s.id} className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${s.status === 'suspended' ? 'bg-error/5 border-error/20' : 'bg-surface_container_low border-outline_variant/10'}`}>
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-xs font-black uppercase text-on_surface truncate max-w-[150px]">{s.name}</p>
                            <p className="text-[9px] font-bold text-outline">ID: {s.id.slice(-5)}</p>
                         </div>
                         <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${s.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-error text-on_error'}`}>
                            {s.status}
                         </div>
                      </div>
                      
                      {s.status === 'active' ? (
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleSuspend(s.id)}
                             className="flex-1 py-2 bg-error/10 text-error rounded-lg text-[9px] font-bold uppercase hover:bg-error hover:text-white transition-all flex items-center justify-center gap-1.5"
                           >
                              <UserX className="w-3 h-3" /> Suspend
                           </button>
                           <button className="flex-1 py-2 bg-surface_container_highest border border-outline_variant/20 rounded-lg text-[9px] font-bold uppercase hover:bg-surface_container transition-all">
                              Terminate
                           </button>
                        </div>
                      ) : (
                        <p className="text-[9px] font-bold text-error italic uppercase">Account Locked Globally</p>
                      )}
                   </div>
                 ))}
              </CardBody>
              <div className="mt-8">
                 <button className="w-full py-4 border-2 border-dashed border-outline_variant/20 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-outline hover:text-primary hover:border-primary/50 transition-all">
                    <ShieldAlert className="w-4 h-4" /> SOS Admin Assistance
                 </button>
              </div>
           </KnowledgeCard>
        </div>

      </div>
    </div>
  );
}

export default function MissionControlCenter() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <ControlCenterContent />
    </Suspense>
  );
}
