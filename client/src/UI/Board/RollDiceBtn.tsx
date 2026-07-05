import { useEffect, useRef, useState } from "react";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react";
import { CellColor, playerColors, RoomState, SocketRes } from "@/types/types";
import socket from "@/src/services/socket";
import { useParams } from "next/navigation";
import { playSound } from "@/src/audio/sound";
import Swal from "sweetalert2";

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

interface RollDiceButtonProps {
  color: CellColor;
}

export default function RollDiceButton({ color }: RollDiceButtonProps) {
  const { roomId } = useParams<{ roomId: string }>();

  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const [roomState, setRoomState] = useState<RoomState | null>(() => {
    const latest = socket.getRoomState() as SocketRes | null;
    return latest?.room ?? null;
  });

  useEffect(() => {
    const unsubscribe = socket.on("room-state", (message) => {
      const room = (message as SocketRes).room;

      setRoomState(room);
      setValue(room.players[color].dieNum);
    });

    return unsubscribe;
  }, [color]);

  const player = roomState?.players[color];

  const playerName =
    typeof window !== "undefined"
      ? localStorage.getItem("playerName")
      : null;

  const isMyTurn =
    playerName?.trim() === player?.name?.trim() &&
    roomState?.currentTurn === color;

  const previousDieNumber = useRef<number>(1);

  const playAnimation = (finalValue: number) => {
    if (!isMyTurn) return;
    playSound("/roll_die.mp3");
    setRolling(true);

    let rolls = 0;

    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);

      rolls++;

      if (rolls >= 15) {
        clearInterval(interval);
        setValue(finalValue);
        setRolling(false);
      }
    }, 70);
  };

  useEffect(() => {
    const dieNum = player?.dieNum;

    if (
      dieNum === undefined ||
      dieNum < 1 ||
      dieNum > 6 ||
      dieNum === previousDieNumber.current
    ) {
      return;
    }

    previousDieNumber.current = dieNum;
    playAnimation(dieNum);
  }, [player?.dieNum, isMyTurn]);

  const rollDice = () => {
    if (!isMyTurn || rolling) return;
    if (player?.rolled) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Die Already Rolled!",
      })
      return;
    }

    playAnimation(Number(player?.dieNum) || 1);

    socket.emit("roll-die", {
      roomID: roomId,
      color,
    });
  };

  const DiceIcon = diceIcons[value - 1];

  return (
    <button
      onClick={rollDice}
      disabled={!isMyTurn || rolling}
      className={`rounded-lg p-2 transition ${roomState?.currentTurn !== color
        ? "cursor-not-allowed opacity-50"
        : "cursor-pointer"
        }`}
    >
      <DiceIcon
        className={`h-12 w-12 transition-transform duration-150 ${rolling ? "animate-spin scale-125" : ""
          }`}
        fill={playerColors[color]}
      />
    </button>
  );
}