package elo

import (
	"fmt"
	"strings"
	"testing"
)

// This test is designed to understand ELO behavior across different scenarios
// It's not a traditional unit test but a visualization tool for ELO changes
func TestEloBehaviorVisualization(t *testing.T) {
	fmt.Println("\n" + strings.Repeat("=", 100))
	fmt.Println("ELO BEHAVIOR ANALYSIS - Understanding rating changes across different scenarios")
	fmt.Println(strings.Repeat("=", 100) + "\n")

	scenarios := []struct {
		playerElo   int16
		opponentElo int16
	}{
		{1200, 1200}, // Equal skill
		{1200, 1150}, // Slight advantage
		{1200, 1100}, // Moderate advantage
		{1200, 1000}, // Strong advantage
		{1200, 800},  // Very strong advantage
	}

	scoreResults := []struct {
		score         int
		opponentScore int
		description   string
	}{
		{10, 0, "Complete Destruction"},
		{10, 3, "Dominant Win"},
		{10, 5, "Good Win"},
		{10, 7, "Close Win"},
		{10, 9, "Tight Win"},
	}

	// Test for beginners (first few matches)
	fmt.Println("\n" + "┏" + strings.Repeat("━", 98) + "┓")
	fmt.Println("┃" + center("BEGINNERS (First 15 Matches) - Higher K-factor means faster ELO changes", 98) + "┃")
	fmt.Println("┗" + strings.Repeat("━", 98) + "┛\n")

	for _, scenario := range scenarios {
		fmt.Printf("\n╔═══════════════════════════════════════════════════════════════════════════════════════════════╗\n")
		fmt.Printf("║  Player ELO: %d  vs  Opponent ELO: %d  (Difference: %+d)                                      %s\n",
			scenario.playerElo, scenario.opponentElo, scenario.playerElo-scenario.opponentElo, getSpacing(scenario.playerElo-scenario.opponentElo))
		fmt.Printf("╚═══════════════════════════════════════════════════════════════════════════════════════════════╝\n")

		fmt.Println("\n  Match #1 (K=64) - Provisional Player")
		fmt.Println("  " + strings.Repeat("─", 90))
		printHeader()

		for _, result := range scoreResults {
			// Player wins
			delta := GetEloDelta(scenario.playerElo, scenario.opponentElo, 1, result.score, result.opponentScore)
			newElo := scenario.playerElo + delta
			fmt.Printf("  WIN   %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.score, result.opponentScore, result.description, delta, newElo, scenario.playerElo)

			// Player loses
			delta = GetEloDelta(scenario.playerElo, scenario.opponentElo, 1, result.opponentScore, result.score)
			newElo = scenario.playerElo + delta
			fmt.Printf("  LOSS  %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.opponentScore, result.score, result.description, delta, newElo, scenario.playerElo)
		}

		fmt.Println("\n  Match #7 (K=48) - Developing Player")
		fmt.Println("  " + strings.Repeat("─", 90))
		printHeader()

		for _, result := range scoreResults {
			// Player wins
			delta := GetEloDelta(scenario.playerElo, scenario.opponentElo, 7, result.score, result.opponentScore)
			newElo := scenario.playerElo + delta
			fmt.Printf("  WIN   %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.score, result.opponentScore, result.description, delta, newElo, scenario.playerElo)

			// Player loses
			delta = GetEloDelta(scenario.playerElo, scenario.opponentElo, 7, result.opponentScore, result.score)
			newElo = scenario.playerElo + delta
			fmt.Printf("  LOSS  %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.opponentScore, result.score, result.description, delta, newElo, scenario.playerElo)
		}

		fmt.Println("\n  Match #15 (K=32) - Transitioning to Established")
		fmt.Println("  " + strings.Repeat("─", 90))
		printHeader()

		for _, result := range scoreResults {
			// Player wins
			delta := GetEloDelta(scenario.playerElo, scenario.opponentElo, 15, result.score, result.opponentScore)
			newElo := scenario.playerElo + delta
			fmt.Printf("  WIN   %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.score, result.opponentScore, result.description, delta, newElo, scenario.playerElo)

			// Player loses
			delta = GetEloDelta(scenario.playerElo, scenario.opponentElo, 15, result.opponentScore, result.score)
			newElo = scenario.playerElo + delta
			fmt.Printf("  LOSS  %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.opponentScore, result.score, result.description, delta, newElo, scenario.playerElo)
		}

		fmt.Println()
	}

	// Test for established players
	fmt.Println("\n" + "┏" + strings.Repeat("━", 98) + "┓")
	fmt.Println("┃" + center("ESTABLISHED PLAYERS (Match 16+) - Lower K-factor means slower, stable ELO changes", 98) + "┃")
	fmt.Println("┗" + strings.Repeat("━", 98) + "┛\n")

	establishedScenarios := []struct {
		playerElo   int16
		opponentElo int16
	}{
		{1600, 1600}, // Equal skill - higher level
		{1600, 1550}, // Slight advantage
		{1600, 1500}, // Moderate advantage
		{1600, 1400}, // Strong advantage
		{1600, 1200}, // Very strong advantage
		{2000, 2000}, // Equal skill - elite level
		{2000, 1900}, // Slight advantage - elite
		{2000, 1800}, // Moderate advantage - elite
		{2000, 1600}, // Strong advantage - elite
		{2000, 1400}, // Very strong advantage - elite
	}

	for _, scenario := range establishedScenarios {
		fmt.Printf("\n╔═══════════════════════════════════════════════════════════════════════════════════════════════╗\n")
		fmt.Printf("║  Player ELO: %d  vs  Opponent ELO: %d  (Difference: %+d)                                     %s\n",
			scenario.playerElo, scenario.opponentElo, scenario.playerElo-scenario.opponentElo, getSpacing(scenario.playerElo-scenario.opponentElo))
		fmt.Printf("╚═══════════════════════════════════════════════════════════════════════════════════════════════╝\n")

		fmt.Println("\n  Match #20 (K=32) - Established Player")
		fmt.Println("  " + strings.Repeat("─", 90))
		printHeader()

		for _, result := range scoreResults {
			// Player wins
			delta := GetEloDelta(scenario.playerElo, scenario.opponentElo, 20, result.score, result.opponentScore)
			newElo := scenario.playerElo + delta
			fmt.Printf("  WIN   %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.score, result.opponentScore, result.description, delta, newElo, scenario.playerElo)

			// Player loses
			delta = GetEloDelta(scenario.playerElo, scenario.opponentElo, 20, result.opponentScore, result.score)
			newElo = scenario.playerElo + delta
			fmt.Printf("  LOSS  %2d-%-2d  %-22s  %+4d  →  %4d  (from %4d)\n",
				result.opponentScore, result.score, result.description, delta, newElo, scenario.playerElo)
		}

		fmt.Println()
	}

	// Key insights section
	fmt.Println("\n" + "┏" + strings.Repeat("━", 98) + "┓")
	fmt.Println("┃" + center("KEY INSIGHTS", 98) + "┃")
	fmt.Println("┗" + strings.Repeat("━", 98) + "┛\n")

	fmt.Println("  📊 K-Factor Evolution:")
	fmt.Println("     • Matches 1-6   (K=64): Fast rating changes for new players")
	fmt.Println("     • Matches 7-14  (K=48): Moderate rating changes for developing players")
	fmt.Println("     • Matches 15+   (K=32): Stable rating changes for established players")
	fmt.Println()
	fmt.Println("  🎯 Score Margin Impact:")
	fmt.Println("     • 10-0, 10-9: Complete dominance (weighted score: 1.0)")
	fmt.Println("     • 10-3:      Dominant win (weighted score: 0.65)")
	fmt.Println("     • 10-5:      Good win (weighted score: 0.8)")
	fmt.Println("     • 10-7:      Close win (weighted score: 0.9)")
	fmt.Println("     • 10-9:      Tight win (weighted score: 1.0)")
	fmt.Println()
	fmt.Println("  ⚠️  Important Notes:")
	fmt.Println("     • Winning against a much weaker opponent narrowly (10-9) can result in ELO loss!")
	fmt.Println("     • The ELO delta is 0 if you win but the expected outcome suggests you should lose rating")
	fmt.Println("     • Larger rating differences mean bigger swings when the underdog performs well")
	fmt.Println()

	fmt.Println(strings.Repeat("=", 100))
	fmt.Println("END OF ELO BEHAVIOR ANALYSIS")
	fmt.Println(strings.Repeat("=", 100) + "\n")
}

func printHeader() {
	fmt.Printf("  %-6s %-6s %-22s %-7s %-16s\n", "Result", "Score", "Description", "Change", "New ELO")
	fmt.Println("  " + strings.Repeat("─", 90))
}

func center(s string, width int) string {
	if len(s) >= width {
		return s
	}
	leftPad := (width - len(s)) / 2
	rightPad := width - len(s) - leftPad
	return fmt.Sprintf("%*s%s%*s", leftPad, "", s, rightPad, "")
}

func getSpacing(diff int16) string {
	// Helper to align the output based on difference length
	if diff >= 0 && diff < 10 {
		return "║"
	} else if (diff >= 10 && diff < 100) || (diff < 0 && diff > -10) {
		return "║"
	} else if (diff >= 100 && diff < 1000) || (diff <= -10 && diff > -100) {
		return "║"
	}
	return "║"
}
