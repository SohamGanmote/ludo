package socket;

import (
	"server/types"

	"github.com/gorilla/websocket"
)

// loop wait for next message for processing...
func ReadLoop(conn *websocket.Conn) {
	for {
		// here we are extracting data from sent payload from FE socket
		var event types.SocketMessage

		// Data conversion from JSON to go struct
		err := conn.ReadJSON(&event)
		if err != nil {
			return
		}

		// At this point we will have type and data in struct format
		HandleSocketEvent(conn, event)
	}
}
