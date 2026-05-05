import { useState, useEffect, useRef } from "react";
import { Clock, Timer, Zap, PlayCircle, StopCircle } from "lucide-react";
import { getActiveSession } from "../../services/employeeService";

const WorkTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getActiveSession();
        const data = res?.data?.data || {};
        const active = data.active;

        if (!active || !data.session) {
          setRunning(false);
          setSeconds(0);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }

        const start = new Date(data.session.startTime);
        if (isNaN(start)) return;

        const now = new Date();
        const diff = Math.floor((now - start) / 1000);

        setSeconds(diff);
        setRunning(true);

        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
          }, 1000);
        }
      } catch (err) {
        setRunning(false);
        setSeconds(0);
      }
    };

    fetchSession();
    const syncInterval = setInterval(fetchSession, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(syncInterval);
    };
  }, []);

  const formatTime = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    return { h: pad(h), m: pad(m), s: pad(s) };
  };

  const { h, m, s } = formatTime();

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* TIMER CARD */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
        
        {/* Subtle Decorative Background Element */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] transition-colors duration-1000 ${running ? 'bg-emerald-100' : 'bg-zinc-100'}`} />

        <div className="relative z-10">
          {/* TOP BADGE */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {running ? "Session Live" : "System Idle"}
              </span>
            </div>
            <div className={`p-2.5 rounded-2xl ${running ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
              <Timer size={20} />
            </div>
          </div>

          <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-center">
            Active Work Duration
          </p>

          {/* MAIN TIMER DISPLAY */}
          <div className="flex justify-center items-baseline gap-3 mb-10">
            <TimeUnit value={h} label="hr" />
            <span className="text-3xl font-light text-zinc-300 self-center mb-6">:</span>
            <TimeUnit value={m} label="min" />
            <span className="text-3xl font-light text-zinc-300 self-center mb-6">:</span>
            <TimeUnit value={s} label="sec" highlight={running} />
          </div>

          {/* STATUS BUTTON/INDICATOR */}
          <div className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border transition-all duration-500 ${
            running 
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-200' 
            : 'bg-zinc-50 text-zinc-500 border-zinc-100'
          }`}>
            {running ? <Zap size={16} fill="currentColor" /> : <PlayCircle size={16} />}
            <span className="text-sm font-black tracking-tight">
              {running ? "PRODUCTIVITY MODE ACTIVE" : "AWAITING DESKTOP APP"}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER QUOTE */}
      <div className="mt-8 px-6 text-center">
        <div className="inline-block p-1 px-3 bg-zinc-100 rounded-full mb-3">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Daily Mindset</p>
        </div>
        <p className="text-sm text-zinc-400 font-medium italic leading-relaxed">
          {running 
            ? "“Deep work in progress. Your future self will thank you for this focus.”" 
            : "“Great things take time. Launch your desktop app to begin tracking.”"}
        </p>
      </div>
    </div>
  );
};

// Sub-component for time units to maintain the theme's font hierarchy
const TimeUnit = ({ value, label, highlight }) => (
  <div className="text-center">
    <div className={`text-6xl font-black tracking-tighter transition-colors duration-500 ${highlight ? 'text-emerald-500' : 'text-zinc-900'}`}>
      {value}
    </div>
    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{label}</div>
  </div>
);

export default WorkTimer;