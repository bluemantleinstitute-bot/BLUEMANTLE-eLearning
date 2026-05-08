import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { DataTable } from "@/components/DataTable";
import { ClipboardCheck, Search, Filter, Save, MoreVertical, Check, X } from "lucide-react";

export default function MarkAttendance() {
  const students = [
    { name: "Elena Rodriguez", id: "AZ-99021", status: "Present" },
    { name: "Julian Chen", id: "AZ-99015", status: "Present" },
    { name: "Markus Vance", id: "AZ-98992", status: "Absent" },
    { name: "Sarah Jenkins", id: "AZ-98841", status: "Present" },
    { name: "David Miller", id: "AZ-98710", status: "Late" },
  ];

  const columns = [
    { 
      key: "name", 
      header: "Student Name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-surface_container_high flex items-center justify-center font-bold text-xs text-primary">
              {val.charAt(0)}
           </div>
           <div>
              <p className="font-bold text-on_surface">{val}</p>
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{row.id}</p>
           </div>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Today's Status",
      render: (val: string) => (
        <div className="flex gap-2">
           <button className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${val === 'Present' ? 'bg-primary text-on_primary border-primary' : 'bg-surface_container_low border-outline_variant/30 text-outline'}`}>
              Present
           </button>
           <button className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${val === 'Absent' ? 'bg-error text-on_error border-error' : 'bg-surface_container_low border-outline_variant/30 text-outline'}`}>
              Absent
           </button>
           <button className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${val === 'Late' ? 'bg-secondary text-on_secondary border-secondary' : 'bg-surface_container_low border-outline_variant/30 text-outline'}`}>
              Late
           </button>
        </div>
      )
    },
    {
       key: "actions",
       header: "",
       render: () => <button className="p-2 hover:bg-surface_container_high rounded-full"><MoreVertical className="w-4 h-4 text-outline" /></button>
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-manrope font-bold tracking-tight mb-2">Daily Attendance</h1>
          <p className="text-on_surface_variant">Log attendance for today&apos;s session at Azure Academy. Data will be synced to the central student portal.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2.5 rounded-full border border-outline_variant/30 font-bold text-sm hover:bg-surface_container_low transition-all">Cancel</button>
           <button className="bg-primary text-on_primary px-8 py-2.5 rounded-full font-bold shadow-ambient flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm">
             <Save className="w-4 h-4" /> Sync All Changes
           </button>
        </div>
      </header>

      {/* Selector Area */}
      <section className="p-6 rounded-3xl bg-surface_container_low border border-outline_variant/10 flex flex-wrap gap-6 items-end">
         <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Select Class / Batch</label>
            <select className="w-full bg-surface_container_lowest border border-outline_variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none">
               <option>Advanced Microeconomics II (Batch Gamma)</option>
               <option>Behavioral Analytics (Virtual Lab 2)</option>
            </select>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
               <input type="text" placeholder="Search student..." className="w-full bg-surface_container_lowest border border-outline_variant/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <button className="p-3 bg-surface_container_lowest border border-outline_variant/30 rounded-xl hover:bg-surface_container_high transition-colors"><Filter className="w-5 h-5 text-outline" /></button>
         </div>
      </section>

      <KnowledgeCard>
         <CardHeader className="flex justify-between items-center border-b border-outline_variant/10 pb-6 mb-0">
            <CardTitle>Attendance Ledger</CardTitle>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Present: 4
               </div>
               <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-error" /> Absent: 1
               </div>
            </div>
         </CardHeader>
         <CardBody className="p-0">
            <DataTable columns={columns} data={students} />
            <div className="p-8 flex justify-center border-t border-outline_variant/10">
               <p className="text-[10px] font-bold text-outline uppercase tracking-widest">End of Directory • Oct 24, 2024 Session</p>
            </div>
         </CardBody>
      </KnowledgeCard>

      {/* Quick Ops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
            <div>
               <h4 className="font-bold text-primary">Mark All as Present</h4>
               <p className="text-xs text-on_surface_variant">Quickly log attendance for the entire cohort.</p>
            </div>
            <button className="p-3 bg-primary text-on_primary rounded-xl hover:scale-105 transition-transform"><Check className="w-5 h-5" /></button>
         </div>
         <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
            <div>
               <h4 className="font-bold text-secondary">Export Session Data</h4>
               <p className="text-xs text-on_surface_variant">Download attendance report as encrypted CSV.</p>
            </div>
            <button className="p-3 bg-secondary text-on_secondary rounded-xl hover:scale-105 transition-transform"><Save className="w-5 h-5" /></button>
         </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
