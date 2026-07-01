import { RoomState } from "@/types/types";

export const cellMap = {
	blue: [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
		22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 100, 101, 102, 103, 104, 105,
	],
	red: [
		14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
		33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
		52, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 200, 201, 202, 203, 204, 205,
	],
	green: [
		27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
		46, 47, 48, 49, 50, 51, 52, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 300, 301, 302, 303, 304, 305,
	],
	yellow: [
		40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 1, 2, 3, 4, 5, 6, 7, 8,
		9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
		28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 400, 401, 402, 403, 404, 405,
	],
};

type PieceData = {
	id: number;
	color: keyof typeof cellMap;
};

export function getCellPiecesLookup(roomState: RoomState) {
	const cellPieces: Record<number, PieceData[]> = {};

	Object.entries(roomState.players).forEach(([playerColor, player]) => {
		Object.entries(player.pieces).forEach(([pieceId, piece]) => {
			if (
				piece.positionIndex < 0 ||
				piece.isFinished ||
				piece.positionIndex === -1
			)
				return;

			const cellId =
				cellMap[playerColor as keyof typeof cellMap][piece.positionIndex];

			if (!cellPieces[cellId]) {
				cellPieces[cellId] = [];
			}

			cellPieces[cellId].push({
				id: Number(pieceId),
				color: playerColor as keyof typeof cellMap,
			});
		});
	});

	return cellPieces;
}
