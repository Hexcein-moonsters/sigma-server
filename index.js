const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Serve default text for non-WebSocket requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the WebSocket server!\n');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Set up the WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Echo messages back to the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Echo: ${message}`);
    });

    // Handle WebSocket close event
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
