# Elo Rating System

## Basic Formula

**New Rating = Old Rating + K × (Actual Score - Expected Score)**

### Components

- **K-factor**: Determines how much ratings change per game (typically 16-32)
- **Actual Score**: 
  - 1 for win
  - 0.5 for draw
  - 0 for loss
- **Expected Score**: Probability of winning, calculated as:

```
Expected Score = 1 / (1 + 10^((Opponent Rating - Your Rating) / 400))
```

### The 400 Scaling Factor

The value **400** is a scaling constant from Elo's original design:
- **400-point difference** = 10:1 odds (≈90.9% win probability)
- **200-point difference** = ≈76% win probability
- **0-point difference** = 50% win probability

This value was chosen empirically to match chess game outcomes and create intuitive skill classes.

## Example Calculation

Player A (1600) beats Player B (1400), K = 32

**Expected Score for A:**
```
EA = 1 / (1 + 10^((1400-1600)/400))
   = 1 / (1 + 10^(-0.5))
   = 1 / (1 + 0.316)
   ≈ 0.76
```

**New Rating for A:**
```
New Rating = 1600 + 32 × (1 - 0.76)
           = 1600 + 7.68
           = 1608
```

**New Rating for B:**
```
New Rating = 1400 + 32 × (0 - 0.24)
           = 1400 - 7.68
           = 1392
```

*Note: Ratings always sum to the same total (gained points = lost points)*

## Implementation for New Players

### Hybrid Approach (Recommended)

Combine initial rating based on experience with dynamic K-factor adjustment.

#### 1. Initial Ratings by Experience Level

```javascript
const INITIAL_RATINGS = {
  beginner: 1000,
  decent: 1200,
  average: 1400,
  good: 1600,
  pro: 1800
};
```

#### 2. Dynamic K-Factor Based on Games Played

```javascript
function getKFactor(gamesPlayed) {
  if (gamesPlayed < 10) return 60;      // Very fast adjustment
  if (gamesPlayed < 30) return 40;      // Fast adjustment
  if (gamesPlayed < 50) return 32;      // Moderate adjustment
  return 24;                             // Normal adjustment
}
```

### Benefits

- **Faster convergence**: High K-factor allows new players to reach their true skill level quickly
- **Better starting point**: Experience-based initial ratings prevent extreme mismatches
- **Self-correction**: If players over/underestimate their skill, the system adjusts rapidly
- **Anti-smurfing**: Good players can't easily exploit the system by starting at beginner level
- **Stability**: Ratings stabilize after ~30-50 games

## Provisional Rating Period

| Games Played | K-Factor | Adjustment Speed |
|-------------|----------|------------------|
| 0-10        | 60       | Very fast        |
| 10-30       | 40       | Fast             |
| 30-50       | 32       | Moderate         |
| 50+         | 24       | Normal           |

