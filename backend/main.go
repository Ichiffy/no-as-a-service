package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	mux := http.NewServeMux()

	// Middleware CORS
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			// Gérer les requêtes OPTIONS (preflight)
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

	mux.HandleFunc("/api/no", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		lang := resolveLocale(r.URL.Query().Get("lang"))
		json.NewEncoder(w).Encode(map[string]string{"message": getNoMessage(lang)})
	})

	log.Println("Backend démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", corsMiddleware(mux)))
}

func resolveLocale(raw string) string {
	switch raw {
	case "fr", "fr-FR", "fr_FR":
		return "fr"
	case "en", "en-US", "en_US":
		return "en"
	default:
		return "en"
	}
}

func getNoMessage(locale string) string {
	fileName := locale + ".json"
	filePath := filepath.Join("reasons", fileName)

	// Si le fichier n'existe pas, essayer depuis le répertoire backend
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		filePath = filepath.Join("backend", "reasons", fileName)
	}

	// Fallback vers le fichier global si la locale spécifique est introuvable
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		filePath = filepath.Join("reasons", "reasons.json")
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			filePath = filepath.Join("backend", "reasons", "reasons.json")
		}
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		log.Printf("Erreur lors de la lecture du fichier (%s): %v", filePath, err)
		return "Erreur lors de la lecture du fichier"
	}

	var reasons []string
	err = json.Unmarshal(data, &reasons)
	if err != nil {
		log.Println("Erreur lors du parsing du JSON:", err)
		return "Erreur lors du parsing du JSON"
	}

	if len(reasons) == 0 {
		return "Erreur: Aucun motif disponible"
	}
	return reasons[rand.Intn(len(reasons))]
}
