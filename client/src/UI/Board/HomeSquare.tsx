import { ChessPawn } from "lucide-react";
import Cell from "./Cell";
import { CellColor, RoomState, playerColors } from "@/types/types";
import socket from "@/src/services/socket";
import { useParams } from "next/navigation";
import { movePiece } from "../util";

type PlayerColor = keyof typeof playerColors;

const bgColorMap: Record<CellColor, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};


export const pieceStyles: Record<
  CellColor,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  red: {
    bg: "bg-red-200/80",
    text: "text-red-700",
    border: "border-red-400",
  },
  green: {
    bg: "bg-green-200/80",
    text: "text-green-700",
    border: "border-green-400",
  },
  blue: {
    bg: "bg-blue-200/80",
    text: "text-blue-700",
    border: "border-blue-400",
  },
  yellow: {
    bg: "bg-yellow-200/80",
    text: "text-yellow-700",
    border: "border-yellow-400",
  },
};

const HomeSquare = ({ cellColor, roomState }: { cellColor: CellColor, roomState: RoomState }) => {
  const { roomId } = useParams<{ roomId: string }>();

  const bgClass = bgColorMap[cellColor];
  const pieceStyle = pieceStyles[cellColor as CellColor];

  const homePieces = Object.entries(
    roomState.players[cellColor]?.pieces ?? {}
  ).filter(([, piece]) => piece.positionIndex === -1);

  // const player = roomState.players[cellColor];
  return (
    <div className="flex relative">
      {[...Array(6)].map((_, colIndex) => (
        <div key={colIndex} className={bgClass}>
          {[...Array(6)].map((_, rowIndex) => {
            const isBorder =
              rowIndex === 0 ||
              rowIndex === 5 ||
              colIndex === 0 ||
              colIndex === 5;

            return (
              <Cell
                key={rowIndex}
                cellColor={isBorder ? cellColor : ""}
              />
            );
          })}
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {homePieces.map(([pieceId]) => (
            <div
              key={pieceId}
              className={`
          flex items-center justify-center
          rounded-full
          border
          ${pieceStyle.bg}
          ${pieceStyle.border}
          h-6 w-6
          sm:h-8 sm:w-8
          md:h-10 md:w-10
        `}
              onClick={() => movePiece(roomId, Number(pieceId), cellColor)}
            >
              <ChessPawn
                className={`
            h-4 w-4
            sm:h-5 sm:w-5
            md:h-6 md:w-6
            ${pieceStyle.text}
          `}
              />
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default HomeSquare;