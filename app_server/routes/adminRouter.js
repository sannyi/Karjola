var router = require('express').Router();

var adminCtrl = require('../controllers/adminController');

router.get('/', adminCtrl.adminManagement);
router.get('/osebje', adminCtrl.sampleAdminProfAsist);
router.get('/osebje/urejanje', adminCtrl.sampleAdminProfAsistUrejanje);
router.post('/moduli/nov', adminCtrl.modulDodaj);
router.post('/moduli/:idModula', adminCtrl.modulUredi);
router.post('/moduli/izbrisi/:idModula', adminCtrl.moduliIzbrisi);
router.post('/osebje/nov', adminCtrl.osebjeDodaj);
router.post('/osebje/izbrisi/:idOseba', adminCtrl.osebjeIzbrisi);
router.post('/predmeti/nov', adminCtrl.predmetiDodaj);
router.post('/predmeti/izbrisi/:idPredmet', adminCtrl.predmetiIzbrisi);

module.exports = router;
