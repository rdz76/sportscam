import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
const Scoreboard = () => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  return <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-white text-sm font-medium mx-[10px] my-[50px]">
        <div className="flex items-center gap-2">
          <span className="opacity-70">REAL TUSC</span>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{homeScore}</span>
            <span className="opacity-50">:</span>
            <span className="text-xl font-bold">{awayScore}</span>
          </div>
          <span className="opacity-70">TOR3TESTE</span>
        </div>
        <div className="text-center text-xs opacity-50 mt-1">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} 2nd
        </div>
      </div>
    </div>;
};
export default Scoreboard;