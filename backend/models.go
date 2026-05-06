package main

import "time"

type Nationality struct {
	Id   int64  `json:"id"`
	Code string `json:"code"`
	Name string `json:"name"`
}

type Match struct {
	ID        *int64      `json:"id,omitempty"`
	CreatedAt *time.Time  `json:"created_at,omitempty"`
	T1Score   int16       `json:"t1_score"`
	T2Score   int16       `json:"t2_score"`
	Status    MatchStatus `json:"status"`
}

type PlayerStatus string
type MatchStatus string

const (
	PlayerPending  PlayerStatus = "pending"
	PlayerAccepted PlayerStatus = "accepted"
	PlayerRejected PlayerStatus = "rejected"
)

const (
	MatchPending   MatchStatus = "pending"
	MatchCompleted MatchStatus = "completed"
	MatchRejected  MatchStatus = "rejected"
)

type Player struct {
	ID          *int64     `json:"id,omitempty"`
	CreatedAt   *time.Time `json:"created_at,omitempty"`
	Username    string     `json:"username"`
	Elo         int16      `json:"elo"`
	Nationality int64      `json:"nationality"`
	Wins        int16      `json:"wins"`
	Losses      int16      `json:"losses"`
	UserId      string     `json:"user_id"`
}

type MatchPlayer struct {
	ID        *int64       `json:"id,omitempty"`
	CreatedAt *time.Time   `json:"created_at,omitempty"`
	IDPlayer  int64        `json:"idPlayer"`
	IDMatch   int64        `json:"idMatch"`
	Score     int64        `json:"score"`
	EloOld    int16        `json:"eloOld"`
	EloNew    int16        `json:"eloNew"`
	IsTeam1   bool         `json:"isTeam1"`
	IsGk      bool         `json:"isGk"`
	IsWin     bool         `json:"isWin"`
	Status    PlayerStatus `json:"status"`
}

type RegisterMatchRequest struct {
	T1GK    int64 `json:"t1_gk"`
	T1ST    int64 `json:"t1_st"`
	T2GK    int64 `json:"t2_gk"`
	T2ST    int64 `json:"t2_st"`
	T1Score int16 `json:"t1_score"`
	T2Score int16 `json:"t2_score"`
}

type SupabaseWebhook struct {
	Type      string `json:"type"`
	Table     string `json:"table"`
	Record    Match  `json:"record"`
	OldRecord Match  `json:"old_record"`
}

type MatchDetailDTO struct {
	ID        int64            `json:"id"`
	CreatedAt time.Time        `json:"created_at"`
	T1Score   int16            `json:"t1_score"`
	T2Score   int16            `json:"t2_score"`
	Status    MatchStatus      `json:"status"`
	Players   []PlayerMatchDTO `json:"players"`
}

type PlayerMatchDTO struct {
	PlayerID    int64        `json:"player_id"`
	Username    string       `json:"username"`
	Nationality int64        `json:"nationality"`
	CurrentElo  int16        `json:"current_elo"`
	Wins        int16        `json:"wins"`
	Losses      int16        `json:"losses"`
	IsTeam1     bool         `json:"is_team1"`
	IsGk        bool         `json:"is_gk"`
	IsWin       bool         `json:"is_win"`
	EloOld      int16        `json:"elo_old"`
	EloNew      int16        `json:"elo_new"`
	Status      PlayerStatus `json:"status"`
}

type TournamentStanding struct {
	Group        string `json:"group"`
	Team         string `json:"team"`
	TeamID       int64  `json:"team_id"`
	Points       int16  `json:"points"`
	Wins         *int16 `json:"wins"`
	Losses       *int16 `json:"losses"`
	GoalsFor     int16  `json:"goals_for"`
	GoalsAgainst int16  `json:"goals_against"`
	GoalDiff     int16  `json:"goal_diff"`
}

type TournamentKnockoutRow struct {
	Stage      string `json:"stage"`
	Slot       int16  `json:"slot"`
	Team1ID    *int64 `json:"team1_id"`
	Team2ID    *int64 `json:"team2_id"`
	Team1Score *int16 `json:"team1_score"`
	Team2Score *int16 `json:"team2_score"`
	Status     string `json:"status"`
	WinnerID   *int64 `json:"winner_id"`
}

type TournamentKnockoutMatch struct {
	Stage      string  `json:"stage"`
	Slot       int16   `json:"slot"`
	Team1      *string `json:"team1"`
	Team2      *string `json:"team2"`
	Team1Score *int16  `json:"team1_score"`
	Team2Score *int16  `json:"team2_score"`
	Status     string  `json:"status"`
	WinnerID   *int64  `json:"winner_id"`
}

type TournamentTeam struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}
