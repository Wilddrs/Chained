const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected players
const players = new Map();
let waitingPlayer = null;

// Handle WebSocket connections
wss.on('connection', (ws) => {
    const playerId = Date.now().toString();
    console.log(`Player ${playerId} connected`);

    // Add player to the list
    players.set(playerId, {
        ws: ws,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    });

    // Broadcast to all players that a new player joined
    broadcast({
        type: 'playerJoined',
        playerId: playerId
    });

    // If there's a waiting player, start the game
    if (waitingPlayer) {
        console.log('Starting game with players:', waitingPlayer, playerId);
        
        // Notify first player
        players.get(waitingPlayer).ws.send(JSON.stringify({
            type: 'start',
            playerId: waitingPlayer,
            opponent: playerId,
            isHost: true
        }));

        // Notify second player
        ws.send(JSON.stringify({
            type: 'start',
            playerId: playerId,
            opponent: waitingPlayer,
            isHost: false
        }));

        waitingPlayer = null;
    } else {
        // No waiting player, so this player has to wait
        waitingPlayer = playerId;
        ws.send(JSON.stringify({
            type: 'wait'
        }));
    }

    // Handle messages from clients
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'position':
                    // Update player position and broadcast to opponent
                    if (players.has(data.playerId)) {
                        players.get(data.playerId).position = data.position;
                        broadcastToOpponent(data.playerId, {
                            type: 'gameUpdate',
                            position: data.position,
                            rotation: data.rotation
                        });
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Player ${playerId} disconnected`);
        
        // If this was the waiting player, clear waiting player
        if (waitingPlayer === playerId) {
            waitingPlayer = null;
        }
        
        // Notify other players about disconnection
        broadcast({
            type: 'playerDisconnected',
            playerId: playerId
        });
        
        // Remove player from list
        players.delete(playerId);
    });
});

// Broadcast message to all connected clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Broadcast message to opponent only
function broadcastToOpponent(playerId, message) {
    players.forEach((player, id) => {
        if (id !== playerId && player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
}); 