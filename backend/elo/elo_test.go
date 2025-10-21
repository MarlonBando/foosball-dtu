package elo

import "testing"
import "fmt"

// func GetNewElo(elo int16, opponentElo int16, matchNumber int, score int, opponentScore int) int16 {
// 	k := float64(getK(matchNumber))
// 	actualScore := getActualScore(score, opponentScore)
// 	expectedScore := getOddsToWin(elo, opponentElo)
//
// 	return elo + int16(k*(actualScore-expectedScore))
// }

func TestElo(t *testing.T) {
	var elo int16 = 1800
	var opponentElo int16 = 1780
	matchNumber := 1
	score := 10
	opponentScore := 8

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestEqualPlayersCloseLoss(t *testing.T) {
	var elo int16 = 1500
	var opponentElo int16 = 1500
	matchNumber := 10
	score := 9
	opponentScore := 10

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nEqual players, close loss (10th match):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestHighRatedBarelyWins(t *testing.T) {
	var elo int16 = 2000
	var opponentElo int16 = 1200
	matchNumber := 15
	score := 10
	opponentScore := 9

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nHigh rated (2000) barely wins against low rated (1200):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestHighRatedDominates(t *testing.T) {
	var elo int16 = 2000
	var opponentElo int16 = 1200
	matchNumber := 15
	score := 10
	opponentScore := 0

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nHigh rated (2000) dominates low rated (1200):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestUnderdogUpset(t *testing.T) {
	var elo int16 = 1200
	var opponentElo int16 = 2000
	matchNumber := 10
	score := 10
	opponentScore := 4

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nUnderdog (1200) upsets favorite (2000):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestFirstMatchHighVolatility(t *testing.T) {
	var elo int16 = 1500
	var opponentElo int16 = 1500
	matchNumber := 1
	score := 10
	opponentScore := 5

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nFirst match (high K-factor):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestExperiencedPlayersSmallGains(t *testing.T) {
	var elo int16 = 1800
	var opponentElo int16 = 1750
	matchNumber := 50
	score := 10
	opponentScore := 6

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nExperienced players (50th match, low K-factor):\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}

func TestVeryCloseMatch(t *testing.T) {
	var elo int16 = 1600
	var opponentElo int16 = 1600
	matchNumber := 10
	score := 10
	opponentScore := 8

	newElo := GetNewElo(elo, opponentElo, matchNumber, score, opponentScore)
	opponentNewElo := GetNewElo(opponentElo, elo, matchNumber, opponentScore, score)

	fmt.Printf("\nVery close match between equal players:\n")
	fmt.Printf("%d vs %d -> %d - %d\n", elo, opponentElo, score, opponentScore)
	fmt.Printf("%d -> %d (%d)\n", elo, newElo, newElo-elo)
	fmt.Printf("%d -> %d (%d)\n", opponentElo, opponentNewElo, opponentNewElo-opponentElo)
}
