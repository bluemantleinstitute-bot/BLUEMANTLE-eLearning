"use client";

import { useState, useMemo } from "react";
import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { DataTable } from "@/components/DataTable";
import { PremiumSearch } from "@/components/PremiumSearch";
import { Users, Activity, Layers, TrendingUp, MoreVertical, ExternalLink, CheckCircle2, Lock } from "lucide-react";

const ALL_STUDENTS = [
  { id: 1, studentId: "STU-8821", name: "Eleanor Fitzwilliam", email: "eleanor.f@academy.edu", enrollment: "Aug 12, 2024", progress: "92%", status: "Active", batchId: "CS-2024-B4" },
  { id: 2, studentId: "STU-8822", name: "Marcus Thorne", email: "m.thorne@academy.edu", enrollment: "Aug 14, 2024", progress: "88%", status: "Active", batchId: "CS-2024-B4" },
  { id: 4, studentId: "STU-8824", name: "Julian Chen", email: "j.chen@academy.edu", enrollment: "Aug 15, 2024", progress: "96%", status: "Active", batchId: "CS-2024-B4" },
  { id: 3, studentId: "STU-8901", name: "Sienna Rossi", email: "s.rossi@academy.edu", enrollment: "Sept 01, 2024", progress: "74%", status: "Active", batchId: "DES-2024-A1" },
  { id: 5, studentId: "STU-8905", name: "Amara Okafor", email: "amara.o@academy.edu", enrollment: "Sept 05, 2024", progress: "81%", status: "Active", batchId: "DES-2024-A1" },
  { id: 6, studentId: "STU-9102", name: "Tobias Vane", email: "t.vane@academy.edu", enrollment: "Oct 02, 2024", progress: "45%", status: "Active", batchId: "MATH-2024-C2" },
];

const BATCHES = [
  { id: "CS-2024-B4", title: "Advanced Algorithms & Logic", count: 42 },
  { id: "DES-2024-A1", title: "Human-Centric Design", count: 28 },
  { id: "MATH-2024-C2", title: "Discrete Mathematics II", count: 56 },
];

