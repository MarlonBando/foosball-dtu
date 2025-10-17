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
	router.GET("/players", GetPlayers)
	router.POST("/matches/register", RegisterMatch)

	router.Run("localhost:8080")
}

func GetNationalities(c *gin.Context) {
	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		fmt.Println("Failed to initialize supabase client")
	}

	data, _, err := client.From("Nationalities").Select("id,code,name", "", false).Execute()
	if err != nil {
		fmt.Println("Error while reading the data")
	}

	var allNations []Nationality
	json.Unmarshal(data, &allNations)
	c.IndentedJSON(http.StatusOK, allNations)
}

func GetPlayers(c *gin.Context) {
	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		fmt.Println("Failed to initialize supabase client")
	}

	data, _, err := client.From("Players").Select("*", "", false).Execute()
	if err != nil {
		fmt.Println("Error while fetching the data")
	}

	var allPlayers []Player
	json.Unmarshal(data, &allPlayers)
	c.IndentedJSON(http.StatusOK, allPlayers)
}

func RegisterMatch(c *gin.Context) {
	var newMatch Match

	if err := c.BindJSON(&newMatch); err != nil {
		fmt.Println(err)
		return
	}

	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		fmt.Println("Failed to initialize supabase client")
		return
	}

	data, count, err := client.From("Matches").Insert(newMatch, false, "", "minimal", "").Execute()
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(data)
	fmt.Println(count)
}
