package elo

import "math"

// GetEloDelta returns the rating change for one player (or team) after a match.
//
// elo and opponentElo are the ratings going into the match (for 2v2 the team
// rating, see TeamElo). matchNumber is how many matches the player has already
// played. score and opponentScore are the final goals.
//
// Rules:
//   - The result is K × (actual − expected), rounded to the nearest point.
//   - A winner never loses ELO and a loser never gains ELO. A narrow win over a
//     much weaker opponent is simply worth 0.
func GetEloDelta(elo int16, opponentElo int16, matchNumber int, score int, opponentScore int) int16 {
	k := float64(getK(matchNumber))
	actualScore := getActualScore(score, opponentScore)
	expectedScore := getOddsToWin(elo, opponentElo)

	eloDelta := int16(math.Round(k * (actualScore - expectedScore)))
	if score > opponentScore && eloDelta < 0 {
		eloDelta = 0
	}
	if score < opponentScore && eloDelta > 0 {
		eloDelta = 0
	}
	return eloDelta
}

// TeamElo is the rating of a team: the plain average of its players, rounded
// to the nearest point. In foosball both players contribute (attack/defense),
// so the average is a fair estimate of the team's strength.
func TeamElo(ratings ...int16) int16 {
	if len(ratings) == 0 {
		return 0
	}
	sum := 0
	for _, r := range ratings {
		sum += int(r)
	}
	return int16(math.Round(float64(sum) / float64(len(ratings))))
}

// MAX_GOAL_DIFF is the largest goal difference that is weighted (games go to 10).
const MAX_GOAL_DIFF = 10

// Weighted score of the winner by goal difference: a 1-goal win is worth 0.55
// and every extra goal adds 0.05, up to 1.0 for a 10-0 win.
func winnerScore(goalDiff int) float64 {
	if goalDiff > MAX_GOAL_DIFF {
		goalDiff = MAX_GOAL_DIFF
	}
	return 0.5 + 0.05*float64(goalDiff)
}

const DRAW_ACTUAL_SCORE float64 = 0.5

// Since in foosball a 10-0 win is different from a 10-9 win
// here we get the actual score as a weighted win.
// That means that 10-9 is close to a draw in chess: the winner gains little,
// and a heavy favourite who only wins 10-9 gains nothing (but never loses).
func getActualScore(score int, opponentScore int) float64 {
	switch {
	case score == opponentScore:
		return DRAW_ACTUAL_SCORE
	case score > opponentScore:
		return winnerScore(score - opponentScore)
	default:
		return 1 - winnerScore(opponentScore-score)
	}
}

// From the original design of the ELO system
// a difference of 400 in elo results in 10:1 odd to win
const ELO_SCALING_FACTOR = 400.0

func getOddsToWin(elo int16, opponentElo int16) float64 {
	ratingDiff := float64(opponentElo) - float64(elo)
	return 1 / (1 + math.Pow(10, ratingDiff/ELO_SCALING_FACTOR))
}

const (
	BASE_K                = 24
	PROVISIONAL_K         = 48
	DEVELOPING_K          = 32
	PROVISIONAL_THRESHOLD = 10 // First 10 matches are provisional
	ESTABLISHED_THRESHOLD = 25 // After 25 matches the player is established
)

// For the first matches elo changes at a fast pace
func getK(matchNumber int) int {
	switch {
	case matchNumber < PROVISIONAL_THRESHOLD:
		return PROVISIONAL_K
	case matchNumber < ESTABLISHED_THRESHOLD:
		return DEVELOPING_K
	default:
		return BASE_K
	}
}
