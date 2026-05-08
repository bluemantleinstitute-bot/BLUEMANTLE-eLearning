"use client";

import { useState, useMemo } from "react";
import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { DataTable } from "@/components/DataTable";
import { 
  Download, Star, Clock, CheckCircle2, AlertCircle, 
  TrendingUp, Users, X, Mail, Phone, Calendar, 
  Award, Activity, Zap, ExternalLink 
} from "lucide-react";

// Aggregated QA data
const QA_RECORDS = [
  { id: 1, teacherId: "TCH-001", teacher: "Dr. Vance",   batch: "CS-2024-B4",  student: "Alice Waverly", studentId: "STU-8901", subject: "Data Structures",   question: "Why is Red-Black tree preferred over AVL?",        submittedAt: "Oct 24, 2024 09:15", resolvedAt: "Oct 24, 2024 11:30", status: "Resolved", responseTime: "2h 15m" },
  { id: 2, teacherId: "TCH-001", teacher: "Dr. Vance",   batch: "CS-2024-B4",  student: "Julian Chen",   studentId: "STU-8824", subject: "Quantum Computing", question: "How does QFT isolate period in Shor's algorithm?",  submittedAt: "Oct 22, 2024 14:30", resolvedAt: "Oct 22, 2024 18:10", status: "Resolved", responseTime: "3h 40m" },
  { id: 3, teacherId: "TCH-002", teacher: "Prof. Smith", batch: "DES-2024-A1", student: "Sienna Rossi",  studentId: "STU-8901", subject: "Design Theory",     question: "Difference between UX and UI in system design?",   submittedAt: "Oct 23, 2024 10:00", resolvedAt: "Oct 23, 2024 12:45", status: "Resolved", responseTime: "2h 45m" },
  { id: 4, teacherId: "TCH-001", teacher: "Dr. Vance",   batch: "CS-2024-B4",  student: "John Doe",      studentId: "STU-8821", subject: "Machine Learning",  question: "Can backprop work without differentiable activation?", submittedAt: "Oct 24, 2024 11:42", resolvedAt: "",                   status: "Pending",  responseTime: "—"      },
  { id: 5, teacherId: "TCH-002", teacher: "Prof. Smith", batch: "DES-2024-A1", student: "Amara Okafor",  studentId: "STU-8905", subject: "Color Theory",      question: "How do complementary colors affect readability?",  submittedAt: "Oct 25, 2024 09:00", resolvedAt: "",                   status: "New",      responseTime: "—"      },
];

// Extended Student Profiles for the "Dossier"
const STUDENT_PROFILES: Record<string, any> = {
  "STU-8901": {
    name: "Alice Waverly",
    email: "a.waverly@academy.edu",
    phone: "+44 7700 900077",
    enrollment: "Jan 12, 2024",
    batch: "DES-2024-A1",
    attendance: "94%",
    progress: "88%",
    xp: "2,450",
    rank: "Elite Scholar",
    behavioralTags: ["Highly Active", "Early Submitter"],
    bio: "Alice is an Advanced Design student with a focus on system-level UX. She consistently outperforms in theoretical assessments."
  },
  "STU-8824": {
    name: "Julian Chen",
    email: "j.chen@academy.edu",
    phone: "+44 7700 900551",
    enrollment: "Feb 05, 2024",
    batch: "CS-2024-B4",
    attendance: "98%",
    progress: "92%",
    xp: "3,100",
    rank: "Grandmaster",
    behavioralTags: ["Fast Learner", "Problem Solver"],
    bio: "Julian specialized in Quantum Computing and Algorithms. He is currently leading the batch in complex logic implementations."
  },
  "STU-8821": {
    name: "John Doe",
    email: "john.doe@academy.edu",
    phone: "+44 7700 900882",
    enrollment: "Mar 10, 2024",
    batch: "CS-2024-B4",
    attendance: "72%",
    progress: "45%",
    xp: "850",
    rank: "Apprentice",
    behavioralTags: ["Needs Attention", "Late Submitter"],
    bio: "John is currently lagging behind in Machine Learning modules. Recommendation: Intensive doubt clearing sessions."
  },
  "STU-8905": {
    name: "Amara Okafor",
    email: "amara.o@academy.edu",
    phone: "+44 7700 900123",
    enrollment: "Apr 22, 2024",
    batch: "DES-2024-A1",
    attendance: "85%",
    progress: "60%",
    xp: "1,200",
    rank: "Professional",
    behavioralTags: ["Steady Progress"],
    bio: "Amara focuses on Visual Arts and Color Theory. She shows a strong grasp of design fundamentals."
  }
};

