const cors = require('cors');
const express = require('express');
const net = require('net');

const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/index');

app.use('/api', routes)

const server = net.createServer(socket => {

    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort

    console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);

    socket.on('data', data => {
        socket.write('CHARGERON');
    })
})


server.listen(9001, () => {
    console.log('TCP server is listening on port 9001')
})
