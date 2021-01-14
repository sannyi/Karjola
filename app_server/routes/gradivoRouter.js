const router = require('express').Router();

const predmetiCtrl = require('../controllers/predmetiController');
const gradivoCtrl = require('../controllers/gradivoController');

router.get('/:idGradiva', 
    gradivoCtrl.prikaziGradivo);

router.post('/:idGradiva/prijavi',
    gradivoCtrl.prijaviGradivo);

router.post('/:idGradiva/izbrisi',
    gradivoCtrl.izbrisiGradivo);

router.post('/:idGradiva/preklopiVidljivost',
    gradivoCtrl.preklopiVidljivostGradiva);

router.post('/:idGradiva/objaviKomentar',
    gradivoCtrl.objaviKomentar);

router.post('/:idGradiva/komentar/:idKomentar/izbrisi',
    gradivoCtrl.izbrisiKomentar);

router.post('/:idGradiva/komentar/:idKomentar/prijavi',
    gradivoCtrl.prijaviKomentar);

module.exports = router;
