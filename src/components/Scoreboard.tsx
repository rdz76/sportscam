interface ScoreboardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minutes: number;
  seconds: number;
  homeLogo?: string;
  awayLogo?: string;
}
const Scoreboard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  minutes,
  seconds,
  homeLogo,
  awayLogo
}: ScoreboardProps) => {
  return <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-white text-sm font-medium mx-[10px] my-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {homeLogo && <img src={homeLogo} alt={homeTeam} className="w-6 h-6 rounded-full object-cover" />}
            <span className="opacity-70">{homeTeam}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{homeScore}</span>
            <span className="opacity-50">:</span>
            <span className="text-xl font-bold">{awayScore}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="opacity-70">{awayTeam}</span>
            {awayLogo && <img src={awayLogo} alt={awayTeam} className="w-6 h-6 rounded-full object-cover" />}
          </div>
        </div>
        <div className="text-center text-xs opacity-50 mt-1">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} 2nd
        </div>
      </div>
    </div>;
};
export default Scoreboard;