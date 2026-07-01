package socket

import (
	"encoding/json"
	"server/game"
	"server/types"

	"github.com/gorilla/websocket"
)

func HandleSocketEvent(conn *websocket.Conn, msg types.SocketMessage) {

	// Basic switch case
	switch msg.Type {

	case "create-room":
		var payload types.CreateRoom

		// converting data to Struct
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			return
		}

		// game logic
		roomID := game.CreateRoom(conn, payload.Name)
		EmitRoomState(roomID) // emit for others

	case "join-room":
		var payload types.JoinRoom

		// converting data to Struct
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			return
		}

		// game logic
		roomID := game.JoinRoom(conn, payload.Name, payload.RoomID)

		// join room can return error in some case
		if roomID == "error" {
			// if it does throw an error in socket
			EmitError(conn, "Invalid room code or the room is full.")
		} else {
			EmitRoomState(roomID)
		}

	case "start-game":
		var payload types.StartGame

		// converting data to Struct
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			return
		}

		// game logic
		roomID := game.StartRoom(conn, payload.RoomID)

		// join room can return error in some case
		if roomID == "error" {
			// if it does throw an error in socket
			EmitError(conn, "Invalid room code.")
		} else {
			EmitRoomState(roomID)
		}

	case "move-piece":
		var payload types.MovePiece

		// converting data to Struct
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			return
		}

		// game logic
		roomID := game.MovePiece(conn, payload.RoomID, payload.PieceID, payload.Color)

		// throw error in case of
		/*
			1.Room not found
			2.Board Overflow (Piece is at end, need 2 to finish but user tried to move it with 5 on die)
			3.Player not found
		*/
		// if it does throw an error in socket
		switch roomID {
		case "error":
			EmitError(conn, "Player or room not found.")

		case "false-turn":
			EmitError(conn, "It's not your turn or piece.")

		case "die-error":
			EmitError(conn, "You need to roll a 6 to bring a piece onto the board.")

		default:
			EmitRoomState(roomID)
		}

	case "roll-die":
		var payload types.RollDie

		// converting data to Struct
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			return
		}

		// game logic
		roomID := game.RollDie(conn, payload.RoomID, payload.Color)
		if roomID == "error" {
			// if it does throw an error in socket
			EmitError(conn, "Room/Player not found.")
		} else {
			EmitRoomState(roomID)
		}
	}
}
