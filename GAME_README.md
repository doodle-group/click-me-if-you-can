# Layout Shift Game 🎮

A fast-paced, progressively challenging game where you try to click an evasive button that moves away as you approach it. Built to mimic cumulative layout shift (CLS) in a fun, interactive way!

## Game Overview

The goal is simple: **click the cyan button**. But there's a catch—the button detects when you're about to click it and moves away. Each successful click advances you to the next level, where the button becomes faster and more unpredictable.

### How to Play
1. Try to click the cyan "Click Me!" button
2. Each successful click advances to the next level
3. The button moves faster, farther, and more unpredictably as levels increase
4. Track your score (successful clicks) and attempts (missed clicks)

## Difficulty Progression

The game uses a sophisticated difficulty algorithm that scales with each level:

### Levels 1-3: Easy 🟢
- **Speed**: 200ms reaction time
- **Range**: 100px movement distance
- **Pattern**: Cardinal directions (up, down, left, right)
- **Goal**: Learn the mechanics

### Levels 4-7: Medium 🟡
- **Speed**: 100ms reaction time
- **Range**: 200px movement distance
- **Pattern**: Cardinal + diagonal directions
- **Goal**: Develop reflexes

### Levels 8-10: Hard 🟠
- **Speed**: 50ms reaction time
- **Range**: 300px movement distance
- **Pattern**: Random angles in all directions
- **Goal**: Master precision timing

### Levels 11+: Extreme 🔴
- **Speed**: 25ms reaction time
- **Range**: 400px movement distance
- **Pattern**: Chaotic random movement
- **Goal**: Ultimate challenge

## Features

✨ **Modern UI**
- Gradient backgrounds with glassmorphism effects
- Smooth animations and transitions
- Real-time visual feedback (hit/miss animations)
- Responsive design

🎯 **Game Mechanics**
- Progressive difficulty scaling
- Visual feedback for hits and misses
- Level tracking and scoring system
- Attempt counter
- Reset button to start over

📊 **Difficulty Parameters**
- Reaction time (how long before the button moves)
- Movement range (how far the button can move)
- Movement speed (how fast it moves)
- Movement pattern (predictable vs. random)

## Technical Stack

- **Framework**: Next.js 16+ with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Client-side**: React hooks for state management

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx                    # Main entry point
├── layout.tsx                  # Layout wrapper
├── globals.css                 # Global styles
└── components/
    └── LayoutShiftGame.tsx     # Game component (290 lines)
```

## Game Architecture

### Component: `LayoutShiftGame`

**State Management**
```typescript
GameState {
  level: number              // Current game level (1+)
  score: number              // Successful clicks
  attempts: number           // Missed clicks
  gameActive: boolean        // Game running state
  message: string            // UI feedback message
}
```

**Key Functions**
- `getDifficultyParams()`: Calculates movement parameters based on level
- `moveButton()`: Moves button away using angle-based positioning
- `handleButtonHover()`: Triggered when user approaches button
- `handleButtonClick()`: Registers successful click and advances level
- `handleContainerClick()`: Tracks missed clicks

**Movement Algorithm**
- Calculates angle: random angle (levels 8+) or cardinal/diagonal (levels 1-7)
- Applies distance based on difficulty
- Constrains position within container with padding
- Updates button position with CSS transform for smooth motion

## Customization

### Adjust Difficulty
Edit the `getDifficultyParams()` function in [app/components/LayoutShiftGame.tsx](app/components/LayoutShiftGame.tsx):
- Change `speed` to adjust reaction time
- Change `range` to adjust movement distance
- Modify level thresholds to rebalance progression

### Change Styling
- Colors: Update Tailwind classes in the JSX
- Animations: Modify duration values in `transition-all duration-100`
- Layout: Adjust container height (currently `h-96`)

### Add Features
- High score persistence (localStorage)
- Leaderboard
- Sound effects
- Particle effects on successful clicks
- Different button shapes/themes

## Performance Notes

- Uses `useRef` for direct DOM access to minimize re-renders
- Button movement optimized with short transition durations
- Container click detection prevents propagation during gameplay

## Browser Support

Works on all modern browsers supporting:
- CSS Grid/Flexbox
- CSS Transitions
- React 19
- ES6+ JavaScript

## Future Enhancements

- 🌟 Multiplayer mode
- 🎨 Themes and skins
- 🏆 Persistent leaderboard with localStorage
- 🔊 Sound effects and haptic feedback
- 📱 Touch optimization for mobile
- 🎬 Replay button clicks
- 🎪 Power-ups (slow time, freeze button)

## Files Modified/Created

- **app/page.tsx** - Replaced with LayoutShiftGame component import
- **app/globals.css** - Updated with dark theme and animations
- **app/components/LayoutShiftGame.tsx** - NEW: Main game component (290 lines)

## License

MIT
