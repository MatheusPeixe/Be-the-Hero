const express = require('express');
const OngController = require('./controlers/OngController');
const incidentsControllers = require('./controlers/incidentsControllers');
const profileController = require('./controlers/profileController');
const SessionController = require('./controlers/SessionController');

const routes = express.Router();

routes.post('/sessions', SessionController.create);
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);
routes.get('/profile', profileController.index);
routes.get('/incidents', incidentsControllers.index);
routes.post('/incidents', incidentsControllers.create);
routes.delete('/incidents/:id', incidentsControllers.delete);

module.exports = routes; 
