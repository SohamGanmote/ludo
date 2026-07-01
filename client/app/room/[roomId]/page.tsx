"use client"

import HomeSquare from "@/src/UI/Board/HomeSquare";
import Layer1CellPath from "@/src/UI/Board/layer1/CellPath";
import Layer2CellPath1 from "@/src/UI/Board/layer2/CellPath1";
import Layer2CellPath2 from "@/src/UI/Board/layer2/CellPath2";
import Layer3CellPath from "@/src/UI/Board/layer3/CellPath";
import WinnerPath from "@/src/UI/Board/layer2/WinnerPath";
import { RoomState, SocketRes } from "@/types/types";
import socket from "@/src/services/socket";
import { useEffect, useState } from "react";
import PlayerCard from "@/src/UI/Board/PlayerCard";
import BoardSkeleton from "@/src/UI/skeleton/BoardSkeleton";
import { playSound } from "@/src/audio/sound";
import WinnerLoserModel from "@/src/UI/Model/WinnerLoserModel";
import { Volume2, VolumeX } from "lucide-react";

export default function LudoBoard() {
  const [roomState, setRoomState] = useState<RoomState | null>(() => {
    playSound("/put_piece.mp3");
    const latest = socket.getRoomState();
    return latest ? (latest as SocketRes).room : null;
  });

  useEffect(() => {
    const unsubscribe = socket.on("room-state", (message) => {
      setRoomState((message as SocketRes).room);
    });

    return unsubscribe;
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;

    const stored = localStorage.getItem("soundEnabled");

    if (stored !== null) {
      return stored === "true";
    }

    localStorage.setItem("soundEnabled", "true");
    return true;
  });


  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newVal = !prev;
      localStorage.setItem("soundEnabled", String(newVal));
      return newVal;
    });
  };

  if (!roomState) {
    return <BoardSkeleton />
  }

  const isOpen =
    roomState.playerCount > 1 &&
    roomState.winner.length === roomState.playerCount - 1;

  // Board render logic
  return (
    <>
      <section className="flex items-center justify-center min-h-screen p-4 overflow-auto">
        {/* Center alineing board */}
        <div>
          <div className="flex justify-between">
            <PlayerCard
              color="red"
            />
            <PlayerCard
              color="green"
            />
          </div>

          <section className="my-4">
            {/* Layer 1 */}
            <div className="flex">
              <HomeSquare cellColor="red" roomState={roomState} />
              <Layer1CellPath roomState={roomState} />
              <HomeSquare cellColor="green" roomState={roomState} />
            </div>

            {/* Layer 2 */}
            <div className="flex">
              <Layer2CellPath1 roomState={roomState} />
              <WinnerPath roomState={roomState} />
              <Layer2CellPath2 roomState={roomState} />
            </div>

            {/* Layer 3 */}
            <div className="flex">
              <HomeSquare cellColor="blue" roomState={roomState} />
              <Layer3CellPath roomState={roomState} />
              <HomeSquare cellColor="yellow" roomState={roomState} />
            </div>
          </section>

          <div className="flex justify-between">
            <PlayerCard
              color="blue"
            />
            <PlayerCard
              color="yellow"
            />
          </div>
        </div>

      </section >

      {isOpen &&
        <WinnerLoserModel roomState={roomState} />
      }

      <button
        onClick={toggleSound}
        className="absolute right-3 bottom-3 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border border-slate-300 text-white text-slate-700 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  );
}