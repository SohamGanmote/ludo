export interface Piece {
	positionIndex: number;
	isFinished: boolean;
}

export interface RoomPlayer {
	name: string;
	pieces: Record<string, Piece>;
	dieNum: number;
	rolled: boolean;
}

export interface RoomState {
	canJoin: boolean;
	playerCount: number;
	currentTurn: string;
	winner: string[];
	players: Record<string, RoomPlayer>;
}

export const playerColors: Record<string, string> = {
	red: "#ef4444",
	blue: "#3b82f6",
	green: "#22c55e",
	yellow: "#eab308",
};

export interface SocketRes {
	roomId: string;
	room: RoomState;
}

export type CellColor = "red" | "green" | "blue" | "yellow";
