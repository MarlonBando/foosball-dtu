# Foosball ELO Rating System

This package implements a modified ELO rating system specifically designed for foosball matches.

## How ELO is Calculated

The rating change follows the standard ELO formula:

```
New ELO = Current ELO + K × (Actual Score - Expected Score)
```

### Key Components

#### 1. **K-Factor** (Match Volatility)
The K-factor determines how much ratings can change per match and decreases as players complete more matches:

- **Matches 1-4**: K = 40, 39, 38, 37 (high volatility for new players)
- **Matches 5-9**: K = 27-31 (medium volatility)
- **Match 10+**: K = 24 (stable ratings for established players)

#### 2. **Expected Score**
Based on rating difference, following the original ELO design where a 400-point difference equals 10:1 odds:

```
Expected Score = 1 / (1 + 10^((Opponent ELO - Your ELO) / 400))
```

#### 3. **Actual Score** (Weighted by Goal Difference)
Unlike traditional ELO where wins are binary (1.0 or 0.0), foosball scores are weighted by margin of victory:

| Goal Difference | Winner's Score | Description |
|-----------------|----------------|-------------|
| 10 | 1.00 | Complete dominance |
| 9 | 1.00 | Complete dominance |
| 8 | 0.95 | Dominance |
| 7 | 0.90 | Easy win |
| 6 | 0.85 | Strong win |
| 5 | 0.80 | Good win |
| 4 | 0.70 | Solid win |
| 3 | 0.65 | Decent win |
| 2 | 0.60 | Close win |
| 1 | 0.55 | Tight win |

**The loser's score is**: `1 - winner's score`

### Win Protection Rule

**Important**: You can never lose ELO from winning a match.

If the calculation would result in negative ELO change for a winner, it's set to 0 instead.

This means:
- Dominant wins give you lots of points
- Close wins give you few or zero points
- But you never lose points for winning

### Example

A 2000-rated player beats a 1000-rated player 10-9:
- **Expected Score**: ~0.99 (heavily favored)
- **Actual Score**: 0.55 (tight win)
- **K-factor**: 24 (assuming 10+ matches)
- **Calculated Change**: 24 × (0.55 - 0.99) = **-10.56**
- **Actual Change**: **0 points** (protected by win rule)

The higher-rated player gains nothing, but doesn't lose ELO either.

## Key Differences from Standard ELO

1. **Margin of victory matters**: A 10-0 win is worth more than a 10-9 win
2. **Win protection**: You never lose ELO from winning (minimum 0 gain)
3. **Losses can be rewarding**: Losing 9-10 against a much stronger opponent gives you ELO
4. **Dynamic K-factor**: New players' ratings adjust faster to reach their true level
