"use client";

import { playSound } from "@/src/audio/sound";
import { RoomState, CellColor } from "@/types/types";
import { Trophy, Home, XCircle, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WinnerLoserModel = ({ roomState }: { roomState: RoomState }) => {
  const router = useRouter();

  const myColor =
    typeof window !== "undefined"
      ? (localStorage.getItem("color") as CellColor | null)
      : null;

  const rankings = useMemo(() => {
    const ranked = roomState.winner.map((color, index) => ({
      rank: index + 1,
      color,
      name: roomState.players[color].name,
    }));

    const losers = (Object.keys(roomState.players) as CellColor[])
      .filter((color) => !roomState.winner.includes(color))
      .map((color, index) => ({
        rank: ranked.length + index + 1,
        color,
        name: roomState.players[color].name,
      }));

    return [...ranked, ...losers];
  }, [roomState]);

  const isLoser =
    myColor && !roomState.winner.includes(myColor);

  const myRank =
    myColor && roomState.winner.includes(myColor)
      ? roomState.winner.indexOf(myColor) + 1
      : roomState.playerCount;

  useEffect(() => {
    if (!myColor) return;

    if (isLoser) {
      playSound("/loser.mp3");
    } else {
      playSound("/winner.mp3");
    }
  }, [myColor, isLoser]);

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 bg-[#1F3F34] p-8 rounded-3xl shadow-2xl w-[360px] max-w-[90vw] text-white">

        {/* Title */}
        <div className="text-center mb-6">
          {isLoser ? (
            <>
              <XCircle className="mx-auto mb-2 text-red-500" size={42} />
              <h1 className="text-3xl font-bold mt-4">You Lost</h1>
            </>
          ) : (
            <>
              <Crown className="mx-auto mb-2 text-yellow-500" size={42} />
              <h1 className="text-3xl font-bold mt-4">You Won!</h1>
            </>
          )}

          <p className="text-gray-300 mt-2">
            Your Rank:{" "}
            <span className="font-bold text-white">
              #{myRank}
            </span>
          </p>
        </div>

        {/* Rankings */}
        <div className="space-y-3 mb-6">
          {rankings.map((player) => (
            <div
              key={player.color}
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">
                  #{player.rank}
                </span>

                <div>
                  <div className="font-semibold">
                    {player.name}
                  </div>

                  <div className="text-xs text-gray-300 capitalize">
                    {player.color}
                  </div>
                </div>
              </div>

              {player.color === myColor && (
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition cursor-pointer"
        >
          <Home size={18} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default WinnerLoserModel;