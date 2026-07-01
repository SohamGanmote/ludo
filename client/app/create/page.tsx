"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserRound, PlusCircle, Sparkles } from "lucide-react";
import socket from "@/src/services/socket";
import StartGameModal from "../../src/UI/Model/StartGameModel";
import { SocketRes } from "@/types/types";

export default function CreateRoom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [data, setData] = useState<SocketRes | null>(null);

  const handleCreate = () => {
    if (!name.trim()) return;

    localStorage.setItem("playerName", name.trim());
    localStorage.setItem("color", "blue");

    socket.emit("create-room", {
      name,
    });
  };

  useEffect(() => {
    socket.on("room-state", (message) => {
      setData(message as SocketRes);
    });
  }, []);

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
          <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br bg-blue-500 flex items-center justify-center shadow-xl">
            <PlusCircle size={42} />
          </div>

          <h1 className="text-4xl font-bold mt-6">
            Create Room
          </h1>

          <p className="text-gray-400 mt-2">
            Start a new Ludo match and invite your friends.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-6 space-y-6">

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
                placeholder="e.g. John"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg cursor-pointer active:scale-95 w-full disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-100 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:from-slate-300 disabled:hover:to-slate-400 disabled:active:scale-100 disabled:opacity-80"
          >
            <PlusCircle size={18} />
            Create Room
          </button>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 flex gap-3">
          <Sparkles className="text-blue-400 mt-0.5" size={18} />

          <div>
            <p className="font-medium text-blue-300">
              Quick Tip
            </p>

            <p className="text-sm text-gray-300 mt-1">
              Once the room is created, {`you'll`} receive a room code that you can
              share with your friends.
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