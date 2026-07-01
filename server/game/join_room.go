package game

import (
	"server/store"
	"server/types"

	"github.com/gorilla/websocket"
)

var colors = []string{
	"red",
	"green",
	"yellow",
}

func JoinRoom(conn *websocket.Conn, playerName string, roomID string) string {
	room, exists := store.Rooms[roomID]

	// check if room already exist or not
	if !exists {
		return "error"
	}

	// check if new players are allowed to join
	if !room.CanJoin {
		return "error"
	}

	color := colors[room.PlayerCount-1]

	player := types.Player{
		Name:     playerName,
		SocketID: conn,
		DieNum:   1,
		Rolled:   false,
		Pieces: map[int]types.Piece{
			1: {PositionIndex: -1, IsFinished: false},
			2: {PositionIndex: -1, IsFinished: false},
			3: {PositionIndex: -1, IsFinished: false},
			4: {PositionIndex: -1, IsFinished: false},
		},
	}

	// Add player to the map
	room.Players[color] = player

	room.PlayerCount++

	// Stop allowing joins once the room has 4 players.
	if room.PlayerCount >= 4 {
		room.CanJoin = false
	}

	return roomID

}
