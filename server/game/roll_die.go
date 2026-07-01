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

	allPiecesAtHome := true

	for _, piece := range player.Pieces {
		if piece.PositionIndex != -1 {
			allPiecesAtHome = false
			break
		}
	}

	if allPiecesAtHome && dieNum != 6 {
		room.CurrentTurn = getNextTurn(room)
	} else {
		player.Rolled = true
	}

	player.DieNum = dieNum

	// update store
	room.Players[color] = player

	return roomID
}
