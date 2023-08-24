const net = require('net');
const MongoClient = require('mongodb').MongoClient;

// Replace with your MongoDB connection string
const mongoUrl = 'mongodb+srv://narayanarajugv:jZ5hzXiTWzUhq3bc@cluster0.bt2cg2j.mongodb.net';
const dbName = 'GMR';

const server = net.createServer(socket => {

  const remoteAddress = socket.remoteAddress;
  const remotePort = socket.remotePort

  console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);

  socket.write('REQ_IoTID');

  let iotId;

  socket.on('data', data => {

    const input = data.toString().trim();

    if (input.includes("IoTID")) {
        const iotidPattern = /IoTID:(\d{5})/;
        const matches = inputString.match(iotidPattern);
        if (matches) {
            const iotId = parseInt(matches[1], 10);
            console.log(`Received IoT ID: ${iotId}`);

            socket.write('CHARGERON');
            updateIOTStatus(iotId)
        }
    }else if(input.includes("TEMP")){

        const temperaturePattern = /TEMP:(\d+\.\d+)/;
        const matches = inputString.match(temperaturePattern);
        if (matches) {
            const temperature = parseFloat(matches[1]);
            console.log(`Temperature data: ${temperature}`);
        }else{
            console.log("Invalid temperature data format");
        }
     }else if(input.includes("METER")){
        const meterPattern = /METER:(\d+\.\d+)/;
        const matches = inputString.match(meterPattern);
        if (matches) {
            const meter = parseFloat(matches[1]);
            console.log(`meter data: ${meter}`);
        }else{
            console.log("Invalid meter data format");
        }
     }
  });

  socket.on('end', () => {
    console.log(`IoT device ${iotId} disconnected`);
  });

  socket.on('error', err => {
    console.log(`Error with IoT device ${iotId}: ${err.message}`);
  });
});

server.listen(9001, () => {
  console.log('TCP server is listening on port 9001');
});

async function updateIOTStatus(iotId) {
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('iot');
    console.log(iotId);
    const getIotStatus = await collection.findOne({iotId:iotId})
    console.log(getIotStatus);
    if(getIotStatus.chargerStatus == true) {
        await collection.updateOne(
            {iotId:iotId}, {$set:{chargerStatus: false}}
        )
    } else {
        await collection.updateOne(
            {iotId:iotId}, {$set:{chargerStatus: true}}
        )
    }

    console.log(`OIT Status data from IoT ${iotId} saved to database`);
  } catch (err) {
    console.error(`Error saving data: ${err.message}`);
  } finally {
    client.close();
  }
}