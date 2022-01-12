'use strict';
const Camiseta = require('../models/camiseta.model');


exports.findAll = function(req, res) {
  Camiseta.findAll(function(err, camiseta) {
    if (err){
      res.send(err);
    }
    else{
      res.send(camiseta);
    }
  });
};


exports.create = function(req, res) {
    const new_camiseta = new Camiseta(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Camiseta.create(new_camiseta, function(err, camiseta) {
            if (err){
                res.send(err);
            }
            else{
            res.json({error:false,message:"camiseta added successfully!",data:camiseta});
            }
        });
    }
};

exports.delete = function(req, res) {
  Camiseta.delete( req.params.id, function(err, camiseta) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'camiseta successfully deleted' });
  });
};

exports.findById = function(req, res) {
  Camiseta.findById(req.params.id, function(err, camiseta) {
  if (err)
  res.send(err);
  res.json(camiseta);
  });
};

exports.findByIdShop = function(req, res) {
  Camiseta.findByIdShop(req.params.id, function(err, camiseta) {
  if (err)
  res.send(err);
  res.json(camiseta);
  });
};

exports.findbyProduct = function(req, res) {
    //handles null error
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
      res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Camiseta.findByProduct(req.body.idProduct,req.body.client_id, req.body.date, req.body.shop_id, req.body.tam, req.body.color,req.body.quant, function(err, camiseta) {
          if (err){
              res.send(err);
          }
          else{
          res.json({error:false,message:"data item inserted",data:camiseta});
          }
      });
  }
};

exports.update = function(req, res) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Camiseta.update(req.params.id, new Camiseta(req.body), function(err, camiseta) {
        if (err){
          res.send(err);
        }
        else{
          res.json({ error:false, message: 'camiseta successfully updated' });
        }
    });
  }
};