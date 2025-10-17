package main

import "time"

type Nationality struct {
	Id   int64  `json:"id"`
	Code string `json:"code"`
	Name string `json:"name"`
}

type Match struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	T1GK      int64     `json:"t1_gk"`
	T1ST      int64     `json:"t1_st"`
	T2GK      int64     `json:"t2_gk"`
	T2ST      int64     `json:"t2_st"`
	Table     int64     `json:"table"`
	T1Score   int16     `json:"t1_score"`
	T2Score   int16     `json:"t2_score"`
	T1GKScore int16     `json:"t1_gk_score"`
	T1STScore int16     `json:"t1_st_score"`
	T2GKScore int16     `json:"t2_gk_score"`
	T2STScore int16     `json:"t2_st_score"`
}

type Player struct {
	ID          int64     `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	Username    string    `json:"username"`
	Elo         int16     `json:"elo"`
	Name        string    `json:"name"`
	Surname     string    `json:"surname"`
	Nationality int64     `json:"nationality"`
}
