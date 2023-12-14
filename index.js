const net = require('net');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const router = express.Router();
const IoTModel = require('./models/iotdetailsmodel');
let Status = false;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://narayanarajugv:jZ5hzXiTWzUhq3bc@cluster0.bt2cg2j.mongodb.net/GMR', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
  });


const server = net.createServer(socket => {

  const remoteAddress = socket.remoteAddress;
  const remotePort = socket.remotePort

  console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);

    setInterval(function() {
      console.log(Status)
      if (Status) {
        console.log('CHARGERON')
        socket.write('CHARGERON ');
      } else {
        console.log('CHARGEROFF')
        socket.write('CHARGEROFF ');
      }
    }, 1 * 3000);


  socket.write('REQ_IoTID:');

  let iotId;

  socket.on('data', data => {

    const input = data.toString().trim();
    console.log(input);
    
    console.log(input);
    console.log(remoteAddress);
    console.log(remotePort);

    const updateIOT = updateIOTStatus(data, remoteAddress, remotePort)

    if (input.includes("IOTID")) {
        const iotidPattern = /IOTID:(\d{5})/;
        const matches = input.match(iotidPattern);
        if (matches) {
            const iotId = parseInt(matches[1]);
            console.log(`Received IoT ID: ${iotId}`);
        }
    }else if(input.includes("TEMP")){

        const temperaturePattern = /TEMP:(\d+\.\d+)/;
        const matches = input.match(temperaturePattern);
        if (matches) {
            const temperature = parseFloat(matches[1]);
            console.log(`Temperature data: ${temperature}`);
        }else{
            console.log("Invalid temperature data format");
        }
     }else if(input.includes("METER")){
        const meterPattern = /METER:(\d+\.\d+)/;
        const matches = input.match(meterPattern);
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

const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());

app.get('/api/startCharging/CHARGEON', async (req, res, next) => {
  console.log(1111)
  Status = true;
  console.log(Status)
  //const input = '{0,0,0,0,0,0,0,0,2,0,81,0,123,144,27,26,99,0,1,0,0,0,0}';//data.toString().trim();
    
  //const updateIOT = updateIOTStatus(input)
  res.send("CHARGE ON")
});

app.get('/api/startCharging/CHARGEOFF', async (req, res, next) => {
  console.log(1111)
  Status = false;
  console.log(Status)
  res.send("CHARGE OFF")
});

app.get('/api/getIoTStatus', async (req, res, next) => {
  
  const iotStatus = await IoTModel.find().sort({_id: -1}).limit(2)
  if (!iotStatus) {
    return res.send(res, 'iotStatus not found', 404);
  } else {
    //return res.send(iotStatus);
    console.log('count->')
    console.log(iotStatus)
    console.log(iotStatus.length);

    const dataArray = []
    for(i=0; i<2; i++) {
      const withoutFirstAndLast = iotStatus[i].data.slice(1, -1);
      const split_string = withoutFirstAndLast.split(",");
      dataArray.push(split_string)
    }
    console.log(dataArray)
    /*const withoutFirstAndLast = iotStatus[0].data.slice(1, -1);
    const split_string = withoutFirstAndLast.split(",");
    console.log(split_string)*/

    return res.send(
      { 
          "statusCode": 200,
          "_id": iotStatus[0]._id,
          "data": dataArray,
          "remoteAddress": iotStatus[0].remoteAddress,
          "remotePort": iotStatus[0].remotePort,
          "createdAt": iotStatus[0].createdAt,
          "updatedAt": iotStatus[0].updatedAt
      }
    )
  }

});


app.listen(9002, () => {
  console.log('API server is listening on port 9002')
})

async function updateIOTStatus(input) {
  console.log('call db')
  console.log(input)

  const withoutFirstAndLast = input.slice(1, -1);
  const split_string = withoutFirstAndLast.split(",");
  console.log(split_string)

  const iotDataCount = split_string.length;
  console.log(iotDataCount);

try {
  
  if(iotDataCount == 23 || iotDataCount == 34) {

      const data = new IoTModel({
        data: input,
        remoteAddress: remoteAddress,
        remotePort: remotePort
    })
    
    console.log(data)
    
      const dataToSave = await data.save();
      console.log(dataToSave)
      console.log('Success')
  } else {
    console.log('Fault Data')
  }
}
catch (error) {
    console.log(error)
}

}