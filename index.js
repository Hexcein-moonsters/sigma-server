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

    let firstRun = true;

    let AS = "placeholder";
    function connectAS() {

        AS = new WebSocket("wss://mc.arch.lol/");
        console.log("AS WebSocket instance created");
        AS.on('open', () => {
           console.log("Connected to Actual Server!"); 
        });
        AS.on('message', (message) => {
            console.log(`Message from AS: ${message}`)
            ws.send(message); // Forward the message to the original Socket
        });
        AS.on('error', (error) => {
            console.error('AS error:', error);
        });
        
        // Event listener for when the connection is closed
        AS.on('close', (event) => {
            if (event.code === 4001) {
                // Ws hang up
            } else {
                console.log('Connection closed:', event.code, event.reason);
                ws.close(4002, event.reason); // Disconnect the client.
            }
        });
        
    }
        
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
            ws.send(JSON.stringify(msg));
            //console.log(`Closing WS connection with code: 4001, reason: "Closed by own Server"`);
            ws.close(4001, "Closed by own Server");
        } else {
            if (!Buffer.isBuffer(message)) {
                // Not mc related, so echo back
                console.log(`Received message: ${message}`);
                ws.send(`Echo: ${message}`);
            } else if (Buffer.isBuffer(message)) {
                if (firstRun) {
                    connectAS();
                    firstRun = false;

                    if (AS.readyState === WebSocket.OPEN) {
                        AS.send(message);
                    } else {
                        const maxRetries = 20; // Try for 10 seconds (20 * 500ms)
                        let attempts = 0;
                        const trySend = setInterval(() => {
                            if (AS.readyState === WebSocket.OPEN) {
                                AS.send(message);
                                clearInterval(trySend);
                            } else if (++attempts >= maxRetries) {
                                console.error("AS failed to open. Message not sent.");
                                clearInterval(trySend);
                                ws.close(4001, "Couldn't connect to AS.");
                            }
                        }, 500);
                    }

                    return; // Make sure to not call the send again after we already did it.
                }
                // Client requsted server data.
                // Ask the Actual Server the same data.
                AS.send(message);
            }
        }
    });

    // Handle WebSocket close event
    ws.on('close', (code, reason) => {
        //console.log(`Connection closed with code: ${code}`);
        if (code === 4001) {
            // Closed by us
            console.log("Ws closed, requested by us.");
        } else if (code === 4002) {
            // AS closed
            console.log("AS closed.");
        } else {
            console.log('Client disconnected');
            if (AS !== "placeholder") {
                AS.close(4001, "Ws hang up"); // Disconnect from the Actual server.
            } else {
                console.log("AS was not yet connected, yet the ws already closed!");
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
