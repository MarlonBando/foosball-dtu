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
	"strings"
)

var SUPABASE_URL = os.Getenv("SUPABASE_URL")
var SUPABASE_KEY = os.Getenv("SUPABASE_KEY")

func main() {
	// Load the public key for JWT verification
	keyContent, err := os.ReadFile("publickey.json")
	if err != nil {
		fmt.Printf("Failed to read publickey.json: %v\n", err)
		os.Exit(1)
	}

	if err := ParseJWK(string(keyContent)); err != nil {
		fmt.Printf("Failed to parse JWK: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Public key loaded successfully")

	router := gin.Default()

	router.GET("/players", GetPlayers)
	router.GET("/players/me", GetCurrentPlayer)
	router.GET("/matches", GetPlayerMatches)
	router.GET("/match/:id", GetMatchDetails)
	router.GET("/nationalities", GetNationalities)

	router.POST("/matches/register", RegisterMatch)
	router.POST("/players/add", AddPlayer)
	router.POST("/matches/eloupdate", UpdateElo)

	router.PATCH("/matches/:matchId/accept", AcceptMatch)
	router.PATCH("/matches/:matchId/reject", RejectMatch)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}

func GetNationalities(c *gin.Context) {
	client, err := supabase.NewClient(
		SUPABASE_URL,
		SUPABASE_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// TODO: Use ExecutTo to avoid json conversion

	var allNations []Nationality
	_, err = client.From("Nationalities").Select("id,code,name", "", false).ExecuteTo(&allNations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, allNations)
}

func GetPlayers(c *gin.Context) {
	client, err := supabase.NewClient(
		SUPABASE_URL,
		SUPABASE_KEY,
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

func GetCurrentPlayer(c *gin.Context) {
	playerID, err := getPlayerIDFromRequest(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to initialize client"})
		return
	}

	var players []Player
	_, err = client.From("Players").Select("*", "", false).Eq("id", strconv.FormatInt(playerID, 10)).ExecuteTo(&players)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(players) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "player not found"})
		return
	}

	c.JSON(http.StatusOK, players[0])
}

func GetMatchDetails(c *gin.Context) {
	matchId := c.Param("id")
	if matchId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing path parameter: id"})
		return
	}

	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to initialize Supabase client"})
		return
	}

	var matches []Match
	_, err = client.From("Matches").Select("*", "", false).Eq("id", matchId).ExecuteTo(&matches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(matches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "match not found"})
		return
	}
	match := matches[0]

	matchPlayers, err := getMatchPlayers(*match.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	players, err := getPlayers(matchPlayers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	dto := MatchDetailDTO{
		ID:        *match.ID,
		CreatedAt: *match.CreatedAt,
		T1Score:   match.T1Score,
		T2Score:   match.T2Score,
		Status:    match.Status,
		Players:   make([]PlayerMatchDTO, 0, len(matchPlayers)),
	}

	for _, mp := range matchPlayers {
		player := players[mp.IDPlayer]
		playerDTO := PlayerMatchDTO{
			PlayerID:    *player.ID,
			Username:    player.Username,
			Name:        player.Name,
			Surname:     player.Surname,
			Nationality: player.Nationality,
			CurrentElo:  player.Elo,
			Wins:        player.Wins,
			Losses:      player.Losses,
			IsTeam1:     mp.IsTeam1,
			IsGk:        mp.IsGk,
			IsWin:       mp.IsWin,
			EloOld:      mp.EloOld,
			EloNew:      mp.EloNew,
			Status:      mp.Status,
		}
		dto.Players = append(dto.Players, playerDTO)
	}

	c.JSON(http.StatusOK, dto)
}

func GetPlayerMatches(c *gin.Context) {
	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to initialize Supabase client"})
		return
	}

	playerid := c.Query("playerid")
	if playerid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing query parameter: playerid"})
		return
	}

	// Get all MatchPlayer records for this player
	var matchPlayers []MatchPlayer
	_, err = client.From("MatchPlayers").Select("*", "", false).Eq("idPlayer", playerid).ExecuteTo(&matchPlayers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(matchPlayers) == 0 {
		c.JSON(http.StatusOK, []Match{})
		return
	}

	// Extract match IDs
	matchIds := make([]string, len(matchPlayers))
	for i, mp := range matchPlayers {
		matchIds[i] = strconv.Itoa(int(mp.IDMatch))
	}

	// Get matches
	var matches []Match
	_, err = client.From("Matches").Select("*", "", false).In("id", matchIds).ExecuteTo(&matches)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func RegisterMatch(c *gin.Context) {
	authHeader := c.Request.Header.Get("Authorization")
	err := Auth(authHeader)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	var req RegisterMatchRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message0": err.Error()})
		return
	}

	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message1": err.Error()})
		return
	}

	if req.T1Score == req.T2Score {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Match can't be a draw!"})
		return
	}

	newMatch := Match{
		T1Score: req.T1Score,
		T2Score: req.T2Score,
		Status:  MatchPending,
	}

	data, _, err := client.From("Matches").Insert([]Match{newMatch}, false, "", "representation", "").Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message2": err.Error()})
		return
	}

	var insertedMatches []Match
	json.Unmarshal(data, &insertedMatches)
	if len(insertedMatches) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to create match"})
		return
	}
	matchId := *insertedMatches[0].ID

	t1Won := req.T1Score > req.T2Score
	matchPlayers := []MatchPlayer{
		{IDMatch: matchId, IDPlayer: req.T1GK, IsTeam1: true, Status: PlayerPending, IsGk: true, IsWin: t1Won},
		{IDMatch: matchId, IDPlayer: req.T1ST, IsTeam1: true, Status: PlayerPending, IsGk: false, IsWin: t1Won},
		{IDMatch: matchId, IDPlayer: req.T2GK, IsTeam1: false, Status: PlayerPending, IsGk: true, IsWin: !t1Won},
		{IDMatch: matchId, IDPlayer: req.T2ST, IsTeam1: false, Status: PlayerPending, IsGk: false, IsWin: !t1Won},
	}

	_, _, err = client.From("MatchPlayers").Insert(matchPlayers, false, "", "minimal", "").Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message3": err.Error()})
		return
	}

	c.JSON(http.StatusOK, insertedMatches[0])
}

