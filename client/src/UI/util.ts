import Swal from "sweetalert2";
import { playSound } from "../audio/sound";
import socket from "../services/socket";

import { playerColors } from "@/types/types";

type PlayerColor = keyof typeof playerColors;

export const movePiece = (
	roomId: string,
	pieceID: number,
	color: PlayerColor,
) => {
	const roomState = socket.getRoomState();

	const myColor = localStorage.getItem("color") as PlayerColor | null;

	if (roomState && !roomState.room.players[color].rolled) {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: "Roll the dice before moving a piece!",
		});
		return;
	}

	if (!myColor || myColor !== color) {
		console.warn("You can't move the opponent's pieces.");
		return;
	}

	playSound("/put_piece.mp3");

	socket.emit("move-piece", {
		roomID: roomId,
		pieceID: pieceID,
		color: color,
	});
};
