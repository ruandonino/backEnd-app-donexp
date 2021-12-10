'use strict';
const oracledb = require('oracledb');

//oracledb.initOraclecamiseta({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantcamiseta-basic-windows.x64-21.3.0.0.0\\instantcamiseta_21_3' });
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
var Camiseta = function(camiseta){
  this.name = camiseta.name;
  this.price = camiseta.price;
  this.brand = camiseta.brand;
  this.id_shop  = camiseta.id_shop;
  this.date_model = camiseta.date_model;
  this.size = camiseta.size_camiseta;
  this.categorie  = camiseta.categorie;
  this.material  = camiseta.material;
  this.color  = camiseta.color;
  this.gender  = camiseta.gender;
  //this.id_produto = camiseta.id_produto;
  this.produto = {1:this.name, 2:this.price,3:this.brand,4:this.id_shop,return_id:{
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }};
  this.camiseta = {1:this.date_model, 2:this.size,3:this.categorie,4:this.material,5:this.color,6:this.gender,7:17}
};
Camiseta.create = async function (newcamiseta, result) {
    var dbConn = await checkConnection();
    try{
        var ret_produto = await dbConn.execute("INSERT INTO PRODUTO (NAME,PRICE,BRAND,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", newcamiseta.produto,{ autoCommit: true });
        newcamiseta.camiseta[7] = ret_produto.outBinds.return_id[0];
        //console.log(ret_produto.outBinds.return_id[0]);
        //console.log(newcamiseta.camiseta);
        var ret_camiseta = await dbConn.execute("INSERT INTO camiseta (DATE_MODEL,SIZE_CAMISETA,CATEGORIE,MATERIAL,COLOR,GENDER,ID_PRODUTO) VALUES (:1,:2,:3,:4,:5,:6,:7)", newcamiseta.camiseta,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret_camiseta);
        result(null, ret_camiseta);
    }
};


Camiseta.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret_produto = await dbConn.execute("SELECT ID_PRODUTO FROM camiseta WHERE id = :id", [id]);
    var ret_del_produto = await dbConn.execute("DELETE FROM PRODUTO WHERE id = :id", [ret_produto.rows[0][0]],{ autoCommit: true });
    var ret_del_camiseta = await dbConn.execute("DELETE FROM camiseta WHERE id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret_del_camiseta);
    result(null, ret_del_camiseta);
  }
};

Camiseta.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM camiseta INNER JOIN PRODUTO ON camiseta.ID_PRODUTO = PRODUTO.ID WHERE camiseta.id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret.rows[0]);
  }
};

Camiseta.findByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT CAMISETA.*,PRODUTO.* FROM camiseta INNER JOIN PRODUTO ON camiseta.ID_PRODUTO = PRODUTO.ID JOIN SHOP ON PRODUTO.ID_SHOP = SHOP.SHOP_ID WHERE SHOP.SHOP_ID = :id", [id]);
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

Camiseta.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM camiseta INNER JOIN PRODUTO ON camiseta.ID_PRODUTO = PRODUTO.ID");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Camiseta.update = async function(id, camiseta, result){
  var dbConn = await checkConnection();
  try{
    var ret_camiseta = await dbConn.execute("UPDATE camiseta SET DATE_MODEL=:1,SIZE_CAMISETA=:2,CATEGORIE=:3,MATERIAL=:4,COLOR=:5,GENDER=:6 WHERE id = :7", {1:camiseta.date_model, 2:camiseta.size,3:camiseta.categorie,4:camiseta.material,5:camiseta.color,6:camiseta.gender,7:id},{ autoCommit: true });
    var id_produto = await dbConn.execute("SELECT ID_PRODUTO FROM camiseta WHERE ID = :id",[id]);
    //console.log(id_produto.rows[0][0]);
    var ret_produto = await dbConn.execute("UPDATE PRODUTO SET NAME=:1,PRICE=:2,BRAND=:3 WHERE id = :4", {1:camiseta.name, 2:camiseta.price,3:camiseta.brand,4:id_produto.rows[0][0]},{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret_camiseta);
  }
};

module.exports= Camiseta;