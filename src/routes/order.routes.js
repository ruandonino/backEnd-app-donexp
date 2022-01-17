const express = require('express')
const router = express.Router()
const orderController =   require('../controllers/order.controller');
// Retrieve all employees
router.get('/', orderController.findAll);
// Create a new employee
router.post('/', orderController.create);
// Retrieve a single employee with id
router.get('/:id', orderController.findById);
// Retrieve a single employee with id
router.get('/shop/:id', orderController.findByIdShop);
// Retrieve a single employee with id
router.get('/list/:id', orderController.listOrderByIdShop);
// Update a employee with id
router.put('/:id', orderController.update);
// Delete a employee with id
router.delete('/:id', orderController.delete);
module.exports = router