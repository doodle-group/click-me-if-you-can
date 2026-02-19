# Layout Shift Game - Architecture & Design Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Application                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              page.tsx (Entry Point)              │  │
│  │         Imports LayoutShiftGame Component        │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │       LayoutShiftGame.tsx (290 lines)            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │  STATE MANAGEMENT                               │  │
│  │  ├─ gameState (level, score, attempts, ...)    │  │
│  │  ├─ buttonPos (x, y coordinates)               │  │
│  │  ├─ isMoving (movement flag)                   │  │
│  │  └─ showFeedback (hit/miss/null)               │  │
│  │                                                  │  │
│  │  CORE FUNCTIONS                                 │  │
│  │  ├─ getDifficultyParams() → difficulty config  │  │
│  │  ├─ moveButton() → calculate new position      │  │
│  │  ├─ handleButtonHover() → trigger movement     │  │
│  │  ├─ handleButtonClick() → process success      │  │
│  │  ├─ handleContainerClick() → track misses      │  │
│  │  └─ resetGame() → restart from level 1         │  │
│  │                                                  │  │
│  │  REFS                                            │  │
│  │  ├─ gameContainerRef (DOM container)            │  │
│  │  ├─ buttonRef (button element)                  │  │
│  │  └─ movementTimeoutRef (timeout management)    │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                       │                                  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           globals.css (Styling)                 │  │
│  │  ├─ Dark theme colors                           │  │
│  │  ├─ Tailwind configuration                      │  │
│  │  ├─ Custom animations                           │  │
│  │  └─ Gradient utilities                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
┌─────────────────┐
│   Game Start    │
│   Level = 1     │
│   Score = 0     │
│  Attempts = 0   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   Button Positioned Center  │
│  Show "Try to click!"       │
└────────┬────────────────────┘
         │
         ▼
    ┌─────────────┐
    │ User Hovers │
    └──────┬──────┘
           │
           ▼
    ┌────────────────┐
    │ isMoving=true  │
    │ Start timeout  │
    └──────┬─────────┘
           │
           ├─ Reaction time passes
           │
           ▼
    ┌──────────────────────┐
    │  Calculate angle &   │
    │  distance for move   │
    │ (based on level)     │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────────┐
    │  Move button to new  │
    │  position (CSS)      │
    │ isMoving=false       │
    └──────┬───────────────┘
           │
           ├────┬─────────────────┐
           │    │                 │
           ▼    ▼                 ▼
    ┌──────┐ ┌──────────┐  ┌──────────┐
    │Click │ │ Click    │  │ Hover    │
    │Button│ │Elsewhere │  │ Again    │
    └──┬───┘ └────┬─────┘  └────┬─────┘
       │          │             │
       ▼          ▼             │
    ┌──────┐  ┌──────────┐      │
    │SUCCESS  │MISS      │      │
    │+Score   │+Attempts │      │
    │+Level   │          │      │
    │Advance  │          │      │
    └────────┘ └──────────┘     │
       │          │              │
       │          └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
        Next iteration...
```

## Movement Algorithm Flowchart

```
┌─────────────────────────┐
│  moveButton() called    │
└────────┬────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Get difficulty parameters     │
│  based on current level        │
│  - reaction time               │
│  - range                       │
│  - diagonal allowed?           │
└────────┬─────────────────────┬─┘
         │                     │
         ▼                     ▼
    ┌─────────┐          ┌──────────────┐
    │Levels   │          │Levels 8+:    │
    │1-7:     │          │Random angle  │
    │Cardinal │          │(0 to 2π)     │
    │only     │          │              │
    └────┬────┘          └────┬─────────┘
         │                    │
         └──────────┬─────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ angle = calculated    │
        │ distance = range ×    │
        │   (0.5 to 1.0)       │
        └──────────┬────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ newX = x + cos(angle)    │
        │         × distance       │
        │ newY = y + sin(angle)    │
        │         × distance       │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────────┐
        │ Constrain to container:     │
        │ • Minimum: 10px padding     │
        │ • Maximum: container-100px  │
        └──────────┬──────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ setButtonPos()       │
        │ Updated via CSS      │
        │ Animation duration:  │
        │ 100ms                │
        └──────────────────────┘
```

## Difficulty Progression Curve

```
DIFFICULTY VS LEVEL

████████████████████████████████████████
█ REACTION TIME (milliseconds)
█
█  300ms  ┤●────────────────────────────
█  200ms  ┤  ●────────────────────────
█  100ms  ┤    ●──●──●──●──────────────
█   75ms  ┤        ●──●──●────────────
█   50ms  ┤            ●──●──●──────
█   25ms  ┤                ●──●──●──
█    0ms  └────────────────────────────
█         1-3  4-7  8-10 11-15 16-20+
█         LEVEL RANGE
████████████████████████████████████████

█ MOVEMENT RANGE (pixels)
█
█  400px  ┤            ●──●──●──●──●──
█  300px  ┤        ●──●──●────────────
█  200px  ┤    ●──●──●────────────────
█  100px  ┤●──●──●─────────────────────
█    0px  └────────────────────────────
█         1-3  4-7  8-10 11-15 16-20+
█         LEVEL RANGE
████████████████████████████████████████

