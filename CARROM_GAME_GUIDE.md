# 🎯 Carrom Master - Game Guide

## Overview
**Carrom Master** is a realistic physics-based implementation of the traditional Indian board game, featuring authentic gameplay mechanics, progressive difficulty levels, and an intuitive user interface.

---

## 🎮 Game Features

### Realistic Physics Engine
- **Collision Detection**: Accurate piece-to-piece and piece-to-wall collisions
- **Friction & Momentum**: Realistic friction coefficient (0.98) that gradually slows down pieces
- **Elastic Collisions**: Proper restitution factor (0.85) for bouncy, realistic impacts
- **Mass-based Physics**: Striker has higher mass (1.5) than coins (1.0) for authentic gameplay

### Board Setup
- **Board Size**: 600x600 pixels with professional wooden appearance
- **Playable Area**: 440x440 pixels (after 80px border padding)
- **4 Corner Pockets**: 25px radius pockets at each corner
- **Traditional Layout**: 
  - 9 Black pieces
  - 9 White pieces  
  - 1 Red Queen (center)
  - 1 Golden Striker

### Scoring System
- **White Coins**: 10 points each (player's color)
- **Black Coins**: 0 points (opponent's color - don't pocket these!)
- **Red Queen**: 50 bonus points
- **Fouls**: -5 to -10 points

### Foul System
- **Striker Pocketed**: -10 points
- **Wrong Color Pocketed**: -5 points
- Realistic rule enforcement like professional carrom

---

## 🎯 How to Play

### Controls
1. **Aim**: Move your mouse to aim the striker
2. **Charge Power**: Click and hold near the striker to charge power (0-100%)
3. **Shoot**: Release mouse button to shoot
4. **Power Meter**: Visual feedback shows your power level

### Game Objective
- Pot your color coins (White) to score points
- Reach the target score before time runs out
- Avoid fouls to maximize your score

### Tips for Success
- **Power Control**: Use appropriate power - too much can cause fouls
- **Angle Strategy**: Plan bank shots off walls for difficult pieces
- **Queen Priority**: Pot the Red Queen early for 50 bonus points
- **Avoid Striker Fouls**: Don't let the striker fall into pockets
- **Practice Patience**: Wait for pieces to stop before next shot

---

## 📊 Level Progression

### 50 Progressive Levels

#### **Beginner Levels (1-10)**
- **Difficulty**: Easy
- **Target Score**: 30-75 points
- **Time Limit**: 3 minutes (180 seconds)
- **Focus**: Learn basic controls and mechanics

#### **Intermediate Levels (11-25)**
- **Difficulty**: Medium  
- **Target Score**: 80-220 points
- **Time Limit**: 4 minutes (240 seconds)
- **Focus**: Master power control and basic strategy

#### **Advanced Levels (26-40)**
- **Difficulty**: Hard
- **Target Score**: 220-440 points
- **Time Limit**: 5 minutes (300 seconds)
- **Focus**: Complex shots and strategic planning

#### **Master Levels (41-50)**
- **Difficulty**: Expert
- **Target Score**: 440-620 points
- **Time Limit**: 6 minutes (360 seconds)
- **Focus**: Perfect execution and championship skills

---

## 🏆 Star Rating System

### Performance Metrics
- **3 Stars**: Score ≥ 1.5x target (Exceptional!)
- **2 Stars**: Score ≥ target (Good!)
- **1 Star**: Score ≥ 0.5x target (Keep practicing!)
- **0 Stars**: Failed to meet minimum threshold

### Unlock System
- Complete a level to unlock the next one
- Stars accumulate across all plays
- Best score is always saved

---

## 🎨 Visual Design

### Color Scheme
- **Board**: Warm wooden tan (#f4e4c1)
- **Border**: Rich brown (#8B4513)
- **Pieces**:
  - White: #f9fafb (Pearl white)
  - Black: #1f2937 (Deep charcoal)
  - Red Queen: #dc2626 (Crimson red)
  - Striker: #fbbf24 (Golden yellow)
- **Pockets**: Dark brown (#2c1810)

### Visual Effects
- **Shine Effects**: Radial gradient on pieces for 3D appearance
- **Power Indicator**: Animated charging circle
- **Aim Line**: Red trajectory line with power-based opacity
- **Smooth Animations**: Framer Motion for UI transitions

---

## 🎮 Game States

### Start Screen
- Game rules display
- Level information
- Difficulty indicator
- Time limit notification

### Playing State
- Live timer countdown
- Score tracking
- Turn counter
- Power meter
- Real-time message feedback

### Game Over Screen
- Victory/Time's Up messages
- Final statistics:
  - Score achieved
  - Time remaining
  - Total turns
  - Foul count
- Star rating display
- Auto-return to level select

---

## 🔧 Technical Implementation

### Component Structure
```
CarromGame.tsx
├── Physics Engine
│   ├── Velocity calculations
│   ├── Collision detection
│   ├── Friction application
│   └── Position updates
├── Canvas Rendering
│   ├── Board drawing
│   ├── Pieces rendering
│   ├── Aim line visualization
│   └── Visual effects
├── Game Logic
│   ├── Turn management
│   ├── Scoring system
│   ├── Foul detection
│   └── Win conditions
└── UI Components
    ├── Timer display
    ├── Score tracking
    ├── Message system
    └── Power meter
```

### Performance Optimizations
- **RequestAnimationFrame**: 60 FPS smooth rendering
- **Efficient Collision Detection**: Optimized distance calculations
- **Conditional Rendering**: Only draw active elements
- **State Management**: React hooks for optimal re-renders

---

## 🌟 Unique Features

### Realistic Gameplay
- Authentic carrom board physics
- Traditional rules enforcement
- Professional scoring system

### Progressive Difficulty
- 50 handcrafted levels
- Gradually increasing challenges
- Multiple difficulty tiers

### User-Friendly Design
- Intuitive mouse controls
- Visual power feedback
- Helpful tooltips and messages
- Responsive UI

### Achievement Tracking
- Best score persistence
- Star rating system
- Level unlock progression
- Performance statistics

---

## 🚀 Integration

### Platform Integration
- Seamlessly integrated into game library
- Consistent UI with other games
- Shared progress tracking
- Unified settings system

### Data Management
- Local storage for progress
- Level completion tracking
- Best score recording
- Star accumulation

---

## 📝 Game Rules (Traditional Carrom)

### Official Rules Implemented
1. **Striker Placement**: Bottom baseline area
2. **Coin Colors**: White vs Black (Red Queen special)
3. **Scoring**: Points for pocketing your color
4. **Queen Rule**: 50 bonus points
5. **Fouls**: Penalties for striker/wrong color pocketing
6. **Turn System**: Alternates after each shot (simulated)

### Variations
- Single player mode (you vs the board)
- Time limit challenge
- Score target objectives

---

## 🎯 Future Enhancements (Potential)

- Multiplayer mode (local/online)
- Advanced techniques tutorial
- Replay system
- Custom board themes
- Sound effects integration
- Leaderboards
- Daily challenges

---

## 💡 Development Notes

### Code Quality
- **TypeScript**: Full type safety
- **Comments**: Well-documented functions
- **Clean Code**: Modular and maintainable
- **React Best Practices**: Hooks, memoization, proper state management

### Testing Recommendations
1. Test all difficulty levels
2. Verify physics accuracy
3. Check edge cases (all pieces pocketed, time up, etc.)
4. Validate score calculations
5. Test on different screen sizes

---

## 🎊 Conclusion

**Carrom Master** brings the beloved traditional Indian board game to life with:
- ✅ Realistic physics simulation
- ✅ Beautiful visual design
- ✅ 50 progressive levels
- ✅ User-friendly controls
- ✅ Complete rule enforcement
- ✅ Achievement system
- ✅ Professional presentation

Enjoy playing and mastering the art of Carrom! 🎯

---

**Created**: October 30, 2025  
**Version**: 1.0.0  
**Game Type**: Casual Physics Puzzle  
**Platform**: Hua Jai Rak (Hearts of Love)

