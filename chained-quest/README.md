# Humanoid Chained Quests - Multiplayer

A multiplayer 3D game where players can move around and interact in a shared space.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd chained-quest
```

2. Install server dependencies:
```bash
cd server
npm install
```

## Deployment

### Client (GitHub Pages)

1. Create a new repository on GitHub
2. Push your code to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. Go to your repository settings on GitHub
4. Under "Pages", select the "main" branch and "/client" folder as the source
5. Your game will be available at `https://<your-username>.github.io/<repo-name>/`

### Server (Render.com)

1. Create a new account on [Render.com](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `chained-quest-server`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"
6. Once deployed, copy your server URL (it will look like `https://chained-quest-server.onrender.com`)
7. Replace `wss://your-server-url.onrender.com` in the client's server URL input with your actual server URL (change `https://` to `wss://`)

## Playing the Game

1. Open the game URL (your GitHub Pages URL)
2. Enter the WebSocket server URL (your Render.com URL with `wss://`)
3. Click "Connect to Server"
4. Once connected, click "Start Game"
5. Wait for another player to join
6. Play!

## How to Play

- Use WASD keys to move your character
- Your character is green, and the other player's character is red
- The game starts when two players are connected
- If a player disconnects, the game will reset

## Controls

- W: Move forward
- S: Move backward
- A: Turn left
- D: Turn right

## Development

The game consists of two main components:

1. Server (`/server`):
   - WebSocket server handling player connections and game state
   - Express server serving static files

2. Client (`/client`):
   - Three.js for 3D rendering
   - WebSocket client for real-time communication

## Technical Details

- Built with Three.js for 3D graphics
- Uses WebSocket for real-time multiplayer communication
- Express.js for serving static files
- Node.js backend for game server 