import { playerColors } from "@/types/types";
import { ChessPawn, Star } from "lucide-react";
import { useParams } from "next/navigation";
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

  const grouped = pieces.reduce((acc, piece) => {
    if (!acc[piece.color]) {
      acc[piece.color] = [];
    }

    acc[piece.color]!.push(piece);
    return acc;
  }, {} as Partial<Record<PlayerColor, { id: number; color: PlayerColor }[]>>);

  const colors = Object.entries(grouped);
  const hasMultipleColors = colors.length > 1;

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
      <Star
        className="absolute h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6"
        fill="#fff"
      />

      <div
        className={`relative z-10 ${hasMultipleColors
          ? "grid grid-cols-2 gap-0.5"
          : "flex items-center justify-center"
          }`}
      >
        {colors.map(([color, colorPieces]) => (
          <div
            key={color}
            className="relative flex items-center justify-center bg-white rounded-full p-0.5"
            onClick={() => movePiece(roomId, colorPieces![0].id, color as PlayerColor)}
          >
            <ChessPawn
              className={
                hasMultipleColors
                  ? "h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
                  : "h-3 w-3 sm:h-4 sm:w-4 md:h-7 md:w-7"
              }
              style={{
                color: playerColors[color as PlayerColor],
              }}
            />

            {colorPieces!.length > 1 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-black px-1 text-xs leading-none text-white">
                {colorPieces!.length}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cell;