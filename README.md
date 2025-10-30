# 💕 Hua Jai Rak (หัวใจรัก)
## Hearts of Love - GL Game Collection

> *Because every heart deserves a beautiful love story* 🌺

A beautiful **Girls' Love (GL)** multi-game platform featuring romantic visual novels, puzzles, and mini-games built with React, TypeScript, and TailwindCSS.

---

## 🌸 What's This?

**Hua Jai Rak** (Thai: หัวใจรัก, meaning "Hearts of Love") is a complete GL gaming platform that hosts multiple games in one app:
- 📖 **Story Games**: Visual novels with choices and multiple endings
- 🎯 **Mini Games**: Quick puzzle and memory games
- 💕 **Progress Tracking**: Independent progress for each game
- 🔓 **Unlock System**: Sequential unlocking of content

---

## 🎮 Available Games

### 📖 Story Games

**💔 Poisonous Love: Pixel Chef Edition**
- GL (Girls' Love) visual novel
- 4 story chapters with branching paths
- Romance, choices, multiple endings
- 2-3 hours of gameplay

### 🎯 Mini Games

**🧠 Memory Master**
- Card matching puzzle game
- 4 levels (Easy to Expert)
- Progressive difficulty

**📋 Recipe Sequence**
- Logic puzzle game
- 3 levels with increasing complexity
- Order cooking steps correctly

**💖 Heart Puzzle** (Coming Soon)
- Sliding puzzle game
- Romantic pixel art themes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Open in Browser
```
http://localhost:5173
```

---

## 🎯 How to Play

1. **Home Screen**: Click "🎮 Start Game"
2. **Game Library**: Choose from Story or Mini Games
3. **Select Content**: Pick a chapter (story) or level (mini game)
4. **Play**: Complete and unlock more content
5. **Progress**: Automatically saved

---

## 📁 Project Structure

```
src/
├── components/
│   ├── platform/          # Platform UI (Home, Library, Selection)
│   ├── scenes/            # Game scenes (Dialogue, Endings)
│   ├── game/              # Mini game components
│   └── ui/                # Reusable UI components
├── data/
│   ├── games.data.ts      # All games and levels
│   └── dialogues.data.ts  # Story content
├── types/
│   ├── platform.types.ts  # Platform types
│   └── game.types.ts      # Game types
├── hooks/                 # React hooks
├── utils/                 # Utilities
└── App.tsx                # Main app component
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: TailwindCSS 3
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **State**: React Hooks
- **Storage**: localStorage

---

## ✨ Features

### Platform
- ✅ Multi-game support
- ✅ Game library with categories
- ✅ Independent progress tracking
- ✅ Sequential unlocking
- ✅ Beautiful game cards
- ✅ Responsive design

### Games
- ✅ Story games with dialogue
- ✅ Mini games with levels
- ✅ Score & star ratings
- ✅ Best score tracking
- ✅ Replay completed content
- ✅ Time limits & challenges

### UI/UX
- ✅ Smooth animations
- ✅ Modern design
- ✅ Touch-friendly
- ✅ Mobile responsive
- ✅ Keyboard navigation
- ✅ Sound effects

---

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Laptop (1024px+)
- 💻 Desktop (1280px+)

---

## 🎨 Adding New Games

### 1. Define Game Data

Edit `src/data/games.data.ts`:

```typescript
{
  id: 'my_game',
  title: '🎯 My Game',
  subtitle: 'Fun Puzzle',
  description: 'A fun new game...',
  gameType: 'puzzle',
  category: 'minigame',
  icon: '🎯',
  unlockRequirement: 0,
  isLocked: false,
  hasLevels: true,
  estimatedTime: '10 min',
}
```

### 2. Create Component

```typescript
// src/components/game/MyGame.tsx
export const MyGame = ({ onComplete }) => {
  const handleFinish = () => {
    onComplete(1000, 3); // score, stars
  };
  
  return <div>{/* Your game */}</div>;
};
```

### 3. Register in App

Add to `App.tsx` → `renderGameContent()`:

```typescript
if (game.gameType === 'my_type') {
  return <MyGame onComplete={handleGameComplete} />;
}
```

---

## 📊 Progress & Storage

### What's Saved
- Game progress (per game)
- Completed chapters/levels
- Best scores & stars
- Unlock statuses
- Settings
- Affection & story choices

### Storage Location
- **localStorage** (automatic)
- Key: `platform_progress`

### Reset Data
Settings → Reset Game

---

## 🎯 Game Flow

```
Home Screen
  ↓
Game Library
  ↓
├─ Story Game → Chapter Select → Dialogue Scenes
└─ Mini Game → Level Select → Game Play
  ↓
Complete & Return to Selection
```

---

## 🔧 Development

### Run Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
tsc --noEmit
```

---

## 📚 Documentation

- **PLATFORM_GUIDE.md** - Complete platform guide
- **LEVEL_SYSTEM_GUIDE.md** - Old system reference

---

## 🎊 Features by Category

### 📖 Story Games
- Visual novel style dialogue
- Character interactions
- Affection/relationship system
- Multiple endings
- Branching storylines
- Romantic scenes

### 🎯 Mini Games
- Memory match puzzles
- Sequence/logic puzzles
- Time-based challenges
- Star rating system
- Score tracking
- Progressive difficulty

---

## 🌈 Future Enhancements

### Easy
- [ ] More mini game levels
- [ ] New mini games
- [ ] More story chapters
- [ ] Additional story endings

### Advanced
- [ ] Achievements system
- [ ] Statistics page
- [ ] Online leaderboards
- [ ] Daily challenges
- [ ] Seasonal events
- [ ] User profiles

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

---

## 📝 License

MIT License - Feel free to use for learning

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Pixel art aesthetic inspired by retro games
- GL storyline for inclusive representation

---

## 💖 Made with Love

Created for game lovers who enjoy variety - from emotional stories to quick puzzles!

**Enjoy your gaming platform! 🎮✨**
