const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const databaseSchema = Schema({
    bibtexdatabasename: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'entry'
    }]
})

module.exports = Database = mongoose.model('database', databaseSchema);