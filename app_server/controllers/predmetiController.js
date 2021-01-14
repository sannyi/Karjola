const axios = require('axios').default;
const FormData = require('form-data');
const apiPovezava = require('../apiPovezava');
const pridobiSidebar = require('../pridobiSidebar');
const uporabnik = require('../uporabnikUtil');

const adminCtrl = require('../controllers/adminController');

const predmetById = async (req, predmetId) => {
    var prijavljenUporabnik = uporabnik.prijavljenUporabnik(req);
    var uporabnikId = prijavljenUporabnik ? prijavljenUporabnik._id : '';
    if (!uporabnikId) 
        uporabnikId = ''
    
    var odgovor = await axios.get(apiPovezava(`/predmeti/${predmetId}?uporabnik=${uporabnikId}`));

    return odgovor.data;
}

const ponastaviPredmet = async (req,res) => {
    const predmetId = req.body.predmetId;
    axios({
        method: 'put',
        url: apiPovezava('/predmeti/' + predmetId),
        data: {
            predmetId: predmetId,
            ime: req.body.ime,
            letnik: req.body.letnik,
            semester: req.body.semester,
            vrstaIzbirnega: req.body.vrstaIzbirnega,
            opis: req.body.opis,
            asistenti:  adminCtrl.pretvoriNizvArray(req.body.asistenti),
            profesorji:  adminCtrl.pretvoriNizvArray(req.body.profesorji),
            moduli: adminCtrl.pretvoriNizvArray(req.body.moduli)
        }
    }).then((odgovor) => {
        console.log("odgovor: " + odgovor + " ,status = " + odgovor.status);
        res.redirect('/predmeti/' + predmetId + '/nastavitve');
    })
    .catch((napaka) => {
        prikaziNapako(req, res, napaka);
        res.redirect('/predmeti/' + predmetId + '/nastavitve');
    });
}

const izbrisiPredmet = async (req,res) => {
    const predmetId = req.params.predmetId;
    console.log(predmetId);
    axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/predmeti/' + predmetId,
    }).then((odgovor) => {
        console.log("odgovor: " + odgovor + " ,status = " + odgovor.status);
        res.sendStatus(201);
        //res.redirect('/admin');
    })
    .catch((napaka) => {
        console.log(napaka);
        res.redirect('/predmeti/' + predmetId + '/nastavitve');
    });
}

const prikaziPredmet = async (req, res, predmet, uspeh) => {
    res.render('predmet', {
        id: predmet._id,
        title: predmet.ime,
        vsebina: predmet.opis,
        uporabnik: uporabnik.prijavljenUporabnik(req),
        profesorji: predmet.profesorji,
        asistenti: predmet.asistenti,
        letnik: predmet.letnik,
        semester: predmet.semester,
        moduli: predmet.moduli,
        vrstaIzbirnega: predmet.vrstaIzbirnega,
        gradiva: predmet.gradiva,
        sidebarData: await pridobiSidebar(),
        uspeh: uspeh == true,
        napaka: uspeh == false
    });
}

const prikaziNastavitvePredmeta = async (req, res) => {
    const predmet = await predmetById(req, req.params.predmetId);
    const osebje = await adminCtrl.osebjePridobi();
    const moduli = await adminCtrl.moduliPridobi();
    res.render('predmetNastavitve', {
        id: predmet._id,
        osebje: osebje,
        moduli: moduli,
        title: predmet.ime,
        vsebina: predmet.opis,
        uporabnik: uporabnik.prijavljenUporabnik(req),
        profesorjiPredmeta: predmet.profesorji,
        asistentiPredmeta: predmet.asistenti,
        letnik: predmet.letnik,
        semester: predmet.semester,
        moduliPredmeta: predmet.moduli,
        vrstaIzbirnega: predmet.vrstaIzbirnega,
        opis: predmet.opis
    });
}

const prikazPredmeta = async (req, res, next) => {
    try {
        var predmet = await predmetById(req, req.params.idPredmeta);
        await prikaziPredmet(req, res, predmet);
    }
    catch (napaka) {
        console.trace(napaka);
        next(napaka);
    }
}

module.exports = {
    prikaziPredmet,
    predmetById,
    prikaziNastavitvePredmeta,
    ponastaviPredmet,
    prikazPredmeta,
    izbrisiPredmet
};