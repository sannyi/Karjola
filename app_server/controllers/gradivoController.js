const axios = require('axios');
const FormData = require('form-data');
const apiPovezava = require('../apiPovezava');
const uporabnikUtil = require('../uporabnikUtil');

const predmetiCtrl = require('./predmetiController');

const naloziGradivo = async (req, res) => {
    var formData = new FormData();
    // formData.append('avtor', req.body.avtor);
    if (req.file) {
        formData.append('datoteka', req.file.buffer, {
            filename: req.file.originalname
        });
    }
    else if (req.body.povezava) {
        formData.append('povezava', req.body.povezava);
    }

    var apiUrl = apiPovezava(`/predmeti/${req.params.idPredmeta}/gradivo`);

    try {
        var odgovor = await axios({
            method: 'post',
            url: apiUrl, 
            data: formData,
            headers: formData.getHeaders()
        });
    }
    catch (napaka) {
        return false;
    }

    return true;
};

const nalaganjeGradiva = async (req, res, next) => {
    try {
        var uspeh = await naloziGradivo(req, res);
        var predmet = await predmetiCtrl.predmetById(req, req.params.idPredmeta);

        await predmetiCtrl.prikaziPredmet(req, res, predmet, uspeh);
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'To gradivo ne obstaja'
            });
        }
        next(napaka);
    }
}

const prikaziGradivo = async (req, res, next) => {
    try {
        var odgovor = await axios.get(apiPovezava(`/gradivo/${req.params.idGradiva}`));

        var contentDisposition = odgovor.headers['content-disposition'];
        var regexResult = /(?<=filename=).+/.exec(contentDisposition);
        if (regexResult && regexResult.length == 1) {
            var filename = regexResult[0].replace(/"/g, '');
            res.attachment(filename);
            var file = odgovor.data;
            res.send(file);
        }
        else {
            var povezava = odgovor.data.povezava;
            res.redirect(povezava);
        }
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'To gradivo ne obstaja'
            });
        }
        next(napaka);
    }
}

const izbrisiGradivo = async (req, res, next) => {
    try {
        var odgovor = await axios.delete(apiPovezava(`/gradivo/${req.params.idGradiva}`));
        var gradivo = odgovor.data;

        res.redirect(`/predmeti/${gradivo.predmet}`);
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'To gradivo ne obstaja'
            });
        }
        next(napaka);
    }
}

const prijaviGradivo = async (req, res, next) => {
    try {
        var odgovor = await axios.post(apiPovezava(`/gradivo/${req.params.idGradiva}/prijava`));
        var gradivo = odgovor.data;

        res.redirect(`/predmeti/${gradivo.predmet}`);
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'To gradivo ne obstaja'
            });
        }
        next(napaka);
    }
}

const preklopiVidljivostGradiva = async (req, res, next) => {
    try {
        var odgovor = await axios.post(apiPovezava(`/gradivo/${req.params.idGradiva}/preklopiVidljivost`));
        var gradivo = odgovor.data;

        res.redirect(`/predmeti/${gradivo.predmet}`);
    }
    catch (napaka) {
        next(napaka);
    }
}

const objaviKomentar = async (req, res, next) => {
    try {
        var anonimno = req.body.anonimno ? true : false;
        var uporabnik = uporabnikUtil.prijavljenUporabnik(req);
        var uporabnikId;
        if (uporabnik) {
            uporabnikId = uporabnik._id;
        }

        var odgovor = await axios.post(apiPovezava(`/gradivo/${req.params.idGradiva}/komentar`), {
            komentar: req.body.komentar,
            anonimno: anonimno,
            avtor: uporabnikId
        });

        var komentar = odgovor.data;

        res.redirect(`/predmeti/${komentar.predmet}`);
    }
    catch (napaka) {
        next(napaka);
    }
}

const izbrisiKomentar = async (req, res, next) => {
    try {
        var odgovor = await axios.delete(apiPovezava(`/gradivo/${req.params.idGradiva}/komentar/${req.params.idKomentar}`));
        var komentar = odgovor.data;

        res.redirect(`/predmeti/${komentar.predmet}`);
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'Ta komentar ne obstaja'
            });
        }
        next(napaka);
    }
}

const prijaviKomentar = async (req, res, next) => {
    try {
        var odgovor = await axios.post(apiPovezava(`/gradivo/${req.params.idGradiva}/komentar/${req.params.idKomentar}/prijava`));
        var komentar = odgovor.data;

        res.redirect(`/predmeti/${komentar.predmet}`);
    }
    catch (napaka) {
        if (napaka.response.status == 404) {
            return res.render('error', {
                title: 'Ta komentar ne obstaja'
            });
        }
        next(napaka);
    }
}

module.exports = {
    nalaganjeGradiva,
    prikaziGradivo,
    izbrisiGradivo,
    prijaviGradivo,
    preklopiVidljivostGradiva,
    objaviKomentar,
    izbrisiKomentar,
    prijaviKomentar
}