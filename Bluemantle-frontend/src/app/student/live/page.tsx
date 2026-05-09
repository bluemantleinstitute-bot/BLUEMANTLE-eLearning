import { KnowledgeCard, CardHeader, CardTitle, CardBody } from "@/components/KnowledgeCard";
import { Clock, Video, RefreshCw, AlertCircle } from "lucide-react";
import { LiveJoinManager } from "@/components/LiveJoinManager";
import { SessionRefresher } from "@/components/SessionRefresher";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function LiveClassPage() {
  let classes = [];
  let errorMsg = "";

  try {
    classes = await db.user.getLiveClasses();
  } catch (error: any) {
    console.error("Failed to fetch live classes:", error);
    errorMsg = error.message || "Unable to sync with live terminal.";
  }

  const liveNow = classes.find((c: any) => c.status === 'live');
  const upcoming = classes.filter((c: any) => 
    c.status === 'scheduled' && new Date(c.date) > new Date()
  );

  return (
    <div className="space-y-8 pb-10">
      <SessionRefresher />
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-manrope font-bold tracking-tight">Live Classes</h1>
        {errorMsg && (
          <div className="flex items-center gap-2 text-error text-xs font-bold bg-error/10 px-4 py-2 rounded-xl animate-pulse">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}
      </div>

      {liveNow ? (
        <KnowledgeCard className="bg-surface_container_lowest border-primary/20 shadow-ambient overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                </span>
                <span className="text-sm font-bold text-error uppercase tracking-widest">Live Now</span>
              </div>

              <h2 className="text-3xl font-manrope font-bold mb-2">{liveNow.topic}</h2>
              <p className="text-on_surface_variant text-lg mb-6">
                Instructor: {liveNow.teacherId?.name || "Assigning..."} • {liveNow.batchId?.name} • {new Date(liveNow.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

              <LiveJoinManager sessionTitle={liveNow.topic} classId={liveNow._id} />
            </div>

            <div className="bg-surface_container_low p-6 rounded-2xl border border-outline_variant/20 text-center min-w-[200px]">
              <span className="text-sm font-bold text-outline uppercase tracking-wider block mb-2">Session Timer</span>
              <div className="text-4xl font-manrope font-bold text-primary flex items-center justify-center gap-2">
                <Clock className="w-8 h-8 opacity-50" /> Live
              </div>
            </div>
          </div>
        </KnowledgeCard>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-surface_container_lowest border border-outline_variant/20 shadow-ambient p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-surface_container_highest border border-outline_variant/20">
             <Video className="w-8 h-8 text-outline" />
          </div>
          <h3 className="text-2xl font-bold font-manrope text-on_surface">No sessions live right now</h3>
          <p className="text-on_surface_variant max-w-sm">When a lecture starts, it will appear here with a join button and real-time attendance tracking.</p>
        </div>
      )}

      <h3 className="text-2xl font-manrope font-bold mt-12 mb-4">Upcoming Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcoming.length > 0 ? upcoming.map((c: any, i: number) => (
          <KnowledgeCard key={i}>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-on_surface">{c.topic}</h4>
                <p className="text-sm text-on_surface_variant">
                  {new Date(c.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {c.teacherId?.name || "TBA"}
                </p>
              </div>
              <button className="text-sm font-bold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-on_primary transition-colors">
                Details
              </button>
            </div>
          </KnowledgeCard>
        )) : (
          <p className="text-on_surface_variant italic">No future classes scheduled yet.</p>
        )}
      </div>
    </div>
  );
}
