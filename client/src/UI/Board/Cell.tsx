import { CellColor, playerColors } from "@/types/types";
import { ChessPawn } from "lucide-react";
import { useParams } from "next/navigation";
import { pieceStyles } from "./HomeSquare";
import { movePiece } from "../util";

type PlayerColor = keyof typeof playerColors;

interface CellProps {
  cellColor?: PlayerColor;
  pieces?: { id: number; color: PlayerColor }[];
  className?: string;
}

const Cell = ({
  cellColor,
  pieces = [],
  className = "",
}: CellProps) => {
  const { roomId } = useParams<{ roomId: string }>();

  const pieceStyle = pieceStyles[pieces[0]?.color as CellColor];

  return (
    <div
      className={`
        relative flex aspect-square
        w-6 sm:w-8 md:w-10 lg:w-12
        items-center justify-center
        bg-white
        ${className}
      `}
      style={{
        backgroundColor: cellColor ? playerColors[cellColor] : undefined,
      }}
    >
      <div
        className="relative z-10 flex items-center justify-center"
      >
        {pieces.length > 0 &&
          <div
            className={`relative flex items-center justify-center rounded-full p-1 ${pieceStyle?.bg} ${pieceStyle?.border}`}
            onClick={() => movePiece(roomId, pieces[0]?.id, pieces[0]?.color as PlayerColor)}
          >
            <ChessPawn
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-7 md:w-7"
              style={{
                color: playerColors[pieces[0]?.color as PlayerColor],
              }}
            />

            {pieces!.length > 1 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-black px-1 text-xs leading-none text-white">
                {pieces!.length}
              </span>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Cell;