// Aggregate per teacher
function buildTeacherStats(records: typeof QA_RECORDS) {
  const map: Record<string, any> = {};
  records.forEach(r => {
    if (!map[r.teacherId]) {
      map[r.teacherId] = {
        teacherId: r.teacherId,
        teacher: r.teacher,
        total: 0, resolved: 0, pending: 0, newCount: 0,
        avgResponseTime: "—",
        resolvedTimes: [] as number[],
      };
    }
    map[r.teacherId].total++;
    if (r.status === "Resolved") {
      map[r.teacherId].resolved++;
      const mins = parseInt(r.responseTime.replace(/[^0-9]/g, "")) || 0;
      map[r.teacherId].resolvedTimes.push(mins);
    }
    if (r.status === "Pending") map[r.teacherId].pending++;
    if (r.status === "New") map[r.teacherId].newCount++;
  });

  return Object.values(map).map((s: any) => {
    const avg = s.resolvedTimes.length
      ? Math.round(s.resolvedTimes.reduce((a: number, b: number) => a + b, 0) / s.resolvedTimes.length)
      : 0;
    const h = Math.floor(avg / 60);
    const m = avg % 60;
    s.avgResponseTime = avg ? `${h}h ${m}m` : "—";
    s.resolutionRate = s.total ? Math.round((s.resolved / s.total) * 100) : 0;
    return s;
  });
}

