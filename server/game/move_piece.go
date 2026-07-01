package game

import (
	"server/store"
	"server/types"

	"github.com/gorilla/websocket"
)

var moves = map[string][]int{
	"blue": {
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
		22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 100, 101, 102, 103, 104, 105,
	},
	"red": {
		14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
		32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
		50, 51, 52, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 200, 201, 202, 203, 204, 205,
	},
	"green": {
		27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
		45, 46, 47, 48, 49, 50, 51, 52, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
		13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 300, 301, 302, 303, 304, 305,
	},
	"yellow": {
		40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 1, 2, 3, 4, 5, 6,
		7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 400, 401, 402,
		403, 404, 405,
	},
}

var safePositions = map[int]bool{
	1:  true,
	9:  true,
	14: true,
	22: true,
	27: true,
	35: true,
	40: true,
	48: true,
}

// Here We are assigning colors based on when player joins
/*
	Player1 will be always blue
	Player2 will be always red
	Player3 will be always green
	Player4 will be always yellow
*/
// based on that we calculate next player turn
func isWinner(room *types.Room, color string) bool {
	for _, winner := range room.Winners {
		if winner == color {
			return true
		}
	}
	return false
}

func getNextTurn(room *types.Room) string {
	switch room.CurrentTurn {

	case "blue":
		if _, ok := room.Players["red"]; ok && !isWinner(room, "red") {
			return "red"
		}
		if _, ok := room.Players["green"]; ok && !isWinner(room, "green") {
			return "green"
		}
		if _, ok := room.Players["yellow"]; ok && !isWinner(room, "yellow") {
			return "yellow"
		}
		return "blue"

	case "red":
		if _, ok := room.Players["green"]; ok && !isWinner(room, "green") {
			return "green"
		}
		if _, ok := room.Players["yellow"]; ok && !isWinner(room, "yellow") {
			return "yellow"
		}
		if _, ok := room.Players["blue"]; ok && !isWinner(room, "blue") {
			return "blue"
		}
		return "red"

	case "green":
		if _, ok := room.Players["yellow"]; ok && !isWinner(room, "yellow") {
			return "yellow"
		}
		if _, ok := room.Players["blue"]; ok && !isWinner(room, "blue") {
			return "blue"
		}
		if _, ok := room.Players["red"]; ok && !isWinner(room, "red") {
			return "red"
		}
		return "green"

	case "yellow":
		if _, ok := room.Players["blue"]; ok && !isWinner(room, "blue") {
			return "blue"
		}
		if _, ok := room.Players["red"]; ok && !isWinner(room, "red") {
			return "red"
		}
		if _, ok := room.Players["green"]; ok && !isWinner(room, "green") {
			return "green"
		}
		return "yellow"
	}

	return "blue"
}

func MovePiece(conn *websocket.Conn, roomID string, pieceID int, color string) string {

	room, exists := store.Rooms[roomID]
	if !exists {
		return "error"
	}

	// Find player path
	path := moves[color]

	// Find player
	player, exists := room.Players[color]
	if !exists {
		return "error"
	}

	// player will move pieces only if its his turn
	if room.CurrentTurn != color {
		return "false-turn"
	}

	// Find piece
	piece := player.Pieces[pieceID]

	// Piece is inside home
	if piece.PositionIndex == -1 {

		// player can move piece out only if its 6 on die
		if player.DieNum != 6 {
			return "die-error"
		}

		piece.PositionIndex = 0

		// update store
		player.Pieces[pieceID] = piece
		player.Rolled = false

		room.CurrentTurn = getNextTurn(room)
		room.Players[color] = player

		return roomID
	}

	// Piece is on board
	// Current position is the index
	currentIndex := piece.PositionIndex

	newIndex := currentIndex + player.DieNum

	if newIndex >= len(path) {
		return "error"
	}

	piece.PositionIndex = newIndex

	// Finish logic
	if newIndex == len(path)-1 {
		piece.IsFinished = true
	}

	// Update the piece once
	player.Pieces[pieceID] = piece
	player.Rolled = false

	// If this move finished a piece, check if the player has won
	if piece.IsFinished {

		allFinished := true

		for _, p := range player.Pieces {
			// If any piece is not finished, player hasn't won yet
			if !p.IsFinished {
				allFinished = false
				break
			}
		}

		if allFinished {
			room.Winners = append(room.Winners, color)
		}
	}

	// Update player once
	room.Players[color] = player

	/*
				Kill Logic :)
				(Adding explanation because this was soo confusing that i had to pull OG pen paper move to understand WTF is going on)
				----------------------------------------------------------------------------------------------------------------------------
		    so the thing is Every player's `Position` stores the index in their own movement path (in order to render piece we use this index like this, moves[color][index] to get actual cell ID)
				now the thing is both cell ids has to be same to kill (which means 2 players are on same cell)
				so if this happens first we check if that cell is safeZone or not (we use safePositions for that)
				once we verify cell is not safeZone we send other player's piece home by resetting the pieces value
	*/

	// need where piece is to verify
	boardPos := path[piece.PositionIndex]

	// Don't kill pieces on safe positions
	if !safePositions[boardPos] {

		// Check every other player
		for otherColor, otherPlayer := range room.Players {

			if otherColor == color {
				// skip scan for current player
				continue
			}

			// looking for other players to kill

			// get boardPos for other player
			otherPath := moves[otherColor]

			for id, otherPiece := range otherPlayer.Pieces {

				if otherPiece.PositionIndex == -1 || otherPiece.IsFinished {
					// Ignore pieces at home or already finished
					continue
				}

				// Same board position?
				if otherPath[otherPiece.PositionIndex] == boardPos {

					// reset values for killed players piece
					otherPiece.PositionIndex = -1
					otherPiece.IsFinished = false

					// update store
					otherPlayer.Pieces[id] = otherPiece
				}
			}

			// update store
			room.Players[otherColor] = otherPlayer
		}
	}

	if player.DieNum != 6 {
		room.CurrentTurn = getNextTurn(room)
	}

	return roomID
}
