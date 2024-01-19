const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // For generating unique room IDs

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    // Generate a unique room ID for each new user
    const roomId = uuidv4();
    res.redirect(`/${roomId}`);
});

app.get('/:roomId', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Join the room
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);

    socket.on('text change', (text) => {
        socket.to(roomId).emit('text update', text);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

