package types

import "encoding/json"

type SocketMessage struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}
