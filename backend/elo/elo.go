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
	10: 1,    //Complete dominance
	9:  1,    //Complete dominance
	8:  0.95, // Dominance
	7:  0.9,  // Easy win
	6:  0.85, // Strong win
	5:  0.8,  // Good win
	4:  0.7,  // Solid win
	3:  0.65, // Decent win
	2:  0.6,  // Close win
	1:  0.55, // Tight win
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

func getK(matchNumber int) int {
	var k int
	if matchNumber < 5 {
		k = 40 - matchNumber
	} else if matchNumber < 10 {
		k = 32 - (matchNumber - 5)
	} else {
		k = 24
	}
	return k
}
