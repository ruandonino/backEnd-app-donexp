const express = require('express')
const router = express.Router()
const calcadoController =   require('../controllers/calcado.controller');
// Retrieve all employees
router.get('/', calcadoController.findAll);
// Create a new employee
router.post('/', calcadoController.create);
// Retrieve a single employee with id
router.get('/:id', calcadoController.findById);
// Retrieve a single employee with id
router.get('/shop/:id', calcadoController.findByIdShop);
// Retrieve a single employee with id
router.get('/product/shop/:id', calcadoController.allProductByIdShop);
// Update a employee with id
router.put('/:id', calcadoController.update);
// Update a employee with id
router.post('/product', calcadoController.findbyProduct);
// Update a employee with id
router.post('/findproducts', calcadoController.findProducts);
// Delete a employee with id
router.delete('/:id', calcadoController.delete);
module.exports = router