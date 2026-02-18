# Layout Shift Game - Quick Start Guide

## ⚡ Quick Start (30 seconds)

```bash
# 1. Install
npm install

# 2. Run
npm run dev

# 3. Open browser
# http://localhost:3000

# 4. Play!
# Click the cyan button
```

## 🎮 How to Play

| Action | Result |
|--------|--------|
| Hover near button | Button moves away |
| Click button successfully | Level advances, score +1 |
| Click elsewhere | Attempts +1 |
| Click "Reset Game" | Start over at Level 1 |

## 📈 Difficulty Progression

```
LEVEL DIFFICULTY CURVE
█████████████████████████████████████████
█ Lvl 1-3:  Easy     (Predictable movement)
█ Lvl 4-7:  Medium   (Faster & diagonal)
█ Lvl 8-10: Hard     (Random directions)
█ Lvl 11+:  Extreme  (Chaotic movement)
█████████████████████████████████████████

As you progress:
• Button moves FASTER
• Button moves FARTHER
• Movement becomes LESS predictable
• Reaction time DECREASES
```

## 🎯 Challenge Milestones

| Milestone | Difficulty | Achievement |
|-----------|-----------|-------------|
| Level 5 | 🟡 | You're getting the hang of it |
| Level 10 | 🟠 | Serious reflexes! |
| Level 15 | 🔴 | Master player territory |
| Level 20 | 💀 | Are you a robot? |

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────┐
│      Layout Shift Game 🎮                       │
│      Can you catch the elusive button?          │
├──────────┬──────────┬──────────────────────────┤
│ LEVEL 1  │ SCORE 0  │ ATTEMPTS 0               │
├──────────┴──────────┴──────────────────────────┤
│                                                 │
│              Game Container                    │
│                                                 │
│           ┌──────────────┐                     │
│           │  Click Me!   │ ← Evasive Button   │
│           └──────────────┘                     │
│                                                 │
│          Try to click the button!              │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Reset Game Button]                            │
├─────────────────────────────────────────────────┤
│  How to Play                                    │
│  ✓ Try to click the cyan button                │
│  ✓ Each click = next level                     │
│  ✓ Gets harder each level                      │
│  ✓ Can you reach level 20?                     │
└─────────────────────────────────────────────────┘
```

## 🎨 Visual Feedback

| Feedback | Meaning | Color |
|----------|---------|-------|
| Green flash | Successful click | 🟢 |
| Red flash | Missed click | 🔴 |
| Button grows | On hover | Scale 110% |
| "Try to click..." | Default message | White text |
| "Level X Complete!" | Success message | Bright white |
| "Missed! Attempts: X" | Miss message | Purple text |

## 🎛️ Game Parameters by Level

```typescript
// Levels 1-3 (Easy)
Reaction Time: 300ms
Movement Range: 100px
Movement Type: Cardinal (4 directions)
Button Speed: Slow
Difficulty: 🟢 Easy - Great for learning

// Levels 4-7 (Medium)
Reaction Time: 100ms
Movement Range: 200px
Movement Type: 8 directions (cardinal + diagonal)
Button Speed: Medium
Difficulty: 🟡 Medium - Developing reflexes

// Levels 8-10 (Hard)
Reaction Time: 50ms
Movement Range: 300px
Movement Type: Random angles (360°)
Button Speed: Fast
Difficulty: 🟠 Hard - Expert challenge

// Levels 11+ (Extreme)
Reaction Time: 25ms
Movement Range: 400px
Movement Type: Chaotic random
Button Speed: Very fast
Difficulty: 🔴 Extreme - Nearly impossible
```

## 🔑 Controls

### Mouse/Trackpad
- **Hover**: Move cursor near button (triggers movement)
- **Click**: Click on button to score, elsewhere to miss

### Touch
- **Tap**: Tap button to score, elsewhere to miss
- **Movement**: Same as mouse

### Keyboard
- **None** (yet - future enhancement)

## 💡 Pro Tips

1. **Levels 1-3**: Learn the movement patterns
2. **Levels 4-7**: Anticipate the next position
3. **Levels 8-10**: React faster, move your mouse in advance
4. **Levels 11+**: Seriously, good luck 😄

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Button not moving | Hover over it, not just click |
| Game freezes | Reload page |
| Button stuck off-screen | Button constrained to container |
| Score not increasing | Make sure you click ON the button |
| Want to restart | Click "Reset Game" button |

## 📱 Mobile Tips

- Game is touch-friendly
- Use landscape mode for better visibility
- Tap button to score
- May be harder on mobile (no hover detection on tap)

## ⚙️ Technical Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)

## 📂 Project Files

```
app/
├── page.tsx                    ← Game entry point
├── layout.tsx                  ← Page layout
├── globals.css                 ← Styling
└── components/
    └── LayoutShiftGame.tsx     ← Main game component (290 lines)
```

## 🚀 Build for Production

```bash
# Build optimized version
npm run build

# Start production server
npm start

# Deploy to Vercel (optional)
# vercel
```

## 🎯 Game Stats You Can Track

- **Your Level**: How far you've progressed
- **Your Score**: Successful clicks (level advances)
- **Your Attempts**: Failed clicks on current level
- **Your Best**: Best level reached (future feature)

## 🌟 Easter Eggs

- Try to reach level 20 (extremely challenging)
- At level 11+, the button becomes almost impossible to click
- Message text changes to celebrate milestones

## 📞 Support

For issues or suggestions:
1. Check the GAME_README.md for detailed instructions
2. Check TECHNICAL_DOCS.md for implementation details
3. Review the code in app/components/LayoutShiftGame.tsx

## ✨ Enjoy the Challenge!

The game is designed to be:
- 🎮 **Fun**: Progressive difficulty keeps it engaging
- ⚡ **Fast**: Quick levels, instant feedback
- 🎨 **Beautiful**: Modern UI with smooth animations
- 📈 **Challenging**: Get better with practice

**Can you reach level 20? 🚀**

---

**Quick Links**:
- [Full Game README](./GAME_README.md)
- [Technical Documentation](./TECHNICAL_DOCS.md)
- [Project Summary](./PROJECT_SUMMARY.md)
