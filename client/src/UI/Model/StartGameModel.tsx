"use client";

import socket from "@/src/services/socket";
import { playerColors, RoomState, SocketRes } from "@/types/types";
import { Copy, Crown, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StartGameModalProps {
  open: boolean;
  roomId: string;
  room: RoomState;
}

export default function StartGameModal({
  open,
  roomId,
  room,
}: StartGameModalProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const unsubscribe = socket.on("room-state", (message) => {
      const data = message as SocketRes;

      // Server has started the game
      if (!data.room.canJoin) {
        router.push(`/room/${data.roomId}`);
      } else {
        // Re-enable button if server didn't start the game
        setStarting(false);
      }
    });

    return unsubscribe;
  }, [router]);

  if (!open) return null;

  const players = Object.entries(room.players);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartGame = () => {
    if (starting) return;

    setStarting(true);

    socket.emit("start-game", {
      roomID: roomId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#1A1A1A] border border-white/10 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Game Lobby
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Waiting for players...
            </p>
          </div>
        </div>

        {/* Room Code */}
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Room Code
          </p>

          <button
            onClick={copyRoomCode}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition cursor-pointer"
          >
            <span className="font-mono text-2xl tracking-widest text-white">
              {roomId}
            </span>

            <Copy size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Players */}
        <div className="px-6 pb-6">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Users size={18} />

            <span className="font-semibold">
              Players ({room.playerCount}/4)
            </span>
          </div>

          <div className="space-y-3">

            {players.map(([color, player], index) => (
              <div
                key={color}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                    style={{
                      backgroundColor:
                        playerColors[color] ?? "#6b7280",
                    }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-white">
                      {player.name}
                    </p>

                    <p className="text-xs capitalize text-gray-400">
                      {color}
                    </p>
                  </div>
                </div>

                {index === 0 && (
                  <div className="flex items-center gap-1 text-sm text-yellow-400">
                    <Crown size={16} />
                    Host
                  </div>
                )}
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({
              length: 4 - room.playerCount,
            }).map((_, index) => (
              <div
                key={index}
                className="flex items-center rounded-xl border border-dashed border-white/10 px-4 py-3 text-gray-500"
              >
                Waiting for player...
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <button
            disabled={room.playerCount < 2}
            onClick={handleStartGame}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-500/40"
          >
            <Play size={18} />
            Start Game
          </button>

          {room.playerCount < 2 && (
            <p className="mt-3 text-center text-xs text-gray-400">
              At least 2 players are required to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}