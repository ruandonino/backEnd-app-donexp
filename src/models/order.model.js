'use strict';
const oracledb = require('oracledb');

//oracledb.initOracleorder({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantorder-basic-windows.x64-21.3.0.0.0\\instantorder_21_3' });
// hr schema password
var password = "231295Don**banco";
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

async function Calc_ValorTotal(vetProdutos){
  var vetPrice=[];
  var totalValue=0;
  var dbConn = await checkConnection();

  for (const [id, quant] of Object.entries(vetProdutos)) {
    try{
      var ret = await dbConn.execute("SELECT PRICE FROM PRODUTO WHERE PRODUTO.id = :id ", [id]);
    }
    catch(err) {
      console.log("error: ", err);
      result(err, null);
    }finally{
      console.log(ret);
      totalValue = totalValue + ret.rows[0][0]*quant;
    }
  }
  return totalValue;
}

//Employee object create
var Order = function(order){
  console.log(order.produtos);
  this.client_id = order.client_id;
  this.date = order.date;
  this.id_order  = 0;
  this.produtos = order.produtos;
  this.valor_total = 0;
  this.id_shop = order.id_shop;

  this.order = {1:this.client_id, 2:this.date,3:this.valor_total,return_id:{
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }};


  this.order = {1:this.client_id, 2:this.date,3:this.valor_total,4:this.id_shop,return_id:{
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }};
};
Order.create = async function (newOrder, result) {
    var dbConn = await checkConnection();

    newOrder.valor_total = await Calc_ValorTotal(newOrder.produtos);
    newOrder.order[3] = newOrder.valor_total;
    //console.log(newOrder.order);
    try{
        var ret_order_id = await dbConn.execute("INSERT INTO ORDER_ (CLIENT_ID,DATE_,TOTAL_VALUE,ID_SHOP) VALUES (:1,:2,:3,:4) returning ID into :return_id", newOrder.order,{ autoCommit: true });
        newOrder.id_order = ret_order_id.outBinds.return_id[0];
        //console.log(ret_produto.outBinds.return_id[0]);
        //console.log(neworder.order);
        
        for (const [id, quant] of Object.entries(newOrder.produtos)) {
          try{
            var ret = await dbConn.execute("INSERT INTO ITEM_ORDER (ID_ORDER,ID_PRODUTO,QUANT) VALUES (:1,:2,:3)",{1:newOrder.id_order,2:id,3:quant},{ autoCommit: true });
          }
          catch(err) {
            console.log("error: ", err);
            result(err, null);
          }finally{
            console.log(ret);
          }
        } 
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret_order_id);
        result(null, ret_order_id);
    }
};


Order.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret_del_item = await dbConn.execute("DELETE FROM ITEM_ORDER WHERE ID_ORDER = :id", [id],{ autoCommit: true });
    var ret_del_order = await dbConn.execute("DELETE FROM ORDER_ WHERE ID = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret_del_order);
    result(null, ret_del_order);
  }
};

Order.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM ORDER_ INNER JOIN ITEM_ORDER ON ORDER_.ID = ITEM_ORDER.ID_ORDER JOIN PRODUTO ON PRODUTO.ID = ITEM_ORDER.ID_PRODUTO WHERE ORDER_.id = :id", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret.rows);
  }
};

Order.findByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  //var categories_prod = ['CALCADO','CALCA','CAMISETA'];
  try{
    var ret = await dbConn.execute("SELECT CLIENT.ID,CLIENT.AGE,CLIENT.PROFESSION,CLIENT.CITY,ITEM_ORDER.*,ORDER_.*,PRODUTO.* FROM ORDER_ INNER JOIN ITEM_ORDER ON ORDER_.ID = ITEM_ORDER.ID_ORDER JOIN CLIENT ON ORDER_.CLIENT_ID = CLIENT.ID JOIN PRODUTO ON PRODUTO.ID = ITEM_ORDER.ID_PRODUTO JOIN SHOP ON PRODUTO.ID_SHOP = SHOP.SHOP_ID WHERE SHOP.SHOP_ID = :id", [id]);
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

Order.listOrderByIdShop = async function (id, result) {
  var dbConn = await checkConnection();
  //var categories_prod = ['CALCADO','CALCA','CAMISETA'];
  try{
    var ret = await dbConn.execute("SELECT * FROM ORDER_ INNER JOIN CLIENT ON ORDER_.CLIENT_ID = CLIENT.ID WHERE ORDER_.ID_SHOP = :id", [id]);
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

Order.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM ORDER_ INNER JOIN ITEM_ORDER ON ORDER_.ID = ITEM_ORDER.ID_ORDER JOIN PRODUTO ON PRODUTO.ID = ITEM_ORDER.ID_PRODUTO JOIN CALCADO ON PRODUTO.ID = CALCADO.ID_PRODUTO JOIN CALCA ON PRODUTO.ID = CALCA.ID_PRODUTO JOIN CAMISETA ON PRODUTO.ID = CAMISETA.ID_PRODUTO");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

Order.update = async function(id, order, result){
  var dbConn = await checkConnection();
  try{
    var ret_order = await dbConn.execute("UPDATE ORDER_ SET CLIENT_ID=:1,DATE_=:2,TOTAL_VALUE=:3 WHERE id = :4", {1:order.client_id, 2:order.date,3:order.valor_total,4:id},{ autoCommit: true });
    //var ret_item_order = await dbConn.execute("UPDATE ITEM_ORDER SET ID_PRODUTO=:1,QUANT=:2 WHERE ID_ORDER = :4", {1:this.client_id, 2:this.date,3:this.valor_total,4:id},{ autoCommit: true });
    //var id_produto = await dbConn.execute("SELECT ID_PRODUTO FROM order WHERE ID = :id",[id]);
    //console.log(id_produto.rows[0][0]);
    //var ret_item_order = await dbConn.execute("UPDATE PRODUTO SET NAME=:1,PRICE=:2,BRAND=:3 WHERE id = :4", {1:order.name, 2:order.price,3:order.brand,4:id_produto.rows[0][0]},{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret_order);
  }
};

module.exports= Order;