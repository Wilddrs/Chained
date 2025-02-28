const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes with specific origin
app.use(cors({
    origin: ['https://wilddrs.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Add a health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Add root endpoint
app.get('/', (req, res) => {
    res.send('Chained Game Server is running!');
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket.Server({ 
    server,
    // Add WebSocket specific configurations
    clientTracking: true,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        }
    }
});

// Store connected players
const players = new Map();
let waitingPlayer = null;

wss.on('connection', (ws) => {
    console.log('New player connected');

    // Generate a unique ID for the player
    const playerId = Date.now().toString();
    
    if (!waitingPlayer) {
        // This is the first player, wait for another
        waitingPlayer = { ws, id: playerId };
        ws.send(JSON.stringify({ type: 'wait', message: 'Waiting for another player...' }));
    } else {
        // Second player joined, start the game
        const player1 = waitingPlayer;
        const player2 = { ws, id: playerId };

        // Store both players
        players.set(player1.id, player1);
        players.set(player2.id, player2);

        // Send start game message to both players
        player1.ws.send(JSON.stringify({
            type: 'start',
            playerId: player1.id,
            isHost: true,
            opponent: player2.id
        }));

        player2.ws.send(JSON.stringify({
            type: 'start',
            playerId: player2.id,
            isHost: false,
            opponent: player1.id
        }));

        waitingPlayer = null;
    }

    // Handle messages from players
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Forward game state updates to the other player
            if (data.type === 'gameUpdate') {
                const opponent = players.get(data.targetId);
                if (opponent) {
                    opponent.ws.send(JSON.stringify({
                        type: 'gameUpdate',
                        playerId: data.playerId,
                        position: data.position,
                        rotation: data.rotation,
                        keys: data.keys
                    }));
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Player disconnected');
        
        // Remove player from waiting if they were waiting
        if (waitingPlayer && waitingPlayer.ws === ws) {
            waitingPlayer = null;
        }

        // Notify opponent if they were in a game
        players.forEach((player, id) => {
            if (player.ws === ws) {
                players.delete(id);
                // Find and notify opponent
                players.forEach(opponent => {
                    if (opponent.ws.readyState === WebSocket.OPEN) {
                        opponent.ws.send(JSON.stringify({
                            type: 'playerDisconnected',
                            message: 'Other player disconnected'
                        }));
                    }
                });
            }
        });
    });
}); 