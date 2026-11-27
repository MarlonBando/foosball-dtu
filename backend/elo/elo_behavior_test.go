package elo

import (
	"math"
	"testing"
)

func TestExpectedScoreUsesFractionalGap(t *testing.T) {
	if got := getOddsToWin(1200, 1200); math.Abs(got-0.5) > 1e-9 {
		t.Fatalf("equal ratings: want 0.5, got %v", got)
	}
	// Regression: integer division made every gap under 400 a 50/50.
	if got := getOddsToWin(1300, 1200); got < 0.63 || got > 0.65 {
		t.Fatalf("+100 gap: want ~0.64, got %v", got)
	}
	if got := getOddsToWin(1600, 1200); math.Abs(got-10.0/11) > 1e-9 {
		t.Fatalf("+400 gap: want 10:1 odds, got %v", got)
	}
	// Extreme gaps must not overflow int16.
	if got := getOddsToWin(-3000, 30000); got < 0 || got > 1e-9 {
		t.Fatalf("extreme gap: got %v", got)
	}
}

func TestActualScore(t *testing.T) {
	cases := []struct {
		s, o int
		want float64
	}{
		{10, 9, 0.55}, {10, 5, 0.75}, {10, 0, 1.0},
		{9, 10, 0.45}, {0, 10, 0.0}, {5, 5, 0.5}, {15, 0, 1.0},
	}
	for _, c := range cases {
		if got := getActualScore(c.s, c.o); math.Abs(got-c.want) > 1e-9 {
			t.Errorf("%d-%d: want %v, got %v", c.s, c.o, c.want, got)
		}
	}
}

func TestUnderdogGainsMoreThanFavourite(t *testing.T) {
	upset := GetEloDelta(1200, 1600, 30, 10, 5)
	expected := GetEloDelta(1600, 1200, 30, 10, 5)
	if upset <= expected || upset < 15 {
		t.Fatalf("upset %d should be much larger than expected win %d", upset, expected)
	}
	even := GetEloDelta(1200, 1200, 30, 10, 5)
	if GetEloDelta(1400, 1200, 30, 10, 5) >= even {
		t.Fatalf("a 200 point favourite should gain less than an equal player")
	}
}

func TestWinnerNeverLosesAndLoserNeverGains(t *testing.T) {
	for _, gap := range []int16{-800, -400, -100, 0, 100, 400, 800} {
		for w := 1; w <= 10; w++ {
			if d := GetEloDelta(1500+gap, 1500, 30, 10, 10-w); d < 0 {
				t.Errorf("winner lost %d (gap %d, score 10-%d)", d, gap, 10-w)
			}
			if d := GetEloDelta(1500+gap, 1500, 30, 10-w, 10); d > 0 {
				t.Errorf("loser gained %d (gap %d, score %d-10)", d, gap, 10-w)
			}
		}
	}
	// Narrow win by a huge favourite is worth nothing, not negative.
	if d := GetEloDelta(2000, 1000, 30, 10, 9); d != 0 {
		t.Fatalf("want 0, got %d", d)
	}
}

func TestMarginOfVictoryMatters(t *testing.T) {
	if GetEloDelta(1200, 1200, 30, 10, 0) <= GetEloDelta(1200, 1200, 30, 10, 9) {
		t.Fatal("10-0 must be worth more than 10-9")
	}
}

func TestDrawBetweenEqualsIsZero(t *testing.T) {
	if d := GetEloDelta(1200, 1200, 5, 5, 5); d != 0 {
		t.Fatalf("want 0, got %d", d)
	}
}

func TestEvenMatchIsRoughlyZeroSum(t *testing.T) {
	w := GetEloDelta(1200, 1200, 30, 10, 6)
	l := GetEloDelta(1200, 1200, 30, 6, 10)
	if w != -l || w <= 0 {
		t.Fatalf("winner %d loser %d", w, l)
	}
}

func TestKFactorDecreases(t *testing.T) {
	if !(getK(0) > getK(PROVISIONAL_THRESHOLD) && getK(PROVISIONAL_THRESHOLD) > getK(ESTABLISHED_THRESHOLD)) {
		t.Fatal("K should decrease with experience")
	}
	if getK(ESTABLISHED_THRESHOLD+100) != BASE_K {
		t.Fatal("established K should be BASE_K")
	}
}

func TestTeamElo(t *testing.T) {
	if got := TeamElo(1000, 1500); got != 1250 {
		t.Fatalf("want 1250, got %d", got)
	}
	if got := TeamElo(1001, 1002); got != 1002 {
		t.Fatalf("want rounded 1002, got %d", got)
	}
	if TeamElo() != 0 {
		t.Fatal("empty team")
	}
}

// A long series between the same two players converges to a stable gap
// instead of running away.
func TestRepeatedMatchesConverge(t *testing.T) {
	a, b := int16(1200), int16(1200)
	var na, nb int
	// A wins ~75% of the time with a 10-6 score; B wins 10-6 otherwise.
	for i := 0; i < 400; i++ {
		var da, db int16
		if i%4 != 3 {
			da, db = GetEloDelta(a, b, na, 10, 6), GetEloDelta(b, a, nb, 6, 10)
		} else {
			da, db = GetEloDelta(a, b, na, 6, 10), GetEloDelta(b, a, nb, 10, 6)
		}
		a, b = a+da, b+db
		na++
		nb++
	}
	if gap := a - b; gap < 30 || gap > 200 {
		t.Fatalf("gap %d should settle to a sensible value", gap)
	}
}

// Mixed team (strong + weak) against two average players is rated as average.
func TestMixedTeamAgainstAverage(t *testing.T) {
	mixed := TeamElo(1600, 1000)
	avg := TeamElo(1300, 1300)
	if mixed != avg {
		t.Fatal("expected equal team ratings")
	}
	if d := GetEloDelta(mixed, avg, 30, 10, 8); d <= 0 {
		t.Fatalf("want positive, got %d", d)
	}
}
