package game

import (
	"fmt"
	"math/rand"
	"server/store"
	"server/types"

	"github.com/gorilla/websocket"
)

func CreateRoom(conn *websocket.Conn, playerName string) string {
	roomID := fmt.Sprintf("%04d", rand.Intn(10000))

	store.Rooms[roomID] = &types.Room{
		CanJoin:     true,
		PlayerCount: 1,
		CurrentTurn: "blue",
		Winners:     []string{},
		Players: map[string]types.Player{
			"blue": {
				Name:     playerName,
				SocketID: conn,
				DieNum:   1,
				Rolled:   false,
				Pieces: map[int]types.Piece{
					1: {PositionIndex: -1, IsFinished: false},
					2: {PositionIndex: -1, IsFinished: false},
					3: {PositionIndex: -1, IsFinished: false},
					4: {PositionIndex: -1, IsFinished: false},
				}},
		},
	}

	return roomID
}
