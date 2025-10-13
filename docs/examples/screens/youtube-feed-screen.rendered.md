# YouTube Feed Screen

## Rendered Example

```
╔════════════════════════════════════════╗  ╔════════════════════════════════════════╗
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║        DON'T TRY THIS                  ║  ║   Eating HALF Watermelon Candy VS REAL ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                            ┌─────────┐ ║  ║                            ┌─────────┐ ║
║                            │  12:34  │ ║  ║                            │  8:45   │ ║
╚════════════════════════════└─────────┘═╝  ╚════════════════════════════└─────────┘═╝

DON'T TRY THIS                              Eating HALF Watermelon Candy VS REAL

MrBeast ✓                                   Crafty Panda ✓
24M views · 2 days ago                      543K views · 1 day ago


╔════════════════════════════════════════╗  ╔════════════════════════════════════════╗
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║           GENIUS                       ║  ║        JUST FISHING                    ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                            ┌─────────┐ ║  ║                            ┌─────────┐ ║
║                            │  0:59   │ ║  ║                            │  15:23  │ ║
╚════════════════════════════└─────────┘═╝  ╚════════════════════════════└─────────┘═╝

GENIUS                                      JUST FISHING

Shorts Channel                              Fishing Adventures ✓
1.2M views · 3 hours ago                    892K views · 5 days ago


╔════════════════════════════════════════╗  ╔════════════════════════════════════════╗
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║    I Survived 50 Hours In Antarctica   ║  ║      Building The Perfect House       ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                                        ║  ║                                        ║
║                            ┌─────────┐ ║  ║                            ┌─────────┐ ║
║                            │  21:47  │ ║  ║                            │  18:32  │ ║
╚════════════════════════════└─────────┘═╝  ╚════════════════════════════└─────────┘═╝

I Survived 50 Hours In Antarctica          Building The Perfect House

MrBeast ✓                                   Home Improvement Today
35M views · 1 week ago                      2.1M views · 3 days ago
```

## Example Data

### Video 1
- **Title**: DON'T TRY THIS
- **Channel**: MrBeast (verified)
- **Views**: 24M views
- **Published**: 2 days ago
- **Duration**: 12:34

### Video 2
- **Title**: Eating HALF Watermelon Candy VS REAL
- **Channel**: Crafty Panda (verified)
- **Views**: 543K views
- **Published**: 1 day ago
- **Duration**: 8:45

### Video 3
- **Title**: GENIUS
- **Channel**: Shorts Channel
- **Views**: 1.2M views
- **Published**: 3 hours ago
- **Duration**: 0:59

### Video 4
- **Title**: JUST FISHING
- **Channel**: Fishing Adventures (verified)
- **Views**: 892K views
- **Published**: 5 days ago
- **Duration**: 15:23

### Video 5
- **Title**: I Survived 50 Hours In Antarctica
- **Channel**: MrBeast (verified)
- **Views**: 35M views
- **Published**: 1 week ago
- **Duration**: 21:47

### Video 6
- **Title**: Building The Perfect House
- **Channel**: Home Improvement Today
- **Views**: 2.1M views
- **Published**: 3 days ago
- **Duration**: 18:32

## Layout Details

- **Grid**: 2 columns (responsive)
- **Card spacing**: 2 characters horizontal, 3 characters vertical
- **Total cards shown**: 6 (in viewport)
- **Infinite scroll**: More cards load on scroll

## Interaction Flow

1. User scrolls through feed
2. Hovers over video card → thumbnail overlay appears
3. Clicks on card → navigates to video player
4. Alt: Clicks on channel name → navigates to channel page
