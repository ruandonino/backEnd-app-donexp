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
var Client = function(client){
  this.name = client.name;
  this.categorie  = client.categorie;
  this.whats_app  = client.whats_app;
  this.age  = client.age;
  this.profession  = client.profession;
  this.city = client.city;
  this.email  = client.email;
  this.id_shop  = client.id_shop;
  this.vetor = {1:this.name, 2:this.categorie,3:this.whats_app,4:this.age,5:this.profession,6:this.city,7:this.email,8:this.id_shop}
};
Client.create = async function (newClient, result) {
    var dbConn = await checkConnection();
    try{
        var ret = await dbConn.execute("INSERT INTO CLIENT (NAME,CATEGORIE,WHATS_APP,AGE,PROFESSION,CITY,EMAIL,ID_SHOP) VALUES (:1,:2,:3,:4,:5,:6,:7,:8)", newClient.vetor,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret);
        result(null, ret);
    }
};


Client.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("DELETE FROM CLIENT WHERE id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret);
  }
};

Client.infoById = async function (id, result) {
  var dbConn = await checkConnection();
  var totalValue =0;
  var ticketMedio =0;
  try{
    var ret = await dbConn.execute("SELECT * FROM ORDER_ WHERE client_id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    if(ret.rows.length >0){
      //console.log("maior que 0");
      for (let i in ret.rows) {
        //console.log(ret.rows[i]);
        totalValue = totalValue + ret.rows[i][1];
      }
      ticketMedio = totalValue/ret.rows.length;
      //console.log("ticket medio");
      //console.log(ticketMedio);
    }
    //result(null, ticketMedio);
  }
  try{
    var ret_media_prods = await dbConn.execute("SELECT * FROM ORDER_ INNER JOIN ITEM_ORDER ON ORDER_.ID=ITEM_ORDER.ID_ORDER WHERE client_id = :id ", [id]);
  }catch(err){
    console.log("error: ", err);
    result(err, null);
  }finally{
    let dict_order_quant = new Object();
    if(ret_media_prods.rows.length >0){
      console.log("busca quant");
      
      for (let i in ret_media_prods.rows) {
        if(!(ret_media_prods.rows[i][0] in dict_order_quant)){
          dict_order_quant[ret_media_prods.rows[i][0]] =0;
          for (let j in ret_media_prods.rows) {
            console.log(ret_media_prods.rows[i]);
            if(ret_media_prods.rows[i][0] == ret_media_prods.rows[j][0]){
              dict_order_quant[ret_media_prods.rows[i][0]] = dict_order_quant[ret_media_prods.rows[i][0]] + ret_media_prods[j][8];
            }
          }
        }    
      }
      console.log(dict_order_quant);
      
      //ticketMedio = totalValue/ret.rows.length;
      //console.log("ticket medio");
      //console.log(ticketMedio);
    }
    result(null, ret_media_prods.rows); 
  }
};

Client.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CLIENT WHERE id = :id", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret.rows[0]);
  }
};

Client.findByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT CLIENT.* FROM CLIENT INNER JOIN SHOP ON SHOP.SHOP_ID = CLIENT.ID_SHOP WHERE CLIENT.ID_SHOP = :id", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Client.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CLIENT");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Client.update = async function(id, client, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("UPDATE CLIENT SET NAME=:1,CATEGORIE=:2,WHATS_APP=:3,AGE=:4,PROFESSION=:5,CITY=:6,EMAIL=:7,ID_SHOP=:8 WHERE id = :9", {1:client.name, 2:client.categorie,3:client.whats_app,4:client.age,5:client.profession,6:client.city,7:client.email,8:client.id_shop,9:id},{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

module.exports= Client;