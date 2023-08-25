const express = require('express');
const router = express.Router();
const net = require('net');

router.get('/', async (req, res) => {
    res.send("Server started at 9000")
})

  // start changing
  router.get('/startCharging/CHARGEON', async (req, res, next) => {
    try {
        console.log('CHARGEON')
        const server = net.createServer(socket => {

            const remoteAddress = socket.remoteAddress;
            const remotePort = socket.remotePort

            console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);

            socket.on('data', data => {
                socket.write('CHARGERON');
            })
        })
        console.log(server)
        res.send("CHARGE ON")
    } catch (error) {
      sendError(res, error.message);
    }
  });

  router.get('/startCharging/CHARGEOFF', async (req, res, next) => {
    try {
        console.log('CHARGEOFF')
        const server = net.createServer(socket => {

            const remoteAddress = socket.remoteAddress;
            const remotePort = socket.remotePort

            console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);

            socket.on('data', data => {
                socket.write('CHARGEOFF');
            })
        })
        console.log(server)
        res.send("CHARGE OFF")
    } catch (error) {
      sendError(res, error.message);
    }
  });
  module.exports = router;