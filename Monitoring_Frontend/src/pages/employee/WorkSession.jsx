import ManagerSidebar from "../../components/layout/ManagerSidebar";
import WorkTimer from "../../components/employee/WorkTimer";
import { ShieldCheck, Coffee, Brain, CheckCircle2, Terminal } from "lucide-react";

const WorkSession = () => {
  return (
    <div className="flex bg-[#fcfcfc] min-h-screen w-full font-sans overflow-x-hidden">
      {/* Background Aesthetic Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[600px] bg-emerald-50/40 blur-[130px] -z-10 rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-start relative px-6">
        
        <main className="w-full max-w-5xl animate-in fade-in slide-in-from-top-6 duration-1000">
          
          {/* MINIMAL HEADER */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-200 rounded-full mb-6">
              <Terminal size={12} className="text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Environment: Secure Focus
              </span>
            </div>

            <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-4">
              Focus <span className="text-emerald-500 text-stroke-thin">Session</span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm tracking-tight max-w-md mx-auto leading-relaxed">
              Your activity is being synchronized with the desktop monitoring client. Stay focused on your primary tasks.
            </p>
          </div>

          {/* MAIN GRID - Focused Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT SIDE: SESSION GUIDELINES (Static) */}
            <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
               <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Session Protocol</h4>
                  <div className="bg-white border border-zinc-100 rounded-[2rem] p-5 shadow-sm space-y-4">
                    <ProtocolItem icon={<Brain size={14}/>} text="Single-task focus" />
                    <ProtocolItem icon={<ShieldCheck size={14}/>} text="Secure logging active" />
                    <ProtocolItem icon={<Coffee size={14}/>} text="Scheduled breaks only" />
                  </div>
               </div>
            </div>

            {/* CENTER: PRIMARY TIMER */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="w-full max-w-[400px]">
                <WorkTimer />
              </div>
            </div>

            {/* RIGHT SIDE: STATUS & CHECKLIST (Static) */}
            <div className="lg:col-span-3 space-y-6 order-3">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Pre-Work Checklist</h4>
                <div className="bg-zinc-900 rounded-[2rem] p-6 shadow-xl text-white">
                  <ul className="space-y-3">
                    <ChecklistItem text="Desktop Client Sync" checked={true} />
                    <ChecklistItem text="Browser Monitoring" checked={true} />
                    <ChecklistItem text="Quiet Mode On" checked={false} />
                  </ul>
                  <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                    Ready to output
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components for Static Elements
const ProtocolItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="text-emerald-500">{icon}</div>
    <span className="text-xs font-bold text-zinc-600 tracking-tight">{text}</span>
  </div>
);

const ChecklistItem = ({ text, checked }) => (
  <li className="flex items-center gap-3">
    <CheckCircle2 size={16} className={checked ? "text-emerald-400" : "text-zinc-700"} />
    <span className={`text-[11px] font-bold tracking-tight ${checked ? "text-zinc-100" : "text-zinc-500"}`}>
      {text}
    </span>
  </li>
);

export default WorkSession;