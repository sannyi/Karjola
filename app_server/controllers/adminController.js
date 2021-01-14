const axios = require('axios');
const pridobiSidebar = require('../pridobiSidebar');
const uporabnikUtil = require('../uporabnikUtil');

var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};

if (process.env.NODE_ENV === 'production') {
    apiParametri.streznik = 'https://sp-lp24-karjola.herokuapp.com';
}

// --------------- OSEBJE --------------- //
const osebjePridobi = async () => {
    return new Promise((resolve) => {
        axios
        .get(apiParametri.streznik + '/api/osebje')
        .then((odgovor) => {
            resolve(odgovor.data);
        })
        .catch(() => {
            resolve([]);
        });
    });
};

const osebjeDodaj = (req, res) => {
    console.log("Dodajam osebje v SERVER");
    var akademskiNaziv = req.body.akademskiNaziv;
    const izobrazba = req.body.izobrazba;
    const ime_priimek = req.body.ime_priimek;
    const opis = req.body.opis;
    if (!akademskiNaziv || !izobrazba || !ime_priimek || !opis) {
        console.log("Osebje potrebuje VSE naslednje parametre: akademski naziv, izobrazbo, ime in priimek ter opis")
    } else {
        //if (akademskiNaziv === 'brez') akademskiNaziv = '';
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/osebje',
            data: {
                akademskiNaziv: akademskiNaziv,
                izobrazba: izobrazba,
                ime_priimek: ime_priimek,
                opis: opis
            }
            
        }).then(() => {
            res.redirect('/admin');
        }).catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
    }
};

const osebjeIzbrisi = (req, res) => {
    const osebaId = req.params.idOseba;
    if (!osebaId) {
        console.log("za izbris potrebuješ id...");
    } else {
        axios({
            method: 'delete',
            url: apiParametri.streznik + '/api/osebje/' + osebaId
        }).then(() => {
            res.redirect('/admin');
        }).catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
    }
};

// --------------- PREDMETI --------------- //
const predmetiPridobi = async () => {
    return new Promise((resolve) => {
        axios
        .get(apiParametri.streznik + '/api/predmeti')
        .then((odgovor) => {
            resolve(odgovor.data);
        })
        .catch(() => {
            resolve([]);
        });
    });
};

const pretvoriNizvArray = function (niz) {
    var arr = niz.split('; ');
    arr.pop();
    return arr;
}

const predmetiDodaj = (req, res) => {
    var profesorji = pretvoriNizvArray(req.body.predmetProfesorji);
    var asistenti = pretvoriNizvArray(req.body.predmetAsistenti);
    var moduli = pretvoriNizvArray(req.body.moduli);
    // letnik se pretvori v stevilko (0 -> ni v letniku)
    var letnik = -1;
    switch (req.body.letnik) {
        case '1.': letnik = 1; break;
        case '2.': letnik = 2; break;
        case '3.': letnik = 3; break;
        case 'Ni v letniku': letnik = 0; break;
    }
    // semester se pretvori v stevilo
    var semester = 0;
    if (req.body.semester === 'Zimski semester') {
        semester = 1;
    } else if (req.body.semester === 'Letni semester') {
        semester = 2;
    }
    // vrsta izbirnega se pretvori v številko
    var vrstaIzbirnega = -1;
    if (req.body.vrstaIzbirnega === 'Splošni izbirni predmet') {
        vrstaIzbirnega = 1;
    } else if (req.body.vrstaIzbirnega === 'Strokovni izbirni predmet') {
        vrstaIzbirnega = 2;
    } else if (req.body.vrstaIzbirnega === 'Ni izbirni predmet') {
        vrstaIzbirnega = 0;
    }
    if (!profesorji || !asistenti || !req.body.ime || !req.body.opis || letnik === -1 || !semester  || vrstaIzbirnega === -1) {
        console.log("Niso bili vnešeni vsi potrebni podatki..");
        res.redirect('/admin');
    } else {
        axios({
            method: 'post',
            url: apiParametri.streznik + '/api/predmeti',
            data: {
                ime: req.body.ime,
                opis: req.body.opis,
                letnik: letnik,
                semester: semester,
                profesorji: profesorji,
                asistenti: asistenti,
                moduli: moduli,
                vrstaIzbirnega: vrstaIzbirnega
            }
            
        }).then(() => {
            res.redirect('/admin');
        }).catch((napaka) => {
            res.redirect('/admin');
            prikaziNapako(req, res, napaka);
        });
    }
};

