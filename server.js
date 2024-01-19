const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/landing.html');
});

app.get('/:roomId', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    const roomId = socket.handshake.query.roomId;

    console.log(`A user connected to room ${roomId}`);
    socket.join(roomId);

    socket.on('text change', (text) => {
        io.to(roomId).emit('text update', text);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected from room ${roomId}`);
    });
});

server.listen(3000, '0.0.0.0' , () => {
    console.log('Server is running on port 3000');
});

