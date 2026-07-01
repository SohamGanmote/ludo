"use client";

import { useEffect } from "react";
import socket from "../services/socket";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socket.connect();
  }, []);

  return children;
}