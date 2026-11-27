package elo

import "math"

// GetEloDelta returns the rating change for a side (a player in 1v1, a team
// rating in 2v2) that scored `score` against an opponent that scored
// `opponentScore`. Ratings are the side's rating and the opponent's rating.
//
// The result of the match decides the direction of the change: a winner never
// loses ELO and a loser never gains ELO. The margin of victory and the
// rating gap only decide how big the change is.
func GetEloDelta(elo int16, opponentElo int16, matchNumber int, score int, opponentScore int) int16 {
	k := getK(matchNumber)
	actualScore := getActualScore(score, opponentScore)
	expectedScore := getOddsToWin(elo, opponentElo)

	eloDelta := k * (actualScore - expectedScore)
	switch {
	case score > opponentScore:
		eloDelta = math.Max(eloDelta, 0)
	case score < opponentScore:
		eloDelta = math.Min(eloDelta, 0)
	}
	return int16(math.Round(eloDelta))
}

// TeamElo is the rating used for a 2-player team. It is the plain average of
// the two players (rounded down, like the integer ratings it is built from).
func TeamElo(a int16, b int16) int16 {
	return int16((int(a) + int(b)) / 2)
}

const (
	// A 1-goal win is worth this much of a full win.
	MIN_WIN_SCORE = 0.75
	// Winning by the maximum margin counts as a full win.
	MAX_GOAL_DIFF = 10
)

// Since in foosball a 10-0 win is different from a 10-9 win
// the actual score of the winner grows linearly with the goal difference,
// from MIN_WIN_SCORE (1 goal) to 1 (10 goals). The loser gets the complement.
// So a 10-9 win is worth less than a 10-0 win, but is still a win.
func getActualScore(score int, opponentScore int) float64 {
	if score == opponentScore {
		return 0.5
	}
	diff := score - opponentScore
	if diff < 0 {
		diff = -diff
	}
	if diff > MAX_GOAL_DIFF {
		diff = MAX_GOAL_DIFF
	}
	winnerScore := MIN_WIN_SCORE + (1-MIN_WIN_SCORE)*float64(diff-1)/float64(MAX_GOAL_DIFF-1)
	if score > opponentScore {
		return winnerScore
	}
	return 1 - winnerScore
}

// From the original design of the ELO system
// a difference of 400 in elo results in 10:1 odd to win
const ELO_SCALING_FACTOR = 400.0

func getOddsToWin(elo int16, opponentElo int16) float64 {
	ratingDiff := float64(int(opponentElo) - int(elo))
	return 1 / (1 + math.Pow(10, ratingDiff/ELO_SCALING_FACTOR))
}

const (
	BASE_K                = 32
	PROVISIONAL_THRESHOLD = 7  // First 7 matches are provisional
	ESTABLISHED_THRESHOLD = 15 // After 15 matches the player is established
)

// For the first matches elo changes at a fast pace
func getK(matchNumber int) float64 {
	switch {
	case matchNumber < PROVISIONAL_THRESHOLD:
		return BASE_K * 1.5
	case matchNumber < ESTABLISHED_THRESHOLD:
		return BASE_K * 1.25
	default:
		return BASE_K
	}
}
