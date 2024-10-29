const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.emit('message', 'Hello from Socket.IO!');

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });

    expressApp.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
