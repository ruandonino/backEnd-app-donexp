const express = require('express')
const router = express.Router()
const shopController =   require('../controllers/shop.controller');
// Retrieve all employees
router.get('/', shopController.findAll);
// Create a new employee
router.post('/', shopController.create);
// Retrieve a single employee with id
router.get('/:id', shopController.findById);
// Retrieve a single employee with id
router.get('/user/:id', shopController.findByIdUser);
// Update a employee with id
router.put('/:id', shopController.update);
// Delete a employee with id
router.delete('/:id', shopController.delete);
module.exports = router