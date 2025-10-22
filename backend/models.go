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
	Name        string     `json:"name"`
	Surname     string     `json:"surname"`
	Nationality int64      `json:"nationality"`
	Wins        int16      `json:"wins"`
	Losses      int16      `json:"losses"`
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

type SupabaseWebhook struct {
	Type      string `json:"type"`
	Table     string `json:"table"`
	Record    Match  `json:"record"`
	OldRecord Match  `json:"old_record"`
}