export default function TeacherStudents() {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (!selectedBatchId) return [];
    return ALL_STUDENTS.filter(student => {
      const matchesBatch = student.batchId === selectedBatchId;
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBatch && matchesSearch;
    });
  }, [selectedBatchId, searchQuery]);

  const activeBatch = BATCHES.find(b => b.id === selectedBatchId);

  const columns = [
    {
      key: "studentId",
      header: "ID",
      render: (val: string) => (
        <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded tracking-widest uppercase whitespace-nowrap">
          {val}
        </span>
      )
    },
    {
      key: "name",
      header: "Student",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface_container_high flex items-center justify-center font-bold text-sm text-primary">
            {val.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-on_surface">{val}</p>
            <p className="text-[10px] text-outline uppercase tracking-widest">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: "enrollment", header: "Enrolled" },
    {
      key: "progress",
      header: "Progress",
      render: (val: string) => (
        <div className="flex items-center gap-3 w-28">
          <div className="flex-1 h-1 bg-surface_container_highest rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: val }} />
          </div>
          <span className="text-[10px] font-bold text-on_surface">{val}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: () => <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded uppercase">Verified</span>
    },
    {
      key: "actions",
      header: "",
      render: () => <button className="p-2 hover:bg-surface_container_high rounded-full"><MoreVertical className="w-4 h-4 text-outline" /></button>
    }
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-manrope font-bold tracking-tight mb-2">Student Terminal</h1>
          <p className="text-on_surface_variant max-w-2xl">
            {activeBatch
              ? `Showing all students enrolled in "${activeBatch.title}" — ${activeBatch.id}`
              : "Select an assigned cohort to initialize the student roster."}
          </p>
        </div>
        {selectedBatchId && (
          <button onClick={() => { setSelectedBatchId(null); setSearchQuery(""); }} className="text-xs font-bold text-outline hover:text-primary transition-colors border border-outline_variant/30 px-4 py-2 rounded-full">
            ← All Cohorts
          </button>
        )}
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: ALL_STUDENTS.length.toString(), icon: Users },
          { label: "Cohort View", value: filteredStudents.length > 0 ? filteredStudents.length.toString() : "—", icon: Activity },
          { label: "Batches Assigned", value: BATCHES.length.toString(), icon: Layers },
          { label: "Avg. Completion", value: "88.5%", icon: TrendingUp },
        ].map((stat) => (
          <KnowledgeCard key={stat.label} className="p-5">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 rounded-xl bg-surface_container_high text-primary">
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold font-manrope">{stat.value}</h3>
              </div>
            </div>
          </KnowledgeCard>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Panel */}
        <div className="lg:col-span-2">
          {!selectedBatchId ? (
            /* ── Locked State ── */
            <div className="flex flex-col items-center justify-center h-[420px] text-center p-12 border border-dashed border-outline_variant/20 rounded-3xl bg-surface_container_low/50 animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-3xl bg-surface_container_highest flex items-center justify-center mb-6 text-outline">
                <Lock className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold font-manrope text-on_surface mb-3">Terminal Locked</h3>
              <p className="text-sm text-on_surface_variant max-w-xs leading-relaxed">
                Select one of your assigned cohorts on the right to initialize the student roster and tracking system.
              </p>
            </div>
          ) : (
            /* ── Active State ── */
            <KnowledgeCard className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline_variant/10 pb-6 mb-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {activeBatch?.title}
                  <span className="text-[10px] font-bold text-outline ml-1 tracking-widest">{activeBatch?.id}</span>
                </CardTitle>
                <div className="w-full sm:w-auto">
                  <PremiumSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name or ID..."
                  />
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <DataTable columns={columns} data={filteredStudents} />
                <div className="p-6 flex justify-center border-t border-outline_variant/10">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">
                    {filteredStudents.length} records in cohort
                  </p>
                </div>
              </CardBody>
            </KnowledgeCard>
          )}
        </div>

        {/* Cohort Selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-manrope text-outline uppercase tracking-widest px-2">Assigned Cohorts</h3>
          {BATCHES.map((batch) => (
            <KnowledgeCard
              key={batch.id}
              onClick={() => { setSelectedBatchId(batch.id); setSearchQuery(""); }}
              className={`p-6 transition-all cursor-pointer group relative overflow-hidden ${
                selectedBatchId === batch.id
                  ? 'border-primary ring-1 ring-primary/20 shadow-ambient bg-surface_container_high'
                  : 'hover:border-primary/30 hover:bg-surface_container_low'
              }`}
            >
              {selectedBatchId === batch.id && (
                <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-on_primary rounded-bl-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-bold text-sm transition-colors ${selectedBatchId === batch.id ? 'text-primary' : 'text-on_surface group-hover:text-primary'}`}>
                    {batch.title}
                  </h4>
                  <p className="text-[10px] text-outline font-bold tracking-widest mt-1">{batch.id}</p>
                </div>
                <ExternalLink className={`w-4 h-4 flex-shrink-0 ml-2 transition-colors ${selectedBatchId === batch.id ? 'text-primary' : 'text-outline group-hover:text-primary'}`} />
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-on_surface_variant">
                <Users className="w-3.5 h-3.5 text-primary" />
                {ALL_STUDENTS.filter(s => s.batchId === batch.id).length} registered · {batch.count} total capacity
              </div>
            </KnowledgeCard>
          ))}

          <KnowledgeCard className="p-6 mt-2 border-primary/10 bg-surface_container_low text-center">
            <h4 className="font-bold text-sm mb-2">Cohort Intelligence</h4>
            <p className="text-xs text-on_surface_variant leading-relaxed mb-4">
              Select a batch to unlock grade distribution and individual export capabilities.
            </p>
            <button className="btn-premium w-full text-xs py-2.5">Generate Master Report</button>
          </KnowledgeCard>
        </div>
      </div>
    </div>
  );
}
