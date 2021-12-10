'use strict';
const Client = require('../models/client.model');


exports.findAll = function(req, res) {
  Client.findAll(function(err, client) {
    if (err){
      res.send(err);
    }
    else{
      res.send(client);
    }
  });
};


exports.create = function(req, res) {
    const new_client = new Client(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Client.create(new_client, function(err, client) {
            if (err){
                res.send(err);
            }
            else{
            res.json({error:false,message:"Client added successfully!",data:client});
            }
        });
    }
};

exports.delete = function(req, res) {
  Client.delete( req.params.id, function(err, client) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'client successfully deleted' });
  });
};

exports.findById = function(req, res) {
  Client.findById(req.params.id, function(err, client) {
  if (err)
  res.send(err);
  res.json(client);
  });
};

exports.findByIdShop = function(req, res) {
  Client.findByIdShop(req.params.id, function(err, client) {
  if (err)
  res.send(err);
  res.json(client);
  });
};

exports.update = function(req, res) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Client.update(req.params.id, new Client(req.body), function(err, client) {
        if (err){
          res.send(err);
        }
        else{
          res.json({ error:false, message: 'Client successfully updated' });
        }
    });
  }
};