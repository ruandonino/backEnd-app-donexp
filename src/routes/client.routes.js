const express = require('express')
const router = express.Router()
const clientController =   require('../controllers/client.controller');
// Retrieve all employees
router.get('/', clientController.findAll);
// Create a new employee
router.post('/', clientController.create);
// Retrieve a single employee with id
router.get('/:id', clientController.findById);
// Retrieve a single employee with id
router.get('/shop/:id', clientController.findByIdShop);
// Update a employee with id
router.put('/:id', clientController.update);
// Delete a employee with id
router.delete('/:id', clientController.delete);
module.exports = router