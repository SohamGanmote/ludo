"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  DoorOpen,
  Hash,
  Sparkles,
} from "lucide-react";

import socket from "@/src/services/socket";
import StartGameModal from "@/src/UI/Model/StartGameModel";
import { SocketRes } from "@/types/types";

export default function Join() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [data, setData] = useState<SocketRes | null>(null);

  const handleJoin = () => {
    if (!name.trim() || !roomCode.trim()) return;

    localStorage.setItem("playerName", name.trim());

    socket.emit("join-room", {
      name,
      roomID: roomCode.toUpperCase(),
    });
  };

  socket.on("room-state", (message) => {
    const socketData = message as SocketRes;
    setData(socketData);

    const playerName = localStorage
      .getItem("playerName")
      ?.trim()
      .toLowerCase();

    const players = socketData.room.players;

    const color = Object.entries(players).find(
      ([_, player]) => player.name.toLowerCase() === playerName
    )?.[0];

    if (color) {
      localStorage.setItem("color", color);
    }
  });

  return (<>
    <section className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-500 flex items-center justify-center shadow-xl">
            <DoorOpen size={42} />
          </div>

          <h1 className="text-4xl font-bold mt-6">
            Join Room
          </h1>

          <p className="text-gray-400 mt-2">
            Enter your name and room code to join a game.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-6 space-y-6">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Your Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-white transition"
              />
            </div>
          </div>

          {/* Room Code */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Room Code
            </label>

            <div className="relative">
              <Hash
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.toUpperCase())
                }
                placeholder="e.g. 9005"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-white transition uppercase tracking-widest"
              />
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={!name.trim() || !roomCode.trim()}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer w-full  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DoorOpen size={18} />
            Join Room
          </button>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 flex gap-3">
          <Sparkles
            className="text-blue-400 mt-0.5 flex-shrink-0"
            size={18}
          />

          <div>
            <p className="font-medium text-blue-300">
              Quick Tip
            </p>

            <p className="text-sm text-gray-300 mt-1">
              Ask your friend for the room code. Room codes are Numerical.
            </p>
          </div>
        </div>

      </div>
    </section>

    {data &&
      <StartGameModal
        open={true}
        roomId={data.roomId}
        room={data.room}
      />
    }
  </>
  );
}