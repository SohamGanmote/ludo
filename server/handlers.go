package main

import (
	"encoding/json"
	"net/http"
)

func healthCheck(w http.ResponseWriter, r *http.Request) {
	// creating a struct (its equivalent of JSON)
	response := map[string]string{
		"message": "Server is running",
	}

	// setting up the return header types
	w.Header().Set("Content-Type", "application/json")

	// converting to JSON
	json.NewEncoder(w).Encode(response)
}
