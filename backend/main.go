package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"foosballDtu/elo"
	"github.com/gin-gonic/gin"
	"github.com/supabase-community/supabase-go"
	"net/http"
	"os"
	"strconv"
)

var API_URL = os.Getenv("API_URL")
var API_KEY = os.Getenv("API_KEY")

func main() {
	router := gin.Default()

	router.GET("/players", GetPlayers)
	router.GET("/matches", GetPlayerMatches)
	router.GET("/nationalities", GetNationalities)

	router.POST("/matches/register", RegisterMatch)
	router.POST("/players/add", AddPlayer)
	router.POST("/matches/eloupdate", UpdateElo)

	router.PATCH("/matches/:matchId/accept", AcceptMatch)
	router.PATCH("/matches/:matchId/reject", RejectMatch)

	router.Run("localhost:8080")
}

func GetNationalities(c *gin.Context) {
	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// TODO: Use ExecutTo to avoid json conversion
	data, _, err := client.From("Nationalities").Select("id,code,name", "", false).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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

	// TODO: Use ExecutTo to avoid json conversion
	data, _, err := client.From("Players").Select("*", "", false).Execute()
	if err != nil {
		fmt.Println("Error while fetching the data")
	}

	var allPlayers []Player
	json.Unmarshal(data, &allPlayers)
	c.IndentedJSON(http.StatusOK, allPlayers)
}

func GetPlayerMatches(c *gin.Context) {
	var matches []Match

	client, err := supabase.NewClient(API_URL, API_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to initialize Supabase client"})
		return
	}

	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: id"})
		return
	}

	eqFilter := fmt.Sprintf("t1_gk.eq.%s,t1_st.eq.%s,t2_gk.eq.%s,t2_st.eq.%s", id, id, id, id)

	_, err = client.From("Matches").Select("*", "", false).Or(eqFilter, "").ExecuteTo(&matches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	if len(matches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "no matches found"})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func RegisterMatch(c *gin.Context) {
	var newMatch Match

	if err := c.BindJSON(&newMatch); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	data, _, err := client.
		From("Matches").
		Insert([]Match{newMatch}, false, "", "representation", "").
		Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

func AcceptMatch(c *gin.Context) {
	idMatch := c.Param("matchId")
	idPlayer := c.Query("playerId")
	if idMatch == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: matchId"})
		return
	}

	if idPlayer == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: playerId"})
		return
	}

	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var matches []Match
	_, err = client.From("Matches").Select("*", "", false).Eq("id", idMatch).ExecuteTo(&matches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(matches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "match not found"})
		return
	}

	match := matches[0]

	atoi, err := strconv.Atoi(idPlayer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	id := int64(atoi)

	isTeam1 := true

	switch id {
	case match.T1GK:
		match.T1GKStatus = PlayerAccepted
	case match.T1ST:
		match.T1STStatus = PlayerAccepted
	case match.T2GK:
		match.T2GKStatus = PlayerAccepted
		isTeam1 = false
	case match.T2ST:
		match.T2STStatus = PlayerAccepted
		isTeam1 = false
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error! No id player found in the match"})
		return
	}

	var otherTeamAccepted bool
	if isTeam1 {
		otherTeamAccepted = match.T2GKStatus == PlayerAccepted || match.T2STStatus == PlayerAccepted
	} else {
		otherTeamAccepted = match.T1GKStatus == PlayerAccepted || match.T1STStatus == PlayerAccepted
	}

	if otherTeamAccepted {
		match.Status = MatchCompleted
	}

	updatedMatch, _, err := client.From("Matches").Update(match, "minimal", "").Eq("id", idMatch).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedMatch)
}

