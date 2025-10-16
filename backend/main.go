package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
	"net/http"
	"os"
)

var API_URL = os.Getenv("API_URL")
var API_KEY = os.Getenv("API_KEY")

func main() {
	router := gin.Default()
	router.GET("/nationalities", GetNationalities)
	router.Run("localhost:8080")
}

func GetNationalities(c *gin.Context) {
	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		fmt.Println("Failed to initialize client")
	}

	data, _, err := client.From("Nationalities").Select("id,code,name", "", false).Execute()
	if err != nil {
		fmt.Println("Error while reading the data")
	}

	var allNations []Nationality
	json.Unmarshal(data, &allNations)
	c.IndentedJSON(http.StatusOK, allNations)
}
