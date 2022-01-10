'use strict';
const Calcado = require('../models/calcado.model');


exports.findAll = function(req, res) {
  Calcado.findAll(function(err, calcado) {
    if (err){
      res.send(err);
    }
    else{
      res.send(calcado);
    }
  });
};

exports.findbyProduct = function(req, res) {
    //handles null error
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
      res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
      Calcado.findByProduct(req.body.idProduct, req.body.tam, req.body.color, function(err, calcado) {
          if (err){
              res.send(err);
          }
          else{
          res.json({error:false,message:"Id calcado",data:calcado});
          }
      });
  }
}


exports.create = function(req, res) {
    const new_calcado = new Calcado(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Calcado.create(new_calcado, function(err, calcado) {
            if (err){
                res.send(err);
            }
            else{
            res.json({error:false,message:"calcado added successfully!",data:calcado});
            }
        });
    }
};

exports.delete = function(req, res) {
  Calcado.delete( req.params.id, function(err, calcado) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'calcado successfully deleted' });
  });
};

exports.findById = function(req, res) {
  Calcado.findById(req.params.id, function(err, calcado) {
  if (err)
  res.send(err);
  res.json(calcado);
  });
};

exports.findByIdShop = function(req, res) {
  Calcado.findByIdShop(req.params.id, function(err, calcado) {
  if (err)
  res.send(err);
  res.json(calcado);
  });
};

exports.update = function(req, res) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Calcado.update(req.params.id, new Calcado(req.body), function(err, calcado) {
        if (err){
          res.send(err);
        }
        else{
          res.json({ error:false, message: 'calcado successfully updated' });
        }
    });
  }
};