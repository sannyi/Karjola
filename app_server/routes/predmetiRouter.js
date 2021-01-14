const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const predmetiCtrl = require('../controllers/predmetiController');
const gradivoCtrl = require('../controllers/gradivoController');

router.get('/:idPredmeta', 
    predmetiCtrl.prikazPredmeta);

router.get('/:predmetId/nastavitve', 
    predmetiCtrl.prikaziNastavitvePredmeta);

router.post('/:predmetId/nastavitve',
    predmetiCtrl.ponastaviPredmet);

router.post('/:idPredmeta', 
    upload.single('datoteka'),
    gradivoCtrl.nalaganjeGradiva);

router.post('/:predmetId/izbrisi',
    predmetiCtrl.izbrisiPredmet);

module.exports = router;
