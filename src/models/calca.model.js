'use strict';
const oracledb = require('oracledb');

//oracledb.initOraclecalca({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantcalca-basic-windows.x64-21.3.0.0.0\\instantcalca_21_3' });
// hr schema password
var password = "231295Don**banco"
// checkConnection asycn function
async function checkConnection() {
  try {
    var connection = await oracledb.getConnection({ user: "ADMIN", password: password, connectionString: "donexp_high" });
    console.log('connected to database');
  } catch (err) {
    console.error(err.message);
  } finally {
    if (connection) {
      try {
        return connection;
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//Employee object create
var Calca = function(calca){
  this.name = calca.name;
  this.price = calca.price;
  this.brand = calca.brand;
  this.id_shop  = calca.id_shop;
  this.date_model = calca.date_model;
  this.size = calca.size_calca;
  this.categorie  = calca.categorie;
  this.material  = calca.material;
  this.color  = calca.color;
  this.gender  = calca.gender;
  //this.id_produto = calca.id_produto;
  this.produto = {1:this.name, 2:this.price,3:this.brand,4:this.id_shop,return_id:{
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }};
  this.calca = {1:this.date_model, 2:this.size,3:this.categorie,4:this.material,5:this.color,6:this.gender,7:17}
};


Calca.create = async function (newCalca,result) {
  var dbConn = await checkConnection();
  console.log("INIT");
  var data_verify;
  try{
      var ret_verify_prod = await dbConn.execute("SELECT ID FROM PRODUTO WHERE NAME = :1 AND BRAND = :2 AND ID_SHOP = :3", {1:newCalca.produto[1],2:newCalca.produto[3],3:newCalca.produto[4]});
  }catch(err){
    console.log("error: ", err);
    result(err, null);
  }finally{
    if(ret_verify_prod.rows.length>0){
      console.log("VERIFY1");
      console.log(ret_verify_prod.rows.length);
      data_verify=ret_verify_prod.rows[0][0];
      console.log(data_verify);
    }
  }
  console.log("valor ID");
  console.log(data_verify);

  if(data_verify === undefined){
    console.log("Insert Product");
    try{
      var ret_produto = await dbConn.execute("INSERT INTO PRODUTO (NAME,PRICE,BRAND,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", newCalca.produto,{ autoCommit: true });
    }catch{
      console.log("error: ", err);
    }
    finally{
      newCalca.calca[7] = ret_produto.outBinds.return_id[0];
    }
  }
  else{
    /*
    try{
      var id_prod = await dbConn.execute("SELECT ID FROM PRODUTO WHERE NAME = :1 AND BRAND = :2 AND ID_SHOP = :3", {1:newCalcado.produto[1],2:newCalcado.produto[3],3:newCalcado.produto[4]});
    }catch(err){
      console.log("error: ", err);
      result(err, null);
    }finally{
      newCalcado.calcado[7]=id_prod.rows[0][0];
      console.log(newCalcado.calcado[7]);
    }
    */
    newCalca.calca[7]=data_verify; 
  }
    //console.log(ret_produto.outBinds.return_id[0]);
    //console.log(newCalcado.calcado);
  try{    
    var ret_calca = await dbConn.execute("INSERT INTO CALCA (DATE_MODEL,SIZE_CALCA,CATEGORIE,MATERIAL,COLOR,GENDER,ID_PRODUTO) VALUES (:1,:2,:3,:4,:5,:6,:7)", newCalca.calca,{ autoCommit: true });
  }
  catch(err) {
      console.log("error: ", err);
      result(err, null);
  }finally{
      console.log(ret_calca);
      result(null, ret_calca);
  }
};

/*
Calca.create = async function (newcalca, result) {
    var dbConn = await checkConnection();
    try{
        var ret_produto = await dbConn.execute("INSERT INTO PRODUTO (NAME,PRICE,BRAND,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", newcalca.produto,{ autoCommit: true });
        newcalca.calca[7] = ret_produto.outBinds.return_id[0];
        //console.log(ret_produto.outBinds.return_id[0]);
        //console.log(newcalca.calca);
        var ret_calca = await dbConn.execute("INSERT INTO CALCA (DATE_MODEL,SIZE_CALCA,CATEGORIE,MATERIAL,COLOR,GENDER,ID_PRODUTO) VALUES (:1,:2,:3,:4,:5,:6,:7)", newcalca.calca,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret_calca);
        result(null, ret_calca);
    }
};

*/

Calca.findProducts = async function (idProduct, result) {
  var dbConn = await checkConnection();
  console.log(idProduct);
  try{
    var ret = await dbConn.execute("SELECT CALCA.color,CALCA.size FROM CALCA WHERE CALCA.ID_PRODUTO = :1", {1:idProduct});
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    result(null, ret.rows);
  }
};

Calca.findByProduct = async function (idProduct,client_id,date,shop_id, tam, color,quant, result) {
  var dbConn = await checkConnection();
  console.log(idProduct);
  console.log(client_id);
  console.log(tam);
  console.log(color);
  console.log(date);
  console.log(shop_id);
  var data_verify;
  var id_order;
  try{
    var ret = await dbConn.execute("SELECT ID FROM CALCA WHERE CALCA.ID_PRODUTO = :1 AND CALCA.SIZE_CALCA = :2 AND CALCA.COLOR = :3", {1:idProduct,2:tam,3:color});
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    var id_item = ret.rows[0][0];
    //result(null, ret.rows[0][0]);
    try{
      var ret_verify_order = await dbConn.execute("SELECT ID FROM ORDER_ WHERE CLIENT_ID=:1 AND DATE_=:2 AND ID_SHOP=:3",{1:client_id,2:date,3:shop_id});
    }catch(err){
      console.log("error: ", err);
      result(err, null);
    }finally{
      if(ret_verify_order.rows.length>0){
        data_verify=ret_verify_order.rows[0][0];
      }
    }
  }
  console.log("valor ID");
  console.log(data_verify);

  if(data_verify === undefined){
    console.log("Insert Order");
    try{
      var prod = await dbConn.execute("SELECT PRICE FROM PRODUTO WHERE ID = :1",{1:idProduct});
      console.log("Prod data");
      console.log(prod.rows);
      var ret_insert_order = await dbConn.execute("INSERT INTO ORDER_ (CLIENT_ID,DATE_,TOTAL_VALUE,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", {1:client_id,2:date,3:prod.rows[0][0],4:shop_id,return_id:{dir: oracledb.BIND_OUT,type: oracledb.NUMBER}},{ autoCommit: true });
    }catch(err){
      console.log("error: ", err);
    }
    finally{
      //console.log("LOG Insert: ", ret_insert_order);
      id_order = ret_insert_order.outBinds.return_id[0];
    }
  }
  else{
    id_order=data_verify; 
  }
    //console.log(ret_produto.outBinds.return_id[0]);
    //console.log(newCalcado.calcado);
  try{    
    var ret_item_order = await dbConn.execute("INSERT INTO ITEM_ORDER (ID_ORDER,ID_PRODUTO,QUANT,ID_ITEM,CATEGORY) VALUES (:1,:2,:3,:4,:5) returning ID into :return_id",{1:id_order,2:idProduct,3:quant,4:id_item,5:"CALCA",return_id:{
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }},{ autoCommit: true });
  }
  catch(err) {
      console.log("error: ", err);
      result(err, null);
  }finally{
      console.log(ret_item_order);
      result(null, ret_item_order.outBinds.return_id[0]);
  }

};

Calca.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret_produto = await dbConn.execute("SELECT ID_PRODUTO FROM CALCA WHERE id = :id", [id]);
    var ret_del_produto = await dbConn.execute("DELETE FROM PRODUTO WHERE id = :id", [ret_produto.rows[0][0]],{ autoCommit: true });
    var ret_del_calca = await dbConn.execute("DELETE FROM CALCA WHERE id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret_del_calca);
    result(null, ret_del_calca);
  }
};

Calca.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCA INNER JOIN PRODUTO ON CALCA.ID_PRODUTO = PRODUTO.ID WHERE CALCA.id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret.rows[0]);
  }
};

