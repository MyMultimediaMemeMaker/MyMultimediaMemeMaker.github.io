const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Schema für den Aufbau eines Meme-Datenbank-Eintrags
const memeSchema = new Schema({
    Url: {
        type: String,
        required: true
    },
    //Gibt an, ob es sich um einen Hintergrund oder ein fertiges Meme handelt
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
    Description:{
        type: String,
        required: false
    },
    Public:{
        type: Boolean,
        required: false
    },
    //Handelt es sich um einen Hintergrund, entspricht Likes der Anzahl der Aufrufe und Dislikes der Anzahl der Generierungen
    Likes: [],
    Dislikes:[]


}, {timestamps: true});

const Meme = mongoose.model('Meme', memeSchema);
module.exports = Meme;
