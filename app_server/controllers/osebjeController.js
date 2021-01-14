const axios = require('axios').default;
const pridobiSidebar = require('../pridobiSidebar');

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};

if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'https://sp-lp24-karjola.herokuapp.com';
}

const vrniSeznamOseb = async (req) => {
    return new Promise ((resolve) => {
        axios
            .get(apiParametri.streznik + '/api/osebje/')
            .then((odgovor) => {
                resolve(odgovor.data);
            })
            .catch(() => {
                resolve([]);
            });
    });
}

const prikaziOsebo = async (req, res) => {
    var seznamOseb = await vrniSeznamOseb(req);
    var idOseba = req.params.idOseba;
    var oseba = [];
    for(let i=0; i<seznamOseb.length; i++){
        if(seznamOseb[i]._id === idOseba){
            oseba = seznamOseb[i];
        }
    }
    res.render('adminProfAsistUrejanje', {
        title: 'PROFESOR / ASISTENT',
        id: idOseba,
        akademskiNaziv: oseba.akademskiNaziv,
        izobrazba: oseba.izobrazba,
        ime_priimek: oseba.ime_priimek,
        opis: oseba.opis,
        sidebarData: await pridobiSidebar()
    });
}

const izbrisiOsebo = async (req,res) => {
    const idOseba = req.params.idOseba;
    //console.log(idOseba);
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/osebje/' + idOseba,
    }).then((odgovor) => {
        console.log("odgovor: " + odgovor + " ,status = " + odgovor.status);
        res.sendStatus(201);
        //res.redirect('/admin');
    })
        .catch((napaka) => {
            console.log(napaka);
            res.redirect('/osebje/' + idOseba + '/nastavitve');
        });
}

const ponastaviOsebo = async (req,res) => {
    const idOseba = req.params.idOseba;
    //console.log('id osebe iz controllerja', idOseba);

    axios({
        method: 'put',
        url: apiParametri.streznik + '/api/osebje/' + idOseba,
        data: {
            id: idOseba,
            akademskiNaziv: req.body.akademskiNaziv,
            izobrazba: req.body.izobrazba,
            ime_priimek: req.body.ime_priimek,
            opis: req.body.opis
        }
    }).then((odgovor) => {
        console.log("odgovor: " + odgovor + " ,status = " + odgovor.status);
        res.redirect('/osebje/' + idOseba + '/nastavitve');
    })
        .catch((napaka) => {
            prikaziNapako(req, res, napaka);
            res.redirect('/osebje/' + idOseba + '/nastavitve');
        });
}

module.exports = {
    vrniSeznamOseb,
    prikaziOsebo,
    izbrisiOsebo,
    ponastaviOsebo
};