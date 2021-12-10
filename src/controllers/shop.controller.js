'use strict';
const Shop = require('../models/shop.model');


exports.findAll = function(req, res) {
  Shop.findAll(function(err, shop) {
    if (err){
      res.send(err);
    }
    else{
      res.send(shop);
    }
  });
};


exports.create = function(req, res) {
    const new_shop = new Shop(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Shop.create(new_shop, function(err, shop) {
            if (err){
                res.send(err);
            }
            else{
            res.json({error:false,message:"User added successfully!",data:shop});
            }
        });
    }
};

exports.delete = function(req, res) {
  Shop.delete( req.params.id, function(err, shop) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'user successfully deleted' });
  });
};

exports.findById = function(req, res) {
  Shop.findById(req.params.id, function(err, shop) {
  if (err)
  res.send(err);
  res.json(shop);
  });
};

exports.findByIdUser = function(req, res) {
  Shop.findByIdUser(req.params.id, function(err, shop) {
  if (err)
  res.send(err);
  res.json(shop);
  });
};

exports.update = function(req, res) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0){
    res.status(400).send({ error:true, message: 'Please provide all required field' });
  }else{
    Shop.update(req.params.id, new Shop(req.body), function(err, shop) {
        if (err){
          res.send(err);
        }
        else{
          res.json({ error:false, message: 'Employee successfully updated' });
        }
    });
  }
};