func AcceptMatch(c *gin.Context) {
	authHeader := c.Request.Header.Get("Authorization")
	err := Auth(authHeader)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

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

	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	matchPlayers, err := getMatchPlayers(atoi64(idMatch))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var targetMP *MatchPlayer
	for i := range matchPlayers {
		if matchPlayers[i].IDPlayer == atoi64(idPlayer) {
			targetMP = &matchPlayers[i]
			break
		}
	}

	if targetMP == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "player not part of this match"})
		return
	}

	targetMP.Status = PlayerAccepted
	_, _, err = client.From("MatchPlayers").Update(*targetMP, "minimal", "").Eq("id", fmt.Sprintf("%d", *targetMP.ID)).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	team1Accepted := false
	team2Accepted := false
	for _, mp := range matchPlayers {
		// Why mp.IDPlayer == ... becuase that is the player that called the endpoint
		// and we know it has accpeted, and matchPlayers has NOT the updated status.
		accepted := mp.Status == PlayerAccepted || mp.IDPlayer == atoi64(idPlayer)
		if !accepted {
			continue
		}

		if mp.IsTeam1 {
			team1Accepted = true
		} else {
			team2Accepted = true
		}
	}

	if team1Accepted && team2Accepted {
		_, _, err = client.From("Matches").Update(map[string]any{"status": MatchCompleted}, "minimal", "").Eq("id", idMatch).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "accepted"})
}

func RejectMatch(c *gin.Context) {
	authHeader := c.Request.Header.Get("Authorization")
	err := Auth(authHeader)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

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

	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	matchPlayers, err := getMatchPlayers(atoi64(idMatch))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var targetMP *MatchPlayer
	for i := range matchPlayers {
		if matchPlayers[i].IDPlayer == atoi64(idPlayer) {
			targetMP = &matchPlayers[i]
			break
		}
	}

	if targetMP == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "player not part of this match"})
		return
	}

	targetMP.Status = PlayerRejected
	_, _, err = client.From("MatchPlayers").Update(*targetMP, "minimal", "").Eq("id", fmt.Sprintf("%d", *targetMP.ID)).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	team1Rejected := targetMP.IsTeam1
	team2Rejected := !targetMP.IsTeam1
	for _, mp := range matchPlayers {
		// Why mp.IDPlayer == ... becuase that is the player that called the endpoint
		// and we know it has rejected, and matchPlayers has NOT the updated status.
		rejected := mp.Status == PlayerRejected || mp.IDPlayer == atoi64(idPlayer)
		if !rejected {
			continue
		}

		if mp.IsTeam1 {
			team1Rejected = true
		} else {
			team2Rejected = true
		}
	}

	if team1Rejected && team2Rejected {
		// We updated using map becuase in this way we avoid to fatch the full match
		// And we avoid to override other informations
		_, _, err = client.From("Matches").
			Update(map[string]any{"status": MatchRejected}, "minimal", "").
			Eq("id", idMatch).
			Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "rejected"})
}

