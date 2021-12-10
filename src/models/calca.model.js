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