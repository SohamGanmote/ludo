package socket

import (
	"fmt"
	"log"
	"server/store"

	"github.com/gorilla/websocket"
)

func EmitRoomState(roomID string) {
	room := store.Rooms[roomID]

	payload := map[string]any{
		"type":   "room-state",
		"roomId": roomID,
		"room":   room,
	}

	fmt.Printf("Emitting: %+v\n", payload)

	for _, player := range room.Players {
		if player.SocketID != nil {
			player.SocketID.WriteJSON(payload)
		}
	}
}

func EmitError(conn *websocket.Conn, message string) {
	if conn == nil {
		return
	}

	payload := map[string]any{
		"type":    "error",
		"message": message,
	}

	if err := conn.WriteJSON(payload); err != nil {
		log.Println("failed to emit error:", err)
	}
}
