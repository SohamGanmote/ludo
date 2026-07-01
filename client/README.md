# Ludo Game - Frontend Architecture

This project is a multiplayer Ludo game built with **Next.js**, **React**, **TypeScript**, and **WebSockets**. The UI is component-based, making it easy to understand, maintain, and extend.

---

# Board Structure

The game board is built using three reusable components:

## 1. Home Component

The **Home** component renders the player's home area where all four pieces start the game. Each player (Red, Green, Yellow, and Blue) has its own Home component.

**Responsibilities**

- Renders the player's starting area.
- Displays all pieces that have not entered the board.
- Shows the colored home triangle leading toward the winner area.

---

## 2. Cell Component

The **Cell** component is responsible for rendering the playable path of the board.

Each cell can display:

- Normal board cells
- Player pieces
- Multiple pieces stacked in the same position
- Colored path cells

This component is reused throughout the entire board, making it the core building block of the game.

---

## 3. Safe Cell Component

The **Safe Cell** component renders protected cells where pieces cannot be captured.

Unlike normal cells:

- Players cannot kill opponent pieces on these cells.
- Multiple players can safely occupy the same position.
- These cells are visually different from regular path cells.

---

# Board Layout

The complete board is rendered using **three layers**.

## Layer 1

```
Home | 6 × 3 Vertical Path | Home
```

This renders:

- Red Home
- Vertical path
- Green Home

---

## Layer 2

```
3 × 6 Horizontal Path | Winner Area | 3 × 6 Horizontal Path
```

This renders:

- Left horizontal path
- Center winner area
- Right horizontal path

The winner area is where pieces finish after completing their path.

---

## Layer 3

```
Home | 6 × 3 Vertical Path | Home
```

This renders:

- Blue Home
- Vertical path
- Yellow Home

---

# Component Hierarchy

```
Board
│
├── Layer 1
│   ├── Home
│   ├── Vertical Path (Cell)
│   └── Home
│
├── Layer 2
│   ├── Horizontal Path (Cell)
│   ├── Winner Area
│   └── Horizontal Path (Cell)
│
└── Layer 3
    ├── Home
    ├── Vertical Path (Cell)
    └── Home
```

---

# Socket Architecture

The application uses a single global socket provider to manage the WebSocket connection.

Instead of opening multiple WebSocket connections across different components, the application maintains one persistent connection that every component can use.

## Features

- Single WebSocket connection for the entire application.
- Automatic reconnection if the connection is lost.
- Event-based message handling.
- Centralized event listeners.
- Room state caching for quick access.
- Global error handling with user-friendly alerts.
- Easy event emission from any component.

This architecture keeps networking logic separate from UI components, making the application easier to maintain and preventing duplicate WebSocket connections.

---

# Rendering Flow

```
Socket Provider
        │
        ▼
Receives Room State
        │
        ▼
Board Component
        │
        ▼
Creates Three Layers
        │
        ▼
Homes + Paths + Winner Area
        │
        ▼
Cells render Pieces
```

---

# Design Goals

- Reusable components
- Clean separation of concerns
- Easy to maintain
- Scalable architecture
- Single source of truth for game state
- Efficient WebSocket communication
- Responsive board rendering
