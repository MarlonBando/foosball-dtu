package elo

import (
	"math"
	"testing"
)

func TestExpectedScoreUsesFloatDivision(t *testing.T) {
	cases := []struct {
		elo, opp int16
		want     float64
	}{
		{1200, 1200, 0.5},
		{1300, 1200, 0.640}, // 100 gap must not be 50/50
		{1400, 1200, 0.760},
		{1600, 1200, 0.909},
		{1200, 1400, 0.240},
	}
	for _, c := range cases {
		if got := getOddsToWin(c.elo, c.opp); math.Abs(got-c.want) > 0.001 {
			t.Errorf("odds(%d vs %d) = %.3f, want %.3f", c.elo, c.opp, got, c.want)
		}
	}
}

func TestExpectedScoresSumToOne(t *testing.T) {
	if s := getOddsToWin(1500, 1230) + getOddsToWin(1230, 1500); math.Abs(s-1) > 1e-9 {
		t.Errorf("odds sum = %f", s)
	}
}

func TestWinnerNeverLosesAndLoserNeverGains(t *testing.T) {
	for _, gap := range []int16{-800, -300, -50, 0, 50, 300, 800} {
		for m := 0; m < 30; m += 5 {
			for w := 1; w <= 10; w++ {
				if d := GetEloDelta(1500+gap, 1500, m, w, 0); d < 0 {
					t.Errorf("winner lost %d (gap %d, margin %d)", d, gap, w)
				}
				if d := GetEloDelta(1500+gap, 1500, m, 0, w); d > 0 {
					t.Errorf("loser gained %d (gap %d, margin %d)", d, gap, w)
				}
			}
		}
	}
}

func TestUpsetPaysMoreThanExpectedWin(t *testing.T) {
	upset := GetEloDelta(1000, 1400, 20, 10, 5)
	expected := GetEloDelta(1400, 1000, 20, 10, 5)
	if upset <= expected*3 {
		t.Errorf("upset %d should pay far more than expected win %d", upset, expected)
	}
	if lossFav, lossDog := GetEloDelta(1400, 1000, 20, 5, 10), GetEloDelta(1000, 1400, 20, 5, 10); lossFav >= lossDog {
		t.Errorf("favourite losing (%d) should cost more than underdog losing (%d)", lossFav, lossDog)
	}
}

func TestBiggerMarginMovesMore(t *testing.T) {
	prev := int16(-1)
	for diff := 1; diff <= 10; diff++ {
		d := GetEloDelta(1200, 1200, 20, diff, 0)
		if d < prev {
			t.Errorf("margin %d gives %d < %d", diff, d, prev)
		}
		prev = d
	}
	if GetEloDelta(1200, 1200, 20, 10, 0) <= GetEloDelta(1200, 1200, 20, 10, 9) {
		t.Error("10-0 should beat 10-9")
	}
}

func TestEqualPlayersAreSymmetric(t *testing.T) {
	w := GetEloDelta(1200, 1200, 20, 10, 6)
	l := GetEloDelta(1200, 1200, 20, 6, 10)
	if w != -l || w <= 0 {
		t.Errorf("winner %d, loser %d", w, l)
	}
}

func TestNewPlayersMoveFaster(t *testing.T) {
	n, e := GetEloDelta(1200, 1200, 0, 10, 5), GetEloDelta(1200, 1200, 30, 10, 5)
	if n <= e {
		t.Errorf("new %d should exceed established %d", n, e)
	}
}

func TestExactValues(t *testing.T) {
	// K=32, even match, 10-0: 32 * (1 - 0.5) = 16
	if d := GetEloDelta(1200, 1200, 20, 10, 0); d != 16 {
		t.Errorf("got %d want 16", d)
	}
	// 1200 vs 1000 (E=0.760), 10-9 win: 32*(0.75-0.76) < 0 -> clamped to 0
	if d := GetEloDelta(1200, 1000, 20, 10, 9); d != 0 {
		t.Errorf("got %d want 0", d)
	}
}

func TestTeamElo(t *testing.T) {
	if got := TeamElo(1500, 900); got != 1200 {
		t.Errorf("got %d", got)
	}
	if got := TeamElo(32000, 32000); got != 32000 {
		t.Errorf("overflow: got %d", got)
	}
}

func TestRatingsConvergeInSeries(t *testing.T) {
	// Equal players where A always wins 10-7: A's lead keeps growing but the
	// per-match gain shrinks as A becomes the favourite.
	a, b := int16(1200), int16(1200)
	first := GetEloDelta(a, b, 20, 10, 7)
	var last int16
	for i := 0; i < 40; i++ {
		last = GetEloDelta(a, b, 20, 10, 7)
		a += last
		b += GetEloDelta(b, a-last, 20, 7, 10)
	}
	if last >= first {
		t.Errorf("gain should shrink: first %d last %d", first, last)
	}
	if a <= b {
		t.Errorf("a=%d b=%d", a, b)
	}
}
