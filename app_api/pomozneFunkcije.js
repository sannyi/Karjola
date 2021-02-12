const nodemailer = require("nodemailer");
const {google} = require('googleapis'); //po možnosti se reši gulaga in zrihtaj nekaj drugega
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');;


async function vrniUporabnika(req) {
    if (req.payload && req.payload.ePosta) {
        const uporabnik = Uporabnik.findOne({ePosta: req.payload.ePosta});
        if (!uporabnik) return null;
        return uporabnik;
    } else {
        return null;
    }
}

function jeAdmin(uporabnik) {
    if (uporabnik.jeAdmin) return true;
    return false;
}

function generirajObnovitveniZeton(dolzina = 40){
    var rezultat = "";
    var znaki ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var dolzinaZnakov  = znaki.length;
    for(var i = 0; i < dolzina; i++){
        rezultat += znaki.charAt(Math.floor(Math.random()*dolzinaZnakov));
    }
    return rezultat;
}
async function posljiObnovitveniZeton(zeton = "" , ePosta =""){
    try{
        if(zeton == "" || ePosta =="") return false;

        const googleOauth2Client = new google.auth.OAuth2(process.env.OAUTH2_CLIENT_ID, process.env.OAUTH2_CLIENT_SECRET,'https://developers.google.com/oauthplayground');
              googleOauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
        const dostopniZeton = await googleOauth2Client.getAccessToken();
        console.log(dostopniZeton);
        
        var besediloPoste = `
        <p>Karjola ti je pripeljala link do obnovitve gesla</p>
        <p>Žeton "${zeton}" vneseš na strani, na katero te je preusmerilo spletno mesto</p>
        <p> Če nisi tega gesla zahteval(a) ti, to spročilo ignoriraj.</p>`;
        /*
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.POSILJATELJ,
                pass: process.env.POSILJATELJ_GESLO
            }
        });*/
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'OAuth2',
                user: process.env.POSILJATELJ,
                clientId: process.env.OAUTH2_CLIENT_ID,
                clientSecret: process.env.OAUTH2_CLIENT_SECRET,
                refresh_token: process.env.REFRESH_TOKEN,
                accessToken: dostopniZeton
            }
        
        });

        let nastavitvePoste = {
            from: '"Karjola Support" <' + process.env.POSILJATELJ +'>',
            to: `${ePosta}`,
            subject: "Žeton za obnovitev gesla",
            text: "Evo tu maš žeton!",
            html: besediloPoste
        }
       const rezultat = await transporter.sendMail(nastavitvePoste);
       return rezultat;
    }catch(napaka){


        return napaka;
    }
    
}
module.exports = {
    generirajObnovitveniZeton,
    posljiObnovitveniZeton,
    vrniUporabnika,
    jeAdmin
};