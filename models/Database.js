const mongoose = require('mongoose');
const Entry = require('./Entry');

const Schema = mongoose.Schema;

const databaseSchema = new Schema({
    bibtexdatabasename: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'entry'
    }],
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    }
}, { timestamps: true })

databaseSchema.pre('validate', async function(next) {
    const entryKeys = (await Promise.all(
        this.entries.map(entry => Entry.findById(entry).exec())
    )).map(entry => entry.citationKey);
    if (entryKeys.length !== new Set(entryKeys).size) {
        return next(new Error(`Database contains key dublicates`));
    }
    if (!this.user && !this.group) {
        return next(new Error('Database must have either a user owner or group'));
    }
    if (this.user && this.group) {
        return next(new Error("Database can't have both user owner and group"));
    }
    return next();
})

module.exports = Database = mongoose.model('database', databaseSchema);