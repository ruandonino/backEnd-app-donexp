'use strict';
const oracledb = require('oracledb');
const Shop = require('./shop.model');

//oracledb.initOracleClient({ libDir: '..\\..\\instantclient_21_4' });
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
var User = function(user){
  this.name = user.name;
  this.email = user.email;
  this.id_loja = user.id_loja;
  this.position  = user.position;
  this.vetor = {1:this.name, 2:this.email,3:this.id_loja, 4:this.position}
};
User.create = async function (newUser, result) {
    var dbConn = await checkConnection();
    try{
        console.log(newUser)
        var ret = await dbConn.execute("INSERT INTO USERS (NAME,EMAIL,ID_LOJA,POSITION) VALUES (:1,:2,:3,:4)", newUser.vetor,{ autoCommit: true });
    }
    catch(err) {
        console.log("error: ", err);
        result(err, null);
    }finally{
        console.log(ret);
        result(null, ret);
    }
};


User.delete = async function(id, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("DELETE FROM USERS WHERE id = :id", [id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    console.log(ret);
    result(null, ret);
  }
};

User.findById = async function (id, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM USERS WHERE id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows[0]);
  }
};

User.addUserAndShopById = async function (id,newUser, result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM USERS WHERE id = :id ", [id]);
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    //result(null, ret.rows[0]);
    if(length(ret.rows[0])==0){
      shop_id = Shop.create({'name':newUser.name,'city':'','local_name':''});
      newUser['id_loja'] = shop_id;
      result_user = User.create(newUser);
    }
    else{
      result(null, ret.rows[0]);
    }
  }
};

User.findAll = async function (result) {
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("SELECT * FROM USERS");
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};

User.update = async function(id, user, result){
  var dbConn = await checkConnection();
  try{
    var ret = await dbConn.execute("UPDATE USERS SET name=:1,id_loja=:2,position=:3,email=:4 WHERE id = :5", [user.name,user.id_loja,user.position,user.email, id],{ autoCommit: true });
  }
  catch(err) {
    console.log("error: ", err);
    result(err, null);
  }finally{
    //console.log(ret);
    result(null, ret.rows);
  }
};
/*
Employee.findById = function (id, result) {
dbConn.query("Select * from employees where id = ? ", id, function (err, res) {
if(err) {
  console.log("error: ", err);
  result(err, null);
}
else{
  result(null, res);
}
});
};
Employee.findAll = function (result) {
dbConn.query("Select * from employees", function (err, res) {
if(err) {
  console.log("error: ", err);
  result(null, err);
}
else{
  console.log('employees : ', res);
  result(null, res);
}
});
};
Employee.update = function(id, employee, result){
dbConn.query("UPDATE employees SET first_name=?,last_name=?,email=?,phone=?,organization=?,designation=?,salary=? WHERE id = ?", [employee.first_name,employee.last_name,employee.email,employee.phone,employee.organization,employee.designation,employee.salary, id], function (err, res) {
if(err) {
  console.log("error: ", err);
  result(null, err);
}else{
  result(null, res);
}
});
};
Employee.delete = function(id, result){
dbConn.query("DELETE FROM employees WHERE id = ?", [id], function (err, res) {
if(err) {
  console.log("error: ", err);
  result(null, err);
}
else{
  result(null, res);
}
});
};
*/
module.exports= User;