█ MOVEMENT PATTERN
█
█  Random ┤            ◆──◆──◆──◆──◆──
█  Angle  ├            
█  8 Dir  ┤    ●──●──●────────────────
█  4 Dir  ┤●──●──●─────────────────────
█         └────────────────────────────
█         1-3  4-7  8-10 11-15 16-20+
█         LEVEL RANGE
████████████████████████████████████████
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────┐
│              LayoutShiftGame Component              │
├──────────────┬──────────────┬──────────────────────┤
│              │              │                      │
│              ▼              ▼                      ▼
│        ┌───────────┐  ┌──────────┐        ┌──────────┐
│        │  Header   │  │ Stats    │        │ Container│
│        │  Section  │  │ Display  │        │ (Game)   │
│        │           │  │          │        │          │
│        │ Title &   │  │ Level    │        │ Button   │
│        │ Subtitle  │  │ Score    │        │ Messages │
│        │           │  │ Attempts │        │ Feedback │
│        └─────┬─────┘  └────┬─────┘        └────┬─────┘
│              │             │                   │
│              └──────┬──────┴───────────────────┘
│                     │
│              ┌──────▼──────┐
│              │ Event Flow  │
│              ├─────────────┤
│              │ Mouse/Touch │
│              │   Events    │
│              │    │ │ │    │
│         ┌────┼─┐ ┤ ┤ ┤ ┌─┼────┐
│         │    │ │ │ │ │ │ │    │
│         ▼    ▼ ▼ ▼ ▼ ▼ ▼ ▼    ▼
│      ┌────┴────────────────────┐
│      │  Event Handlers:        │
│      │  ├─ onMouseEnter        │
│      │  ├─ onClick             │
│      │  ├─ onTouchStart        │
│      │  └─ handleContainerClick│
│      └────────┬─────────────────┘
│              │
│         ┌────▼─────────────┐
│         │ State Updates:   │
│         │ • setGameState   │
│         │ • setButtonPos   │
│         │ • setShowFeedback│
│         │ • setIsMoving    │
│         └──────────────────┘
│
└─────────────────────────────────────────────────────┘
```

## Level Progression Timeline

```
TIME →
─────────────────────────────────────────────────────────

Level 1  | Player learns mechanics
├─ 300ms reaction time
├─ 100px movement
├─ Cardinal directions
└─ "Easy"

Level 4  | Medium difficulty kicks in  
├─ 100ms reaction time
├─ 200px movement
├─ 8 directions
└─ "Getting harder"

Level 8  | Hard mode begins
├─ 50ms reaction time
├─ 300px movement
├─ Random angles
└─ "Expert challenge"

Level 11 | Extreme difficulty
├─ 25ms reaction time
├─ 400px movement
├─ Chaotic movement
└─ "Nearly impossible"

Level 20 | Ultimate challenge
├─ Same as level 11+
├─ Extreme precision required
├─ Few players reach here
└─ "Can you make it?"

─────────────────────────────────────────────────────────
```

## Click Detection Zone

```
┌─────────────────────────────────────────┐
│         Game Container                  │
│                                         │
│       ┌──────────────────┐             │
│       │  Movement Range  │             │
│       │  (Based on level)│             │
│       │                  │             │
│       │   ┌────────────┐ │             │
│       │   │   Button   │ │             │
│       │   │   (96x48)  │ │             │
│       │   └────────────┘ │             │
│       │        ↑          │             │
│       │   Evasion Zone    │             │
│       └──────────────────┘             │
│                                         │
│  Container Boundary (with 10px padding) │
│                                         │
└─────────────────────────────────────────┘

Click ON button → SUCCESS (hit)
Click IN container but NOT on button → MISS
Click OUTSIDE container → Ignored
Hover on button → Button MOVES
```

## UI Feedback System

```
FEEDBACK STATE MACHINE

┌─────────────┐
│   Default   │
│ (no flash)  │
└────────┬────┘
         │
    ┌────┴───────────┐
    │                │
    ▼                ▼
┌──────────┐    ┌───────────┐
│   HIT    │    │    MISS   │
│(green)   │    │   (red)   │
│ flash    │    │   flash   │
└────┬─────┘    └─────┬─────┘
     │                │
     │ After 300ms    │ After 300ms
     │                │
     └────┬───────────┘
          │
          ▼
    ┌─────────────┐
    │   Default   │
    │ (no flash)  │
    └─────────────┘

HIT:    green-500 opacity 20%, 2s pulse animation
MISS:   red-500 opacity 10%, 2s pulse animation
DEFAULT: No background overlay
```

---

**Diagram Notes**:
- ▼ = Data flow / Process flow
- ● = Point on graph
- ◆ = Different type
- ┌─┐ = Container/Boundary
- ├─┤ = Section divider
- │ = Vertical connection
- ─ = Horizontal connection

For more details, see [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md)
