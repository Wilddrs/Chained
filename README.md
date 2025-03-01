# Humanoid Chained Quests

A multiplayer 3D game where players work together to collect keys and reach the portal while being connected by a chain.

## Game Features

- Real-time multiplayer gameplay
- 3D environment with physics
- Cooperative key collection
- Chain physics that keep players connected
- Split-screen view for local testing
- WebSocket-based networking

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern web browser with WebGL support

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Wilddrs/Chained.git
cd Chained
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Start the server:
```bash
npm start
```

4. Open the game in your browser:
- Navigate to `https://wilddrs.github.io/Chained/`
- Enter the WebSocket URL (e.g., `ws://localhost:3000` for local testing)
- Click "Connect to Server"

## Deployment

### Client (GitHub Pages)
The client is automatically deployed to GitHub Pages when changes are pushed to the main branch.
Access the game at: `https://wilddrs.github.io/Chained/`

### Server (Render.com)
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - Name: `chained-game`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Once deployed, use the WebSocket URL: `wss://chained-game.onrender.com`

## Controls

- WASD / Arrow Keys: Move character
- Mouse: Control camera
- Mouse wheel: Zoom in/out

## Game Rules

1. Players must work together while being connected by a chain
2. Collect all 6 keys scattered around the level
3. Both players must reach the portal together to complete the level
4. If a player disconnects, the game resets

## Development Notes

- Client: Built with Three.js and Cannon.js
- Server: Node.js with Express and WebSocket
- Deployment: GitHub Pages (client) and Render.com (server)
