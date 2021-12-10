'use strict';
const oracledb = require('oracledb');

//oracledb.initOracleClient({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantclient-basic-windows.x64-21.3.0.0.0\\instantclient_21_3' });
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
var Shop = function(shop){
  this.name = shop.name;
  this.city = shop.city;
  this.local_name  = shop.local_name;
  this.vetor = {1:this.name, 2:this.city,3:this.local_name}
};
Shop.create = async function (newShop, result) {
    var dbConn = await checkConnection();
    try{
        var ret = await dbConn.execute("INSERT INTO SHOP (NAME,CITY,LOCAL_NAME) VALUES (:1,:2,:3)", newShop.vetor,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret);
        result(null, ret);
    }
};


Shop.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("DELETE FROM SHOP WHERE shop_id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret);
  }
};

Shop.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM SHOP WHERE shop_id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows[0]);
  }
};

Shop.findByIdUser = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT SHOP.* FROM SHOP INNER JOIN USERS ON SHOP.SHOP_ID = USERS.ID_LOJA WHERE USERS.id = :id", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows[0]);
  }
};

Shop.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM SHOP");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Shop.update = async function(id, shop, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("UPDATE SHOP SET name=:1,city=:2,local_name=:3 WHERE shop_id = :4", [shop.name,shop.city,shop.local_name,id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

module.exports= Shop;