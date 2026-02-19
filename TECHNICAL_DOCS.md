# Layout Shift Game - Technical Documentation

## Overview

The Layout Shift Game is a React-based interactive game that demonstrates UX challenges through gamification. Players attempt to click a moving button that evades their cursor, with difficulty scaling across 20+ levels.

## Core Mechanics

### 1. Game State Management

The game maintains state using React's `useState` hook with the following structure:

```typescript
interface GameState {
  level: number              // Current level (1-∞)
  score: number              // Number of successful clicks
  attempts: number           // Number of missed clicks
  gameActive: boolean        // Whether game is running
  message: string            // Current UI message for player
}

interface ButtonPosition {
  x: number                  // X coordinate in pixels
  y: number                  // Y coordinate in pixels
}
```

### 2. Difficulty Algorithm

The game's difficulty progression is controlled by the `getDifficultyParams()` function which returns:

```typescript
interface DifficultyParams {
  speed: number              // Reaction time in milliseconds
  range: number              // Maximum movement distance in pixels
  reactionTime: number       // Delay before button moves (in ms)
  diagonal: boolean          // Whether diagonal movement is allowed
}
```

**Difficulty Progression:**

| Level Range | Reaction Time | Movement Range | Movement Type | Speed |
|---|---|---|---|---|
| 1-3 | 300ms | 100px | Cardinal only | Slow |
| 4-7 | 150ms | 200px | Cardinal + Diagonal | Medium |
| 8-10 | 75ms | 300px | Random angle | Fast |
| 11+ | 40ms | 400px | Random angle | Very Fast |

### 3. Movement Algorithm

The button movement uses trigonometry to calculate new positions:

```typescript
function moveButton() {
  // 1. Determine movement angle
  let angle: number;
  if (params.diagonal) {
    // Levels 8+: Random angle in all directions
    angle = Math.random() * Math.PI * 2;
  } else {
    // Levels 1-7: Predefined cardinal/diagonal directions
    const directions = [0, Math.PI/2, Math.PI, (3*Math.PI)/2];
    angle = directions[Math.floor(Math.random() * directions.length)];
  }

  // 2. Calculate distance (with variance)
  const distance = params.range * (0.5 + Math.random() * 0.5);
  
  // 3. Calculate new position using polar coordinates
  let newX = buttonPos.x + Math.cos(angle) * distance;
  let newY = buttonPos.y + Math.sin(angle) * distance;
  
  // 4. Constrain to container bounds
  newX = Math.max(padding, Math.min(newX, containerWidth - 100 - padding));
  newY = Math.max(padding, Math.min(newY, containerHeight - 50 - padding));
  
  // 5. Update button position
  setButtonPos({ x: newX, y: newY });
}
```

**Angle System:**
- **0 radians**: Right
- **π/2 radians**: Down
- **π radians**: Left
- **3π/2 radians**: Up
- **Levels 8+**: Any angle from 0 to 2π

### 4. Interaction Flow

#### Player Approach Detection
```
User hovers near button
         ↓
onMouseEnter event triggered
         ↓
isMoving state = true
         ↓
Wait reactionTime milliseconds
(e.g., 300ms on level 1, 25ms on level 11+)
         ↓
moveButton() executed
         ↓
Button position updated with CSS
         ↓
isMoving state = false (ready for next move)
```

#### Click Detection
```
User clicks on button
         ↓
handleButtonClick() triggered
         ↓
showFeedback = 'hit' (green flash)
         ↓
score += 1
         ↓
level += 1 (advance to next level)
         ↓
Reset button position to center
         ↓
Wait 1 second
         ↓
Show "Level X - Get ready!" message
         ↓
Game ready for next level
```

#### Miss Detection
```
User clicks elsewhere in container
         ↓
handleContainerClick() triggered
         ↓
showFeedback = 'miss' (red flash)
         ↓
attempts += 1
         ↓
Update message with attempt count
         ↓
Wait 300ms
         ↓
Clear feedback animation
```