const predmetiIzbrisi = (req, res) => {
    const predmetId = req.params.idPredmet;
    if (!predmetId) {
        console.log("za izbris potrebuješ id...");
    } else {
        axios({
            method: 'delete',
            url: apiParametri.streznik + '/api/predmeti/' + predmetId
        }).then(() => {
            res.redirect('/admin');
        }).catch((napaka) => {
            prikaziNapako(req, res, napaka);
        });
    }
};

// --------------- MODULI --------------- //
const moduliPridobi =  async () => {
    return new Promise((resolve) => {
        axios
        .get(apiParametri.streznik + '/api/moduli')
        .then((odgovor) => {
            resolve(odgovor.data);
        })
        .catch(() => {
            resolve([]);
        });
    })
};

const modulDodaj = (req, res) => {
    console.log("modulDodaj v adminController.js");
    if (!req.body.ime) {
        console.log("ime ne sme biti prazno pri dodajanju modula...");
    } else {
      axios({
        method: 'post',
        url: apiParametri.streznik + '/api/moduli',
        data: {
          ime: req.body.ime
        }
        
      }).then(() => {
        res.redirect('/admin');
      }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
      });
    }
};
const modulUredi = (req, res) => {
    if (!req.body.novoIme) {
        console.log("ime ne sme biti prazno pri dodajanju modula...");
    } else {
      axios({
        method: 'put',
        url: apiParametri.streznik + '/api/moduli/' + req.params.idModula,
        data: {
            ime: req.body.novoIme
        }
      }).then(() => {
        res.redirect('/admin');
      }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
      });
    }
};

const moduliIzbrisi = (req, res) => {
    const modulId = req.params.idModula;
    if (!modulId) {
        console.log("za izbris potrebuješ id...");
    } else {
      axios({
        method: 'delete',
        url: apiParametri.streznik + '/api/moduli/' + modulId
      }).then(() => {
        res.redirect('/admin');
      }).catch((napaka) => {
        prikaziNapako(req, res, napaka);
      });
    }
};

// --------------- NAPAKE --------------- //

const prikaziNapako = (req, res, napaka) => {
    // tuki bi blo treba renderat view z napako...
    // ce pride do napake bo browser samo refreshal pa cakal na nov view
    console.log("prišlo je do napake" + napaka);
};


const adminManagement = async (req, res) => {
    res.render('adminManagement', {
        title: 'ADMIN MANAGEMENT',
        uporabnik: uporabnikUtil.prijavljenUporabnik(req),
        sidebarData: await pridobiSidebar(),
        osebje: await osebjePridobi(),
        predmeti: await predmetiPridobi(),
        moduli: await moduliPridobi()
    });
};

const sampleAdminProfAsist = async(req, res) => {
    res.render('adminProfAsist', {
        title: 'PROFESOR / ASISTENT',
        uporabnik: uporabnikUtil.prijavljenUporabnik(req),
        sidebarData: await pridobiSidebar(),
        prof_asist_data: {
            akademski_naziv: 'doc.',
            izobrazba: 'Doktor računalniških znanosti, Univerza v Ljubljani, Fakulteta za računalništvo in informatiko, 2010',
            ime_priimek: 'Dejan Lavbič',
            opis: 'Leta 2004 sem diplomiral in leta 2010 doktoriral na področju računalništva in informatike na Univerzi v Ljubljani, Fakulteta za računalništvo in informatiko, kjer sem trenutno tudi zaposlen kot asistent. Na raziskovalnem področju se ukvarjam z inteligentnimi agenti, večagentnimi sistemi, odkrivanjem zakonitosti v podatkih, ontologijami in semantičnim spletom. Sem član The Society of Digital Information and Wireless Communications (SDIWC) in Slovenskega društva Informatika (SDI).'
        }
    });
};

const sampleAdminProfAsistUrejanje = async (req, res) => {
    res.render('adminProfAsistUrejanje', {
        title: 'UREJANJE: PROFESOR / ASISTENT',
        sidebarData: await pridobiSidebar(),
        prof_asist_data: {
            akademski_naziv: '',
            izobrazba: '',
            ime_priimek: 'Dejan Lavbič',
            opis: 'To je kratek opis.'
        }
        
    });
};

module.exports = {
    adminManagement,
    sampleAdminProfAsist,
    sampleAdminProfAsistUrejanje,
    modulDodaj,
    moduliPridobi,
    moduliIzbrisi,
    modulUredi,
    osebjeDodaj,
    osebjePridobi,
    osebjeIzbrisi,
    predmetiDodaj,
    predmetiIzbrisi,
    pretvoriNizvArray
};