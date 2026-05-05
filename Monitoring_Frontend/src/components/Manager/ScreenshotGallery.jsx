import { Camera, Maximize2, Clock, MoreHorizontal } from "lucide-react";

const ScreenshotGallery = ({ screenshots = [] }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col h-full">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg shadow-lg shadow-zinc-200">
            <Camera size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.2em]">
              Visual Logs
            </h3>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
              Automated Capture Feed
            </p>
          </div>
        </div>
        <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors">
          View All
        </button>
      </div>

      {/* Screenshot Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {screenshots.length > 0 ? (
          screenshots.slice(0, 4).map((img, index) => (
            <div 
              key={index} 
              className="group relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 aspect-video cursor-zoom-in"
            >
              {/* Image */}
              <img
                src={img}
                alt={`Capture ${index}`}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />

              {/* Glass Overlay on Hover */}
              <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 backdrop-blur-[2px]">
                <div className="flex justify-end">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md border border-white/20">
                    <Maximize2 size={14} className="text-white" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                    12:4{index} PM
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl space-y-3">
            <Camera size={24} className="text-zinc-200" />
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
              No Captures Found
            </p>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Live Monitoring Active</span>
        </div>
        <button className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};

export default ScreenshotGallery;