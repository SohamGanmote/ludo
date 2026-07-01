package main

import (
	"fmt"
	"net/http"
	"server/socket"
)

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		switch origin {
		case "http://localhost:3000", "https://ludo.sohamg.in":
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	// APIs
	mux.HandleFunc("/health", healthCheck)

	// Sockets: initial request will be in HTTP
	mux.HandleFunc("/ws", socket.HandleWS)

	// Server logs
	fmt.Println("Server running on http://localhost:8080")

	// Error handling
	err := http.ListenAndServe(":8080", cors(mux))
	if err != nil {
		fmt.Println("Error:", err)
	}
}
