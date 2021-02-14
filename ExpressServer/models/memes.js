const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memeSchema = new Schema({
    Url: {
        type: String,
        required: true
    },
    Preset: {
        type: Boolean,
        required: true
    },
    Titel:{
        type: String,
        required: false
    },
    Autor:{
        type: String,
        required: false
    },
    CreatorID:{
        type: String,
        required: false
    },
    Public:{
        type: Boolean,
        required: false
    },
    Likes: [],
    Dislikes:[]


}, {timestamps: true});

const Meme = mongoose.model('Meme', memeSchema);
module.exports = Meme;
