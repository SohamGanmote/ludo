import { CellColor, RoomState, SocketRes } from "@/types/types";
import { ChessPawn } from "lucide-react";
import RollDiceButton from "./RollDiceBtn";
import { useEffect, useState } from "react";
import socket from "@/src/services/socket";

type PlayerCardProps = {
  color: CellColor;
};

const colorMap = {
  red: {
    bg: "bg-red-500",
    light: "bg-red-100",
    text: "text-red-700",
  },
  green: {
    bg: "bg-green-500",
    light: "bg-green-100",
    text: "text-green-700",
  },
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-700",
  },
  yellow: {
    bg: "bg-yellow-400",
    light: "bg-yellow-100",
    text: "text-yellow-700",
  },
};

const PlayerCard = ({
  color,
}: PlayerCardProps) => {

  // Socket update UI =============================================================
  const [roomState, setRoomState] = useState<RoomState | null>(() => {
    const latest = socket.getRoomState();
    return latest ? (latest as SocketRes).room : null;
  });

  useEffect(() => {
    const unsubscribe = socket.on("room-state", (message) => {
      setRoomState((message as SocketRes).room);
    });

    return unsubscribe;
  }, []);
  // Socket update UI =============================================================

  const styles = colorMap[color];
  const player = roomState?.players[color];

  if (!player) return <div />;

  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <div
        className={`
        inline-flex items-center gap-1 md:gap-2
        rounded-full
        md:p-2 pe-2 md:pe-4
        transition-colors
        ${roomState.currentTurn === color ? styles.bg : styles.light}
      `}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80">
          <ChessPawn
            className={`h-5 w-5 ${roomState.currentTurn === color ? "text-black" : styles.text
              }`}
          />
        </div>

        <p
          className={`text-sm md:font-semibold capitalize ${roomState.currentTurn === color ? "text-white" : "text-gray-900"
            }`}
        >
          {player.name}
        </p>
      </div>

      <RollDiceButton color={color} />
    </div>

  );
};

export default PlayerCard;