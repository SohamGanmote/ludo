package socket

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		allowedOrigins := map[string]bool{
			"http://localhost:3000":  true,
			"https://ludo.sohamg.in": true,
		}

		return allowedOrigins[r.Header.Get("Origin")]
	},
}

func HandleWS(w http.ResponseWriter, r *http.Request) {
	// Here we are converting that HTTP req in Socket Request (Upgrade*)
	conn, err := upgrader.Upgrade(w, r, nil)

	// throw error if failed to Upgrade
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	// We start loop to accept all the messages
	// loop waits for next message
	ReadLoop(conn)
}
