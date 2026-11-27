# Foosball ELO Rating System

A modified ELO system for foosball (1v1 and 2v2). Code: `elo.go`, tests: `elo_test.go`.

```
New ELO = Current ELO + K × (Actual Score − Expected Score)
```

## Expected score

Standard ELO, using real (floating point) division: a 400 point gap means 10:1 odds.

```
Expected = 1 / (1 + 10^((Opponent ELO − Your ELO) / 400))
```

| Gap | Favourite's expected score |
|-----|----------------------------|
| 0   | 0.50 |
| 100 | 0.64 |
| 200 | 0.76 |
| 400 | 0.91 |
| 800 | 0.99 |

## Actual score (margin of victory)

The winner's actual score grows linearly with the goal difference, from 0.75
(1 goal, e.g. 10-9) to 1.00 (10 goals, 10-0). The loser gets `1 − winner's score`.
Draws count as 0.5.

## Win/loss direction rule

The result decides the direction of the change: **a winner never loses ELO and a
loser never gains ELO**. If the formula would give a winner a negative change
(a big favourite winning narrowly), it is set to 0; likewise for a loser with a
positive change. Margin and rating gap only decide the size of the change.
Changes are rounded to the nearest integer.

## K-factor

Depends on the number of matches the player has played:

| Matches played | K |
|----------------|---|
| 0–6 (provisional) | 48 |
| 7–14 | 40 |
| 15+ (established) | 32 |

## Teams (2v2)

A team's rating is the plain average of its two players (`TeamElo`). Each player
on a team receives the change computed from the team ratings, using the player's
own K. Simulations with skill modelled as the average or as a 65/35 mix favouring
the stronger player showed a stronger-weighted average gave no meaningful accuracy
gain, so the simple average is kept.

## Examples (K = 32, established player)

| Situation | Change |
|-----------|--------|
| Equal ratings, win 10-0 | +16 |
| Equal ratings, win 10-9 | +8 |
| Favourite by 100 wins 10-9 | +4 |
| Favourite by 200 wins 10-9 | 0 (win protection) |
| Underdog by 200 loses 0-10 | −8 |
| Underdog by 200 loses 9-10 | 0 |