Calca.findByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCA INNER JOIN PRODUTO ON CALCA.ID_PRODUTO = PRODUTO.ID JOIN SHOP ON PRODUTO.ID_SHOP = SHOP.SHOP_ID WHERE SHOP.SHOP_ID = :id", [id]);
    console.log(ret);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Calca.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCA INNER JOIN PRODUTO ON CALCA.ID_PRODUTO = PRODUTO.ID");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Calca.update = async function(id, calca, result){
  var dbConn = await checkConnection();
  try{
    var ret_calca = await dbConn.execute("UPDATE CALCA SET DATE_MODEL=:1,SIZE_CALCA=:2,CATEGORIE=:3,MATERIAL=:4,COLOR=:5,GENDER=:6 WHERE id = :7", {1:calca.date_model, 2:calca.size,3:calca.categorie,4:calca.material,5:calca.color,6:calca.gender,7:id},{ autoCommit: true });
    var id_produto = await dbConn.execute("SELECT ID_PRODUTO FROM CALCA WHERE ID = :id",[id]);
    //console.log(id_produto.rows[0][0]);
    var ret_produto = await dbConn.execute("UPDATE PRODUTO SET NAME=:1,PRICE=:2,BRAND=:3 WHERE id = :4", {1:calca.name, 2:calca.price,3:calca.brand,4:id_produto.rows[0][0]},{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret_calca);
  }
};

module.exports= Calca;