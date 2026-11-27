# Foosball ELO Rating System

A modified ELO system for foosball (1v1 and 2v2, games to 10).

```
delta = round(K × (Actual Score − Expected Score))
```

## Components

### Expected score
Standard ELO: a 400 point gap means 10:1 odds. Computed in floating point.

```
Expected = 1 / (1 + 10^((Opponent − Own) / 400))
```

(Earlier versions used integer division for `gap/400`, so every gap under 400
counted as 50/50.)

### Actual score (margin of victory)
The winner's score is `0.5 + 0.05 × goal difference` (goal difference capped at
10). The loser gets `1 − winner's score`. A draw is 0.5.

| Result | Winner | Loser |
|--------|--------|-------|
| 10-9   | 0.55   | 0.45  |
| 10-7   | 0.65   | 0.35  |
| 10-5   | 0.75   | 0.25  |
| 10-0   | 1.00   | 0.00  |

### K-factor
Based on the number of matches the player has already played:

| Matches played | K  |
|----------------|----|
| 0 - 9          | 48 |
| 10 - 24        | 32 |
| 25+            | 24 |

### Team rating (2v2)
A team's rating is the plain average of its two players (`TeamElo`), rounded.
Every player on a team gets the delta computed from the team ratings and
their own K-factor, so a new player moves faster than an established partner.

### Win protection
A winner never loses ELO and a loser never gains ELO. If the formula says a
winner should lose points (a heavy favourite who only wins narrowly), the delta
is 0 instead; likewise for losers.

## Example

A 2000-rated player beats a 1000-rated player 10-9 (established, K=24):
- Expected ≈ 0.997, Actual = 0.55 → formula gives −11
- Winner protection → **0**. The loser (1000) loses nothing either, rather
  than gaining 11.

An upset: a 1200 player beats a 1600 player 10-5 (K=24):
- Expected ≈ 0.09, Actual = 0.75 → **+16**, and the 1600 player loses 16.

## Tuning notes
Parameters were chosen by simulating 8 players of known strength (1000-1700)
playing random 2v2 matches. K = 48/32/24 gave the best tradeoff: ratings
converged to within ~30 points of true strength with ~1.2 points of movement per
match once settled. Lower K values converged too slowly, K=32 for established
players was noisier with little gain.