export default function AdminQAPage() {
  const [filter, setFilter] = useState<"All" | "Resolved" | "Pending" | "New">("All");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const filtered = filter === "All" ? QA_RECORDS : QA_RECORDS.filter(r => r.status === filter);
  const teacherStats = buildTeacherStats(QA_RECORDS);

  const selectedStudent = selectedStudentId ? STUDENT_PROFILES[selectedStudentId] : null;
  const studentDoubtHistory = useMemo(() => {
    return QA_RECORDS.filter(r => r.studentId === selectedStudentId);
  }, [selectedStudentId]);

  const handleExport = () => {
    const headers = ["#", "Teacher", "Teacher ID", "Batch", "Student", "Student ID", "Subject", "Question", "Submitted", "Resolved At", "Status", "Response Time"];
    const rows = QA_RECORDS.map((r, i) => [
      i + 1, r.teacher, r.teacherId, r.batch, r.student, r.studentId,
      r.subject, `"${r.question}"`, r.submittedAt, r.resolvedAt || "—", r.status, r.responseTime
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qa_performance_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logColumns = [
    { key: "teacher", header: "Teacher", render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-on_surface text-sm">{v}</p>
        <p className="text-[10px] text-outline tracking-widest">{r.teacherId}</p>
      </div>
    )},
    { key: "batch", header: "Batch", render: (v: string) => (
      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded tracking-widest">{v}</span>
    )},
    { key: "student", header: "Student", render: (v: string, r: any) => (
      <button 
        onClick={() => setSelectedStudentId(r.studentId)}
        className="text-left group transition-all"
      >
        <p className="font-bold text-on_surface text-sm group-hover:text-primary">{v}</p>
        <p className="text-[10px] text-outline tracking-widest flex items-center gap-1 group-hover:text-primary/70">
          {r.studentId} <ExternalLink className="w-2.5 h-2.5" />
        </p>
      </button>
    )},
    { key: "subject", header: "Subject" },
    { key: "submittedAt", header: "Filed At" },
    { key: "responseTime", header: "Response" },
    { key: "status", header: "Status", render: (v: string) => (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
        v === "Resolved" ? "bg-primary/10 text-primary" :
        v === "Pending"  ? "bg-secondary/10 text-secondary" :
                           "bg-error/10 text-error"
      }`}>{v}</span>
    )},
  ];

  const perfColumns = [
    { key: "teacher", header: "Teacher", render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-on_surface">{v}</p>
        <p className="text-[10px] text-outline">{r.teacherId}</p>
      </div>
    )},
    { key: "total",    header: "Total Doubts" },
    { key: "resolutionRate", header: "Efficiency", render: (v: number) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-surface_container_highest rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs font-bold text-on_surface">{v}%</span>
      </div>
    )},
    { key: "avgResponseTime", header: "Avg. Response" },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-manrope font-bold tracking-tight mb-2">QA Intelligence Center</h1>
          <p className="text-on_surface_variant max-w-2xl text-sm italic">
            "Absolute transparency in doubt resolution correlates directly with batch excellence."
          </p>
        </div>
        <div className="flex gap-4">
           <button onClick={handleExport} className="btn-premium gap-2 scale-90 sm:scale-100">
              <Download className="w-4 h-4" /> Authority Export
           </button>
        </div>
      </header>

      {/* Stats Quick View */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Queries",  value: QA_RECORDS.length, icon: Users, color: "text-primary" },
          { label: "Resolved",       value: QA_RECORDS.filter(r => r.status === "Resolved").length, icon: CheckCircle2, color: "text-primary" },
          { label: "Live Pending",   value: QA_RECORDS.filter(r => r.status === "Pending").length, icon: Clock, color: "text-secondary" },
          { label: "Avg Efficiency", value: "84%", icon: Zap, color: "text-primary" },
        ].map(s => (
          <KnowledgeCard key={s.label} className="p-5">
            <div className="flex gap-3 items-center">
              <div className={`p-2.5 rounded-xl bg-surface_container_high ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-extrabold font-manrope ${s.color}`}>{s.value}</p>
              </div>
            </div>
          </KnowledgeCard>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <KnowledgeCard>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-outline_variant/10 mb-0">
                <CardTitle>Global Doubt Audit Log</CardTitle>
                <div className="flex gap-2 text-[10px] font-bold">
                  {(["All", "Resolved", "Pending", "New"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest ${
                        filter === f ? "bg-primary text-on_primary shadow-glow" : "bg-surface_container_high text-outline hover:text-on_surface"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <DataTable columns={logColumns} data={filtered} />
              </CardBody>
           </KnowledgeCard>
        </div>

        <div className="space-y-6">
           <KnowledgeCard>
              <CardHeader className="pb-4 border-b border-outline_variant/10 mb-0">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-primary" /> Faculty Matrix
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <DataTable columns={perfColumns} data={teacherStats} />
              </CardBody>
           </KnowledgeCard>

           <KnowledgeCard className="bg-gradient-to-br from-surface to-surface_container_high p-6 border-primary/10">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                 <Award className="w-4 h-4 text-primary" /> Policy Enforcement
              </h4>
              <p className="text-xs text-on_surface_variant leading-relaxed mb-4">
                 All doubt resolution data is cryptographically hashed for performance reviews. Manual overrides are flagged for secondary audit.
              </p>
              <button className="w-full py-2.5 rounded-lg border border-primary/30 text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all">
                 Review Compliance Logs
              </button>
           </KnowledgeCard>
        </div>
      </div>

      {/* --- STUDENT DOSSIER MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-surface_container_lowest border border-outline_variant/30 rounded-3xl shadow-ambient overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-outline_variant/10 flex justify-between items-center bg-surface_container_low">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                       {selectedStudent.name.split(' ').map((n:any) => n[0]).join('')}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold font-manrope">{selectedStudent.name}</h2>
                       <p className="text-xs text-outline font-bold uppercase tracking-widest">{selectedStudentId} · {selectedStudent.rank}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedStudentId(null)}
                   className="p-2.5 bg-surface_container_high rounded-full hover:bg-surface_container_highest transition-all"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Modal Content - Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
                 
                 {/* Top Info Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KnowledgeCard className="p-5 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Contact Logic</p>
                          <Mail className="w-4 h-4 text-primary" />
                       </div>
                       <p className="font-bold text-on_surface mb-1">{selectedStudent.email}</p>
                       <p className="text-xs text-on_surface_variant">{selectedStudent.phone}</p>
                    </KnowledgeCard>

                    <KnowledgeCard className="p-5 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Batch Identity</p>
                          <Calendar className="w-4 h-4 text-secondary" />
                       </div>
                       <p className="font-bold text-on_surface mb-1">{selectedStudent.batch}</p>
                       <p className="text-xs text-on_surface_variant underline">Enrolled: {selectedStudent.enrollment}</p>
                    </KnowledgeCard>

                    <KnowledgeCard className="p-5 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Reward Points</p>
                          <Star className="w-4 h-4 text-warning" />
                       </div>
                       <p className="text-2xl font-black font-manrope text-on_surface">{selectedStudent.xp} XP</p>
                       <p className="text-[10px] font-bold text-outline uppercase">Azure Academy Standing</p>
                    </KnowledgeCard>
                 </div>

                 {/* Engagement Dossier Sections */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Academic Pulse */}
                    <KnowledgeCard className="p-6">
                       <CardHeader className="px-0 pb-4 mb-4 border-b border-outline_variant/10">
                          <CardTitle className="text-sm flex items-center gap-2">
                             <Activity className="w-4 h-4 text-primary" /> Academic Pulse
                          </CardTitle>
                       </CardHeader>
                       <div className="space-y-6">
                          <div>
                             <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span>Attendance Threshold</span>
                                <span className="text-primary">{selectedStudent.attendance}</span>
                             </div>
                             <div className="w-full h-1.5 bg-surface_container_highest rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: selectedStudent.attendance }} />
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span>Course Completion</span>
                                <span className="text-secondary">{selectedStudent.progress}</span>
                             </div>
                             <div className="w-full h-1.5 bg-surface_container_highest rounded-full overflow-hidden">
                                <div className="h-full bg-secondary" style={{ width: selectedStudent.progress }} />
                             </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                             {selectedStudent.behavioralTags.map((tag: string) => (
                               <span key={tag} className="text-[10px] font-bold bg-surface_container_high px-2 py-0.5 rounded border border-outline_variant/30 text-outline">
                                  {tag}
                               </span>
                             ))}
                          </div>
                       </div>
                    </KnowledgeCard>

                    {/* Behavior/Bio */}
                    <KnowledgeCard className="p-6">
                       <CardHeader className="px-0 pb-4 mb-4 border-b border-outline_variant/10">
                          <CardTitle className="text-sm flex items-center gap-2">
                             <Zap className="w-4 h-4 text-warning" /> Behavioral Analysis
                          </CardTitle>
                       </CardHeader>
                       <p className="text-sm text-on_surface_variant leading-relaxed italic">
                          "{selectedStudent.bio}"
                       </p>
                       <div className="mt-6 flex flex-col gap-3">
                          <div className="p-3 bg-surface_container_low border border-outline_variant/20 rounded-xl flex items-center gap-3">
                             <Award className="w-5 h-5 text-primary" />
                             <div>
                                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Current Standing</p>
                                <p className="font-bold text-on_surface text-xs">{selectedStudent.rank}</p>
                             </div>
                          </div>
                       </div>
                    </KnowledgeCard>
                 </div>

                 {/* Interaction History (Audit Sub-log) */}
                 <KnowledgeCard className="bg-surface_container_low/40">
                    <CardHeader className="border-b border-outline_variant/10 pb-4 mb-0">
                       <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2 text-primary">
                             <Clock className="w-4 h-4" /> Doubt Resolution History
                          </span>
                          <span className="text-[10px] text-outline font-bold uppercase">{studentDoubtHistory.length} Interactions Filed</span>
                       </CardTitle>
                    </CardHeader>
                    <DataTable 
                      data={studentDoubtHistory} 
                      columns={[
                        { key: "submittedAt", header: "Timestamp" },
                        { key: "subject", header: "Subject" },
                        { key: "question", header: "Technical Query", render: (v: string) => <p className="line-clamp-1 max-w-[200px] italic">"{v}"</p> },
                        { key: "teacher", header: "Handled By" },
                        { key: "responseTime", header: "Response" },
                        { key: "status", header: "Result", render: (v: string) => (
                           <span className={v === 'Resolved' ? 'text-primary font-bold' : 'text-error font-bold'}>{v}</span>
                        )}
                      ]}
                    />
                 </KnowledgeCard>

              </div>
              
              {/* Fixed Footer with Actions */}
              <div className="p-6 border-t border-outline_variant/10 bg-surface_container_low flex justify-between items-center">
                 <p className="text-xs text-on_surface_variant">Dossier hash: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                 <div className="flex gap-4">
                    <button className="px-6 py-2.5 rounded-xl border border-outline_variant/30 font-bold text-sm hover:bg-surface_container_high transition-all">
                       Export Dossier PDF
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-primary text-on_primary font-bold text-sm shadow-glow hover:bg-primary_bright transition-all">
                       Initiate Direct Contact
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
