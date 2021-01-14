var router = require('express').Router();

const osebjeCtrl = require('../controllers/osebjeController');

router.get('/:idOseba/nastavitve',
    osebjeCtrl.prikaziOsebo);

router.post('/:idOseba/nastavitve',
    osebjeCtrl.ponastaviOsebo);

router.post('/:idOseba/izbrisi',
    osebjeCtrl.izbrisiOsebo);

module.exports = router;