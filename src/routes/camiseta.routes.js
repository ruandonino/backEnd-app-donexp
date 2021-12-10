const express = require('express')
const router = express.Router()
const camisetaController =   require('../controllers/camiseta.controller');
// Retrieve all employees
router.get('/', camisetaController.findAll);
// Create a new employee
router.post('/', camisetaController.create);
// Retrieve a single employee with id
router.get('/:id', camisetaController.findById);
// Retrieve a single employee with id
router.get('/shop/:id', camisetaController.findByIdShop);
// Update a employee with id
router.put('/:id', camisetaController.update);
// Delete a employee with id
router.delete('/:id', camisetaController.delete);
module.exports = router