func AddPlayer(c *gin.Context) {
	var newPlayer Player

	if err := c.BindJSON(&newPlayer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	client, err := supabase.NewClient(
		SUPABASE_URL,
		SUPABASE_KEY,
		&supabase.ClientOptions{},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// Insert player into database

	var insertedPlayers []Player
	client.From("Players").Insert(newPlayer, false, "", "representation", "").ExecuteTo(&insertedPlayers)

	if insertedPlayers == nil || len(insertedPlayers) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to create player"})
		return
	}

	c.JSON(http.StatusOK, insertedPlayers[0])
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

	matchPlayers, err := getMatchPlayers(*match.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(matchPlayers) != 4 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "expected 4 players in match"})
		return
	}

	// Get all players
	players, err := getPlayers(matchPlayers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Calculate team ELOs
	var team1Players, team2Players []int64
	for _, mp := range matchPlayers {
		if mp.IsTeam1 {
			team1Players = append(team1Players, mp.IDPlayer)
		} else {
			team2Players = append(team2Players, mp.IDPlayer)
		}
	}

	t1Elo := (players[team1Players[0]].Elo + players[team1Players[1]].Elo) / 2
	t2Elo := (players[team2Players[0]].Elo + players[team2Players[1]].Elo) / 2

	// Update each player
	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	for _, mp := range matchPlayers {
		player := players[mp.IDPlayer]
		nMatches := int(player.Wins + player.Losses)

		var teamElo, oppElo int16
		var teamScore, oppScore int

		if mp.IsTeam1 {
			teamElo, oppElo = t1Elo, t2Elo
			teamScore, oppScore = int(match.T1Score), int(match.T2Score)
		} else {
			teamElo, oppElo = t2Elo, t1Elo
			teamScore, oppScore = int(match.T2Score), int(match.T1Score)
		}

		eloDelta := elo.GetEloDelta(teamElo, oppElo, nMatches, teamScore, oppScore)
		oldElo := player.Elo

		if teamScore > oppScore {
			player.Wins++
		} else {
			player.Losses++
		}

		player.Elo += eloDelta

		_, _, err := client.From("Players").Update(player, "minimal", "").Eq("id", fmt.Sprintf("%d", *player.ID)).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		mp.EloOld = oldElo
		mp.EloNew = player.Elo
		mp.IsWin = teamScore > oppScore
		_, _, err = client.From("MatchPlayers").Update(mp, "minimal", "").Eq("id", fmt.Sprintf("%d", *mp.ID)).Execute()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "ELO updated successfully"})
}

func atoi64(s string) int64 {
	i, _ := strconv.Atoi(s)
	return int64(i)
}

func getMatchPlayers(matchId int64) ([]MatchPlayer, error) {
	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		return nil, err
	}

	var matchPlayers []MatchPlayer
	_, err = client.From("MatchPlayers").Select("*", "", false).Eq("idMatch", fmt.Sprintf("%d", matchId)).ExecuteTo(&matchPlayers)
	if err != nil {
		return nil, err
	}

	return matchPlayers, nil
}

func getPlayers(matchPlayers []MatchPlayer) (map[int64]Player, error) {
	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		return nil, err
	}

	playerIds := make([]string, len(matchPlayers))
	for i, mp := range matchPlayers {
		playerIds[i] = strconv.Itoa(int(mp.IDPlayer))
	}

	data, _, err := client.From("Players").Select("*", "", false).In("id", playerIds).Execute()
	if err != nil {
		return nil, err
	}

	var players []Player
	json.Unmarshal(data, &players)

	playerMap := make(map[int64]Player)
	for _, p := range players {
		playerMap[*p.ID] = p
	}

	return playerMap, nil
}

func isJwtValid(token string) bool {
	return IsTokenValid(token)
}

// ============================================================================
// PERFORMANCE TODO: Current implementation queries database on every request
// ============================================================================
// Better alternatives for production:
// 1. Store player_id in JWT user_metadata (no DB lookup, cryptographically signed)
// 2. Use Redis cache for user_id -> player_id mapping (faster than DB)
// ============================================================================

func getPlayerIDFromUserID(userID string) (int64, error) {
	client, err := supabase.NewClient(SUPABASE_URL, SUPABASE_KEY, &supabase.ClientOptions{})
	if err != nil {
		return 0, err
	}

	var players []Player
	_, err = client.From("Players").Select("id", "", false).Eq("user_id", userID).ExecuteTo(&players)
	if err != nil {
		return 0, err
	}

	if len(players) == 0 {
		return 0, errors.New("no player found for this user - please contact the maintainer")
	}

	if players[0].ID == nil {
		return 0, errors.New("invalid player data")
	}

	return *players[0].ID, nil
}

func getPlayerIDFromRequest(c *gin.Context) (int64, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return 0, errors.New("missing authorization header")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return 0, errors.New("invalid authorization header format")
	}

	userID, err := GetUserIDFromToken(parts[1])
	if err != nil {
		return 0, err
	}

	return getPlayerIDFromUserID(userID)
}