## User Interface

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Header - "Layout Shift Game"           │
│  Subtitle - "Can you catch the button?" │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │LEVEL│ │SCORE│ │ATTEM│              │
│  │  1  │ │  0  │ │  0  │              │
│  └─────┘ └─────┘ └─────┘              │
├─────────────────────────────────────────┤
│                                         │
│       Game Container (h-96)             │
│                                         │
│            [Button at X,Y]              │
│                                         │
│         "Try to click button!"          │
│                                         │
├─────────────────────────────────────────┤
│        [Reset Game Button]              │
├─────────────────────────────────────────┤
│  How to Play                            │
│  • Try to click the cyan button         │
│  • Each click advances to next level    │
│  • Button moves faster each level       │
│  • Can you reach level 20?              │
└─────────────────────────────────────────┘
```

### Styling Details

**Color Scheme (Dark Theme):**
- Background: Gradient from `blue-900` → `purple-900` → `black`
- Stats panels: `purple-800/50` with `backdrop-blur`
- Button: Gradient from `cyan-400` → `blue-500`
- Text: `white`, `purple-300` for labels
- Feedback: Green flash on hit, red flash on miss

**Animations:**
- Button hover: `scale-110` transform
- Position change: `duration-100` CSS transition
- Feedback: `animate-pulse` for 300ms
- Smooth: All interactive elements use `transition-all`

## Performance Optimizations

1. **Ref-based positioning**: Uses `useRef` for button element to avoid unnecessary re-renders
2. **Timeout cleanup**: Clears previous movement timeouts to prevent stale state
3. **CSS transitions**: Uses native CSS for smooth animations (GPU-accelerated)
4. **Event delegation**: Single click handler on container instead of individual click handlers
5. **State batching**: React 19 automatically batches state updates

## Browser APIs Used

- **React Hooks**:
  - `useState`: Game state, button position, feedback
  - `useEffect`: Initial button positioning
  - `useRef`: Direct DOM access for button and container

- **DOM Events**:
  - `onMouseEnter`: Detect user approach (mouse)
  - `onTouchStart`: Detect user approach (touch)
  - `onClick`: Register clicks
  - `onMouseLeave` (implicit): Reset when leaving container

- **Web APIs**:
  - `setTimeout`: Delayed button movement
  - `clearTimeout`: Cleanup stale timeouts
  - `getBoundingClientRect()`: Container dimensions
  - `Math.random()`: Random angle and distance
  - `Math.cos()` / `Math.sin()`: Angle-to-coordinate conversion

## Customization Guide

### Changing Difficulty Curve

Edit `getDifficultyParams()`:

```typescript
// Example: Make level 5 harder
} else if (level <= 5) {
  return {
    speed: 50,        // Faster reaction time
    range: 250,       // Longer distance
    reactionTime: 120,
    diagonal: true,
  };
```

### Changing Colors

Edit JSX className attributes:

```typescript
// Button color - from cyan-400/blue-500 to red-400/pink-500
className="bg-gradient-to-r from-red-400 to-pink-500"

// Container color - from slate-900 to other color
className="bg-gradient-to-b from-indigo-900 to-indigo-950"
```

### Adding Sound Effects

```typescript
const handleButtonClick = (e: React.MouseEvent) => {
  // Add sound
  new Audio('/sounds/success.mp3').play();
  // ... rest of handler
};
```

### Tracking High Scores (localStorage)

```typescript
// Save to localStorage
const saveScore = (level: number) => {
  const scores = JSON.parse(localStorage.getItem('scores') || '[]');
  scores.push({ level, timestamp: Date.now() });
  localStorage.setItem('scores', JSON.stringify(scores));
};

// Load from localStorage
const loadScores = () => {
  return JSON.parse(localStorage.getItem('scores') || '[]');
};
```

## Testing Checklist

- [ ] Level 1: Button moves slowly in cardinal directions
- [ ] Level 5: Button moves at medium speed in diagonals
- [ ] Level 10: Button moves fast in random angles
- [ ] Level 15: Button moves very fast and unpredictably
- [ ] Score increments on successful click
- [ ] Attempts increments on miss
- [ ] Button resets to center when advancing level
- [ ] Messages update appropriately
- [ ] Green flash appears on hit
- [ ] Red flash appears on miss
- [ ] Reset button returns to level 1 with score 0
- [ ] Button stays within container bounds

## Known Limitations

1. **Touch support**: `onTouchStart` is used but touch-based movement calculation could be improved
2. **Mobile responsiveness**: Button size fixed at 96x48px, could scale for mobile
3. **Accessibility**: Could add ARIA labels and keyboard controls
4. **Performance**: Very high difficulty (level 50+) might cause frame drops on older devices

## Future Enhancements

1. **Multiplayer**: Real-time competition
2. **Leaderboard**: Persistent high scores
3. **Themes**: Different visual styles
4. **Sound**: Audio feedback for interactions
5. **Analytics**: Track player patterns and skill progression
6. **AI opponent**: Button with learning behavior
7. **Power-ups**: Time slow, freeze button, etc.
8. **Accessibility**: Keyboard controls, screen reader support

## File Structure

```
app/
├── page.tsx (11 lines)
│   └── Imports LayoutShiftGame component
│
├── components/
│   └── LayoutShiftGame.tsx (290 lines)
│       ├── Interfaces (GameState, ButtonPosition)
│       ├── Component: LayoutShiftGame
│       ├── State management (gameState, buttonPos, etc.)
│       ├── Functions:
│       │   ├── getDifficultyParams()
│       │   ├── moveButton()
│       │   ├── handleButtonHover()
│       │   ├── handleButtonClick()
│       │   ├── handleContainerClick()
│       │   └── resetGame()
│       └── JSX markup with Tailwind styling
│
└── globals.css
    └── Dark theme, animations, keyframes
```

---

**Last Updated**: February 18, 2026
**Game Version**: 1.0
**Built with**: React 19, Next.js 16, Tailwind CSS 4, TypeScript 5
