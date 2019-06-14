const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TagsSchema = new Schema({
    value: {
        type: String
    },
    icon: {
        type: String
    },
    color: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
module.exports = Tags = mongoose.model('Blog_Tags', TagsSchema);