func RejectMatch(c *gin.Context) {
	idMatch := c.Param("matchId")
	idPlayer := c.Query("playerId")

	if idMatch == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: matchId"})
		return
	}
	if idPlayer == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: playerId"})
		return
	}

	client, err := supabase.NewClient(API_URL, API_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var matches []Match
	_, err = client.From("Matches").Select("*", "", false).Eq("id", idMatch).ExecuteTo(&matches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(matches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "match not found"})
		return
	}

	match := matches[0]

	atoi, err := strconv.Atoi(idPlayer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid playerId"})
		return
	}
	id := int64(atoi)

	isTeam1 := true
	switch id {
	case match.T1GK:
		match.T1GKStatus = PlayerRejected
	case match.T1ST:
		match.T1STStatus = PlayerRejected
	case match.T2GK:
		match.T2GKStatus = PlayerRejected
		isTeam1 = false
	case match.T2ST:
		match.T2STStatus = PlayerRejected
		isTeam1 = false
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "player not part of this match"})
		return
	}

	var otherTeamRejected bool
	if isTeam1 {
		otherTeamRejected = match.T2GKStatus == PlayerRejected || match.T2STStatus == PlayerRejected
	} else {
		otherTeamRejected = match.T1GKStatus == PlayerRejected || match.T1STStatus == PlayerRejected
	}

	if otherTeamRejected {
		match.Status = MatchRejected
	}

	updatedMatch, _, err := client.From("Matches").Update(match, "minimal", "").Eq("id", idMatch).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "rejected", "match": updatedMatch})
}

func AddPlayer(c *gin.Context) {
	var newPlayer Match

	if err := c.BindJSON(&newPlayer); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err})
		return
	}

	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	data, _, err := client.From("Players").Insert(newPlayer, false, "", "minimal", "").Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	c.JSON(http.StatusOK, data)
}

func UpdateElo(c *gin.Context) {
	var payload SupabaseWebhook
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	match := payload.Record
	matchPrevState := payload.OldRecord

	if match.Status != MatchCompleted {
		return
	}

	if matchPrevState.Status != MatchPending {
		return
	}

	players, err := getPlayerInMatch(match.T1GK, match.T1ST, match.T2GK, match.T2ST)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = updatePlayers(match, players)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	for _, player := range players {
		_, _, err := client.From("Players").Update(player, "minimal", "").Eq("id", fmt.Sprintf("%d", player.ID)).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "ELO updated successfully"})
}

func getPlayerInMatch(t1gk, t1st, t2gk, t2st int64) (map[int64]Player, error) {
	client, err := supabase.NewClient(
		API_URL,
		API_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		return nil, err
	}

	playersId := []string{
		strconv.Itoa(int(t1gk)),
		strconv.Itoa(int(t2gk)),
		strconv.Itoa(int(t1st)),
		strconv.Itoa(int(t2st)),
	}

	data, _, err := client.From("Players").Select("*", "", false).In("id", playersId).Execute()
	var players []Player
	json.Unmarshal(data, &players)
	if len(players) != 4 {
		return nil, fmt.Errorf("expected 4 players, got %d", len(players))
	}

	matchPlayers := make(map[int64]Player, 4)
	for _, player := range players {
		switch player.ID {
		case t1gk:
			matchPlayers[t1gk] = player
		case t1st:
			matchPlayers[t1st] = player
		case t2gk:
			matchPlayers[t2gk] = player
		case t2st:
			matchPlayers[t2st] = player
		default:
			return nil, errors.New("Unknown player, something off with the query")
		}
	}

	return matchPlayers, nil
}

func updatePlayers(match Match, players map[int64]Player) error {
	t1Elo := (players[match.T1GK].Elo + players[match.T1ST].Elo) / 2
	t2Elo := (players[match.T2GK].Elo + players[match.T2ST].Elo) / 2

	for id, player := range players {
		isTeam1 := id == match.T1GK || id == match.T1ST
		nMatches := int(player.Wins + player.Losses)

		var teamElo, oppElo int16
		var teamScore, oppScore int

		if isTeam1 {
			teamElo, oppElo = t1Elo, t2Elo
			teamScore, oppScore = int(match.T1Score), int(match.T2Score)
		} else {
			teamElo, oppElo = t2Elo, t1Elo
			teamScore, oppScore = int(match.T2Score), int(match.T1Score)
		}

		eloDelta := elo.GetEloDelta(teamElo, oppElo, nMatches, teamScore, oppScore)

		if teamScore > oppScore {
			player.Wins++
		} else {
			player.Losses++
		}

		player.Elo += eloDelta
		players[id] = player
	}

	return nil
}
