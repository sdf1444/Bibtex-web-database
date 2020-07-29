const mongoose = require('mongoose');
const Database = require('./Database');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    joinRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }]
}, { timestamps: true })

module.exports = Group = mongoose.model('group', groupSchema);