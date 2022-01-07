'use strict';
const oracledb = require('oracledb');

//oracledb.initOraclecalcado({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantcalcado-basic-windows.x64-21.3.0.0.0\\instantcalcado_21_3' });
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
var Calcado = function(calcado){
  this.name = calcado.name;
  this.price = calcado.price;
  this.brand = calcado.brand;
  this.date_model = calcado.date_model;
  this.size = calcado.size;
  this.categorie  = calcado.categorie;
  this.material  = calcado.material;
  this.color  = calcado.color;
  this.gender  = calcado.gender;
  this.id_shop  = calcado.id_shop;
  this.prod = calcado.produto
  //this.id_produto = calcado.id_produto;
  this.produto = {1:this.name, 2:this.price,3:this.brand,4:this.id_shop,return_id:{
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }};
  this.calcado = {1:this.date_model, 2:this.size,3:this.categorie,4:this.material,5:this.color,6:this.gender,7:17}
};
Calcado.create = async function (newCalcado,result) {
    var dbConn = await checkConnection();
    console.log("INIT")
    var data_verify;
    try{
        var ret_verify_prod = await dbConn.execute("SELECT ID FROM PRODUTO WHERE NAME = :1 AND BRAND = :2 AND ID_SHOP = :3", {1:newCalcado.produto[1],2:newCalcado.produto[3],3:newCalcado.produto[4]});
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
        var ret_produto = await dbConn.execute("INSERT INTO PRODUTO (NAME,PRICE,BRAND,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", newCalcado.produto,{ autoCommit: true });
      }catch{
        console.log("error: ", err);
      }
      finally{
        newCalcado.calcado[7] = ret_produto.outBinds.return_id[0];
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
      newCalcado.calcado[7]=data_verify; 
    }
      //console.log(ret_produto.outBinds.return_id[0]);
      //console.log(newCalcado.calcado);
    try{    
      var ret_calcado = await dbConn.execute("INSERT INTO CALCADO (DATE_MODEL,SIZE_CAL,CATEGORIE,MATERIAL,COLOR,GENDER,ID_PRODUTO) VALUES (:1,:2,:3,:4,:5,:6,:7)", newCalcado.calcado,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret_calcado);
        result(null, ret_calcado);
    }
};


Calcado.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret_produto = await dbConn.execute("SELECT ID_PRODUTO FROM CALCADO WHERE id = :id", [id]);
    var ret_del_produto = await dbConn.execute("DELETE FROM PRODUTO WHERE id = :id", [ret_produto.rows[0][0]],{ autoCommit: true });
    var ret_del_calcado = await dbConn.execute("DELETE FROM CALCADO WHERE id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret_del_calcado);
    result(null, ret_del_calcado);
  }
};

Calcado.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCADO INNER JOIN PRODUTO ON CALCADO.ID_PRODUTO = PRODUTO.ID WHERE CALCADO.id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret.rows[0]);
  }
};

Calcado.findByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCADO INNER JOIN PRODUTO ON CALCADO.ID_PRODUTO = PRODUTO.ID JOIN SHOP ON PRODUTO.ID_SHOP = SHOP.SHOP_ID WHERE SHOP.SHOP_ID = :id", [id]);
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

Calcado.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM CALCADO INNER JOIN PRODUTO ON CALCADO.ID_PRODUTO = PRODUTO.ID");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Calcado.update = async function(id, calcado, result){
  var dbConn = await checkConnection();
  try{
    var ret_calcado = await dbConn.execute("UPDATE CALCADO SET DATE_MODEL=:1,SIZE_CAL=:2,CATEGORIE=:3,MATERIAL=:4,COLOR=:5,GENDER=:6 WHERE id = :7", {1:calcado.date_model, 2:calcado.size,3:calcado.categorie,4:calcado.material,5:calcado.color,6:calcado.gender,7:id},{ autoCommit: true });
    var id_produto = await dbConn.execute("SELECT ID_PRODUTO FROM CALCADO WHERE ID = :id",[id]);
    //console.log(id_produto.rows[0][0]);
    var ret_produto = await dbConn.execute("UPDATE PRODUTO SET NAME=:1,PRICE=:2,BRAND=:3 WHERE id = :4", {1:calcado.name, 2:calcado.price,3:calcado.brand,4:id_produto.rows[0][0]},{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret_calcado);
  }
};

module.exports= Calcado;