const mongoose = require('mongoose');

const iotdetailsSchema = new mongoose.Schema({
    data: {
        required: true,
        type: String
    },
    remoteAddress: {
        required: false,
        type: String
    },
    remotePort: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('IOTDetails', iotdetailsSchema)