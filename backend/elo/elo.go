package elo

import "math"

func GetEloDelta(elo int16, opponentElo int16, matchNumber int, score int, opponentScore int) int16 {
	k := float64(getK(matchNumber))
	actualScore := getActualScore(score, opponentScore)
	expectedScore := getOddsToWin(elo, opponentElo)

	eloDelta := int16(k * (actualScore - expectedScore))
	if actualScore > 0.5 && eloDelta < 0 {
		eloDelta = 0
	}
	return eloDelta
}

var weightedScore = map[int]float64{
	10: 1,    // Complete destruction
	9:  0.9,  // Dominant win
	8:  0.8,  // Strong dominance
	7:  0.75, // Clear win
	6:  0.7,  // Good win
	5:  0.68, // Solid win
	4:  0.66, // Decent win
	3:  0.64, // Close win
	2:  0.62, // Narrow win
	1:  0.6,  // Tight win
}

const DRAW_ACTUAL_SCORE float64 = 0.5

// Since in foosball a 10-0 win is different from a 10-9 win
// Here we get the actual score that is the weighted win.
// That means that 10-9 is similar to a draw in chess.
// And if you are 2000 elo and you face a 1000 elo
// and you win only 10 - 9 you are going to lose elo even if you won
func getActualScore(score int, opponentScore int) float64 {
	winner := score > opponentScore
	var actualScore float64
	if winner {
		actualScore = weightedScore[score-opponentScore]
	} else {
		opponentActualScore := weightedScore[opponentScore-score]
		actualScore = 1 - opponentActualScore
	}

	return actualScore
}

// From the original design of the ELO system
// a difference of 400 in elo results in 10:1 odd to win
const ELO_SCALING_FACTOR = 400

func getOddsToWin(elo int16, opponentElo int16) float64 {
	ratingDiff := int(opponentElo - elo)
	oddsToWin := 1 / (1 + math.Pow10(ratingDiff/ELO_SCALING_FACTOR))
	return oddsToWin
}

const (
	BASE_K                = 32
	PROVISIONAL_THRESHOLD = 7  // First 7 matches are provisional
	ESTABLISHED_THRESHOLD = 15 // After 15 matches the player is established
)

// For the first matches elo changes at a fast pace
func getK(matchNumber int) int {
	switch {
	case matchNumber < PROVISIONAL_THRESHOLD:
		return BASE_K * 1.5
	case matchNumber < ESTABLISHED_THRESHOLD:
		return BASE_K * 1.25
	default:
		// return BASE_K + BASE_K/4
		return BASE_K
	}
}
