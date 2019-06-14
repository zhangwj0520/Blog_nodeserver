const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TypesSchema = new Schema({
    value: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
module.exports = Types = mongoose.model('Blog_Types', TypesSchema);
