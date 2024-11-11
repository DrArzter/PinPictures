const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const cookie = require('cookie');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const expressApp = express();
    const server = http.createServer(expressApp);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        const cookies = socket.handshake.headers.cookie;

        if (cookies) {
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.token;

            if (token) {
                console.log('Token:', token);
            } else {
                console.log('Token not found in cookies.');
            }
        } else {
            console.log('No cookies found in handshake.');
            socket.disconnect(true);
        }

        socket.on('getChats', () => {
            console.log('getChats event received from client:', socket.id);
        });

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

    server.listen(port, () => {
        console.log(`> Ready on port ${port}`);
    });
});
