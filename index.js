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
        if (message == "Accept: MOTD") {
            //const msg = {"name":"WebMC","brand":"lax1dude","vers":"EaglerXBungee/1.3.3","cracked":true,"time":1737893247694,"uuid":"34459af5-e3c6-406a-8c2a-3efefa1b3841","type":"motd","data":{"cache":true,"motd":["§a§lWebMC§r","§7Minecraft OneBlock | Java and Eagler§r"],"icon":true,"online":4,"max":64,"players":["CHfawai","MCaihaozhejava","zimujun","AcrobaticGenie14"]}}
            const msg = {
                "name": "Sigma-Server",
                "brand": "lax1dude",
                "vers": "EaglerXBungee/1.3.3",
                "cracked": true,
                "time": Date.now(),
                "uuid":"34459af5-e3c6-406a-8c2a-3efefa1b3841",
                "type":"motd",
                "data":{
                    "cache":true,
                    "motd":[
                        "§a§lSIGMAAA§r",
                        "§7Sigma-Server | Join for a nice suprise :)§r"
                    ],
                    "icon":true,
                    "online":4,
                    "max":69,
                    "players": [
                        "lax1dude",
                        "Colbster937",
                        "AdmiralDaniel",
                        "Sigma",
                        "Notch"
                    ]
                }
            }
            ws.send(msg);
        } else {
            console.log(`Received message: ${message}`);
            ws.send(`Echo: ${message}`);
        }
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
