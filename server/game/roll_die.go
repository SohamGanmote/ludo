package game

import (
	"math/rand"
	"server/store"

	"github.com/gorilla/websocket"
)

func RollDie(conn *websocket.Conn, roomID string, color string) string {
	room, exists := store.Rooms[roomID]
	if !exists {
		return "error"
	}

	player, exists := room.Players[color]
	if !exists {
		return "error"
	}

	// roll the die 1 to 6
	dieNum := rand.Intn(6) + 1
	movePossible := false

	maxIndex := len(moves[color]) - 1

	for _, piece := range player.Pieces {
		// Skip finished pieces
		if piece.IsFinished {
			continue
		}

		// Piece is at home
		if piece.PositionIndex == -1 {
			// if die is 6 then only user can take piece iut of home
			if dieNum == 6 {
				movePossible = true
			}
			// else skip move
			continue
		}

		// Piece is on the board
		if piece.PositionIndex+dieNum <= maxIndex {
			movePossible = true
		}
	}

	// No piece can move so next player's turn
	if !movePossible {
		room.CurrentTurn = getNextTurn(room)
	} else {
		player.Rolled = true
	}

	player.DieNum = dieNum

	// update store
	room.Players[color] = player

	return roomID
}
