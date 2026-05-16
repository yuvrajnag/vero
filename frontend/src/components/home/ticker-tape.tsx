"use client";

export function TickerTape() {
  return (
    <div className="relative overflow-hidden bg-black py-2 border-y-2 border-white/20">
      <div className="flex whitespace-nowrap animate-ticker">
        {/* We repeat the content multiple times to ensure a seamless loop */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              VERO
            </span>
            <div className="flex gap-1">
              <div className="h-6 w-2 -skew-x-[20deg] bg-white" />
              <div className="h-6 w-2 -skew-x-[20deg] bg-white" />
              <div className="h-6 w-2 -skew-x-[20deg] bg-white" />
              <div className="h-6 w-2 -skew-x-[20deg] bg-white" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
