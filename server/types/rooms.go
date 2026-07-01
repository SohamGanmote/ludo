package types

import "github.com/gorilla/websocket"

type Piece struct {
	PositionIndex int  `json:"positionIndex"`
	IsFinished    bool `json:"isFinished"`
}

type Player struct {
	Name     string          `json:"name"`
	SocketID *websocket.Conn `json:"-"` // - will make sure this stays on server
	Pieces   map[int]Piece   `json:"pieces"`
	DieNum   int             `json:"dieNum"`
	Rolled   bool            `json:"rolled"`
}

type Room struct {
	CanJoin     bool              `json:"canJoin"`
	PlayerCount int               `json:"playerCount"`
	CurrentTurn string            `json:"currentTurn"`
	Winners     []string          `json:"winner"`
	Players     map[string]Player `json:"players"`
}
