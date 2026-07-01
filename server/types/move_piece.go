package types

type MovePiece struct {
	Type    string `json:"type"`
	RoomID  string `json:"roomID"`
	PieceID int    `json:"pieceID"`
	Color   string `json:"color"`
}
