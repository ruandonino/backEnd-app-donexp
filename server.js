const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 5000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Require employee routes
const userRoutes = require('./src/routes/users.routes')
// using as middleware
app.use('/api/v1/users', userRoutes)

// Require employee routes
const shopRoutes = require('./src/routes/shop.routes')
// Require employee routes
const clientRoutes = require('./src/routes/client.routes')
// Require employee routes
const calcadoRoutes = require('./src/routes/calcado.routes')
// Require employee routes
const calcaRoutes = require('./src/routes/calca.routes')
// Require employee routes
const camisetaRoutes = require('./src/routes/camiseta.routes')
// Require employee routes
const orderRoutes = require('./src/routes/order.routes')
// using as middleware
app.use('/api/v1/order', orderRoutes)
// using as middleware
app.use('/api/v1/camiseta', camisetaRoutes)
// using as middleware
app.use('/api/v1/calca', calcaRoutes)
// using as middleware
app.use('/api/v1/shop', shopRoutes)
// using as middleware
app.use('/api/v1/calcado', calcadoRoutes)
// using as middleware
app.use('/api/v1/client', clientRoutes)
// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});