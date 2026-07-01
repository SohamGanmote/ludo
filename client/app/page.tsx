"use client";

import { useRouter } from "next/navigation";
import { DoorOpen, PlusCircle, Dices, Volume2, VolumeX, Minimize, Maximize } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function Home() {
  const router = useRouter();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setServerOnline(data.message === "Server is running");
      } catch {
        setServerOnline(false);
      }
    };

    checkServer();

    const interval = setInterval(checkServer, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);


  return (
    <section className="min-h-screen flex items-center justify-center text-white p-4">
      {/* Server Status */}
      <div className="absolute top-5 left-5 flex items-start md:gap-4">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium backdrop-blur-md w-fit
      ${serverOnline
              ? "bg-green-500/20 border-green-500/40 text-green-300"
              : serverOnline === false
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-gray-500/20 border-gray-500/40 text-gray-300"
            }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full animate-pulse ${serverOnline
              ? "bg-green-400"
              : serverOnline === false
                ? "bg-red-400"
                : "bg-gray-400"
              }`}
          />
          {serverOnline === null
            ? "Checking server..."
            : serverOnline
              ? "Backend Online"
              : "Backend Offline"}
        </div>

        <p className="ml-1 max-w-[240px] text-xs text-gray-400">
          If the backend is asleep, it may take up to 2 minutes to wake up on the first request.
        </p>
      </div>

      <div className="w-[360px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-10 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 flex items-center justify-center shadow-lg">
            <Dices size={36} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-wide">
          🎲 Ludo
        </h1>

        <p className="text-gray-400 mt-2 mb-8">
          Create a room or join your friends.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/create")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
          >
            <PlusCircle size={20} />
            Create Room
          </button>

          <button
            onClick={() => router.push("/join")}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
          >
            <DoorOpen size={20} />
            Join Room
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleSound}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border border-slate-300 text-white text-slate-700 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border border-slate-300 text-white text-slate-700 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>

        {/* Decorative Ludo Colors */}
        <div className="flex justify-center gap-3 mt-8">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-md"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400 flex items-center justify-center gap-2">
          <a
            href="https://sohamg.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition underline"
          >
            Soham Ganmote
          </a>

          <span>•</span>

          <a
            href="https://github.com/SohamGanmote"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}