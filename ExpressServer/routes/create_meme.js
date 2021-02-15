var express = require('express');
var router = express.Router();
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')//Canvas für den User laden
const request = require('request')

router.get('/', function(req, res, next) {
    //Work in Progress, fixe Größe des Bildes setzen
    const width = 500;
    const height = 350;
    //Downloaden eines Bildes basierend auf URL
    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
        })
    }

    const url = req.query.url; //URL aus Anfrage beziehen
    const path = './image.png' //Speicherort für das Bild auf dem Server

    //Lädt das Bild der entsprendenden URL an den entsprechenden Ort herunter
    download(url, path, () => {

        loadImage('./image.png').then(image => {
            //Canvas erstellen, Bild und Text enfügen
            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);
            //Hintergrundbild auf Canvas malen
            context.drawImage(image, 0, 0,500,350);
            var left = 250;
            //Oberer Text basierend auf übergebener Formatierung erstellen
            var style = req.query.style1+"";
            const text1 = req.query.text1;
                context.font =style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color1;
                if(req.query.t1left >0){
                    left = (req.query.t1left-100)*2+250;
                }

            //Oberen Text auf Canvas malen
            context.strokeText(text1,left,50)
            context.fillText(text1,left, 50)

            //Mittlerer Text basierend auf übergebener Formatierung erstellen
            style = req.query.style2+"";
            const text2 = req.query.text2;
                left = 250;
                context.font = style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color2;
                if(req.query.t2left >0){
                    left = (req.query.t2left-100)*2+250;
                }
            //Mittleren Text auf Canvas malen
            context.strokeText(text2,left,185)
            context.fillText(text2, left, 185)

            //Unterer Text basierend auf übergebener Formatierung erstellen
            style = req.query.style3+"";
            const text3 = req.query.text3;
                left=250;
                context.font = style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color3;
                if(req.query.t3left >0){
                    left = (req.query.t3left-100)*2+250;
                }
            //Unteren Text auf Canvas malen
            context.strokeText(text3,left,320)
            context.fillText(text3, left, 320)


            //Bild aus Canvas-Objekt erstellen, in den Buffer laden und zurücksenden
            const buffer = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            res.send(buffer);
        })
    })



});

module.exports = router;
