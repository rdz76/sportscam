import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const Scoreboard = () => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
        <div className="flex items-center gap-6">
          {/* Home Team */}
          <div className="text-center">
            <div className="text-white/70 text-xs mb-1">CASA</div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="text-white text-3xl font-bold w-12 text-center">
                {homeScore}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setHomeScore(homeScore + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center px-4 border-x border-white/20">
            <div className="text-white/70 text-xs mb-1">TEMPO</div>
            <div className="text-white text-xl font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="text-white/70 text-xs mb-1">OSPITI</div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="text-white text-3xl font-bold w-12 text-center">
                {awayScore}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setAwayScore(awayScore + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
