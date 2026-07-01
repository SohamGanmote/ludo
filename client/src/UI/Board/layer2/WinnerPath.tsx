import { RoomState } from "@/types/types";
import Cell from "../Cell";
import { Crown } from "lucide-react";

export const playerColors: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

const WinnerPath = ({ roomState }: { roomState: RoomState }) => {
  const finishedPieces = {
    red: [] as { id: number; color: string }[],
    yellow: [] as { id: number; color: string }[],
    blue: [] as { id: number; color: string }[],
    green: [] as { id: number; color: string }[],
  };


  (Object.keys(finishedPieces) as Array<keyof typeof finishedPieces>).forEach(
    (color) => {
      const player = roomState.players[color];

      if (!player) return;

      Object.entries(player.pieces).forEach(([pieceId, piece]) => {
        if (piece.isFinished) {
          finishedPieces[color].push({
            id: Number(pieceId),
            color,
          });
        }
      });
    }
  );

  return (
    <div className="relative flex">
      {/* Center Ludo Star */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          {/* Top (Green) */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2
    w-full h-full
    border-l-[36px] border-r-[36px] border-b-[36px]
    sm:border-l-[48px] sm:border-r-[48px] sm:border-b-[48px]
    md:border-l-[60px] md:border-r-[60px] md:border-b-[60px]
    lg:border-l-[72px] lg:border-r-[72px] lg:border-b-[72px]
    border-l-transparent border-r-transparent rotate-180"
            style={{ borderBottomColor: playerColors.green }}
          />

          {/* Right (Yellow) */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2
    w-full h-full
    border-t-[36px] border-b-[36px] border-l-[36px]
    sm:border-t-[48px] sm:border-b-[48px] sm:border-l-[48px]
    md:border-t-[60px] md:border-b-[60px] md:border-l-[60px]
    lg:border-t-[72px] lg:border-b-[72px] lg:border-l-[72px]
    border-t-transparent border-b-transparent rotate-180"
            style={{ borderLeftColor: playerColors.yellow }}
          />

          {/* Bottom (Blue) */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2
    w-full h-full
    border-l-[36px] border-r-[36px] border-t-[36px]
    sm:border-l-[48px] sm:border-r-[48px] sm:border-t-[48px]
    md:border-l-[60px] md:border-r-[60px] md:border-t-[60px]
    lg:border-l-[72px] lg:border-r-[72px] lg:border-t-[72px]
    border-l-transparent border-r-transparent rotate-180"
            style={{ borderTopColor: playerColors.blue }}
          />

          {/* Left (Red) */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2
    w-full h-full
    border-t-[36px] border-b-[36px] border-r-[36px]
    sm:border-t-[48px] sm:border-b-[48px] sm:border-r-[48px]
    md:border-t-[60px] md:border-b-[60px] md:border-r-[60px]
    lg:border-t-[72px] lg:border-b-[72px] lg:border-r-[72px]
    border-t-transparent border-b-transparent rotate-180"
            style={{ borderRightColor: playerColors.red }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-300">
            <Crown
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-700"
            />
          </div>
        </div>
      </div>

      <div>
        <Cell />
        <Cell cellColor="red" className="z-100" pieces={finishedPieces.red} />
        <Cell />
      </div>

      <div>
        <Cell cellColor="green" className="z-100" pieces={finishedPieces.green} />
        <Cell />
        <Cell cellColor="blue" className="z-100" pieces={finishedPieces.blue} />
      </div>

      <div>
        <Cell />
        <Cell cellColor="yellow" className="z-100" pieces={finishedPieces.yellow} />
        <Cell />
      </div>
    </div>
  );
};

export default WinnerPath;