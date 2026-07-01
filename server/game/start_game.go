package game

import (
	"server/store"

	"github.com/gorilla/websocket"
)

func StartRoom(conn *websocket.Conn, roomID string) string {
	room, exists := store.Rooms[roomID]

	// check if room already exist or not
	if !exists {
		return "error"
	}

	// stop allowing joins once game has started.
	room.CanJoin = false

	return roomID
}
