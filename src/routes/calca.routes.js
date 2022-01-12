const express = require('express')
const router = express.Router()
const calcaController =   require('../controllers/calca.controller');
// Retrieve all employees
router.get('/', calcaController.findAll);
// Create a new employee
router.post('/', calcaController.create);
// Update a employee with id
router.post('/product', calcaController.findbyProduct);
// Retrieve a single employee with id
router.get('/:id', calcaController.findById);
// Retrieve a single employee with id
router.get('/shop/:id', calcaController.findByIdShop);
// Update a employee with id
router.put('/:id', calcaController.update);
// Delete a employee with id
router.delete('/:id', calcaController.delete);
module.exports = router