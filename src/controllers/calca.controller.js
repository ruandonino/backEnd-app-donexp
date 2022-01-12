'use strict';
const Calca = require('../models/calca.model');


exports.findAll = function(req, res) {
  Calca.findAll(function(err, calca) {
    if (err){
      res.send(err);
    }
    else{
      res.send(calca);
    }
  });
};


exports.create = function(req, res) {
    const new_calca = new Calca(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Calca.create(new_calca, function(err, calca) {
            if (err){
                res.send(err);
            }
            else{
            res.json({error:false,message:"calca added successfully!",data:calca});
            }
        });
    }
};

exports.findbyProduct = function(req, res) {
  //handles null error
if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
}else{
    Calca.findByProduct(req.body.idProduct,req.body.client_id, req.body.date, req.body.shop_id, req.body.tam, req.body.color,req.body.quant, function(err, calca) {
        if (err){
            res.send(err);
        }
        else{
        res.json({error:false,message:"data item inserted",data:calca});
        }
    });
}
};

exports.delete = function(req, res) {
  Calca.delete( req.params.id, function(err, calca) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'calca successfully deleted' });
  });
};

exports.findById = function(req, res) {
  Calca.findById(req.params.id, function(err, calca) {
  if (err)
  res.send(err);
  res.json(calca);
  });
};

exports.findByIdShop = function(req, res) {
  Calca.findByIdShop(req.params.id, function(err, calca) {
  if (err)
  res.send(err);
  res.json(calca);
  });
};

exports.update = function(req, res) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Calca.update(req.params.id, new Calca(req.body), function(err, calca) {
        if (err){
          res.send(err);
        }
        else{
          res.json({ error:false, message: 'calca successfully updated' });
        }
    });
  }
};