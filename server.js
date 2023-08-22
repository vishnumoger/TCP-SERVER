const net = require('net');

// Create a TCP server
const server = net.createServer(socket => {
    console.log('Device connected:', socket.remoteAddress, socket.remotePort);

    // Set up event listeners for socket
    socket.on('data', data => {
        console.log('Received data:', data.toString());
        // Process the data from the IoT device as needed
    });

    socket.on('end', () => {
        console.log('Device disconnected:', socket.remoteAddress, socket.remotePort);
    });

    socket.on('error', err => {
        console.error('Socket error:', err);
    });
});

const PORT = 22; // You can change this to your desired port number

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});