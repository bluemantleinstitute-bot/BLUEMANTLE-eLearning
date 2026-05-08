import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Info, Trash2, ArrowRight } from "lucide-react";
import { PremiumUploadZone } from "@/components/PremiumUploadZone";

export default function TeacherMaterials() {
  const uploads = [
    { name: "Quantum_Field_Theory_Notes.pdf", size: "4.2 MB", date: "Oct 24, 2024", status: "Synced" },
    { name: "Economic_Models_Data_Set.xlsx", size: "12.8 MB", date: "Oct 22, 2024", status: "Synced" },
    { name: "Ethics_Seminar_Reading.epub", size: "1.5 MB", date: "Oct 20, 2024", status: "Synced" },
  ];

  return (
    <div className="space-y-8 pb-16">
      <header>
        <h1 className="text-3xl font-manrope font-bold tracking-tight mb-2">Curate Your Curriculum</h1>
        <p className="text-on_surface_variant max-w-2xl">
          Upload your session notes, research papers, or supplementary readings. Azure Academy&apos;s atelier format ensures your content is presented with the elegance it deserves.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-8">
           <PremiumUploadZone />

           <div className="space-y-4">
              <h2 className="text-xl font-bold font-manrope text-on_surface mb-4 px-2">Azure Academy Archive</h2>
              <div className="grid grid-cols-1 gap-4">
                 {uploads.map((file, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-surface_container_lowest border border-outline_variant/10 rounded-2xl shadow-sm hover:shadow-ambient transition-all group">
                      <div className="flex gap-4 items-center">
                         <div className="p-2.5 rounded-xl bg-surface_container_high text-outline">
                            <FileText className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-on_surface group-hover:text-primary transition-colors">{file.name}</h4>
                            <p className="text-[10px] text-outline uppercase font-bold tracking-widest mt-0.5">{file.size} • Uploaded {file.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-primary">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{file.status}</span>
                         </div>
                         <button className="p-2 hover:bg-error/10 text-outline hover:text-error rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
           <KnowledgeCard className="bg-surface_container_low">
              <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> Content Standards
                 </CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                 <div className="space-y-2">
                    <h5 className="font-bold text-sm text-on_surface">Vector Graphics</h5>
                    <p className="text-xs text-on_surface_variant leading-relaxed">
                       Ensure all diagrams are high-resolution for crystal clear student viewing on Retina displays.
                    </p>
                 </div>
                 <div className="space-y-2">
                    <h5 className="font-bold text-sm text-on_surface">Metadata Consistency</h5>
                    <p className="text-xs text-on_surface_variant leading-relaxed">
                       Tag your notes correctly to appear in the respective course bento-grids automatically.
                    </p>
                 </div>
                 <div className="space-y-2">
                    <h5 className="font-bold text-sm text-on_surface">Copyright Compliance</h5>
                    <p className="text-xs text-on_surface_variant leading-relaxed">
                       By uploading, you confirm ownership or usage rights for the educational material per Azure policy.
                    </p>
                 </div>
              </CardBody>
           </KnowledgeCard>

           <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-4">
              <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                 <h4 className="text-sm font-bold text-on_surface">Sync Notice</h4>
                 <p className="text-xs text-on_surface_variant mt-1 leading-relaxed">
                    Files are automatically distributed to student terminals upon synchronization success.
                 </p>
              </div>
           </div>
           
           <footer className="pt-8 opacity-60">
              <p className="text-[9px] font-bold text-outline uppercase tracking-[0.2em]">Azure Academy Administrative System</p>
           </footer>
        </div>
      </div>
    </div>
  );
}
