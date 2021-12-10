const express = require('express')
const oracledb = require('oracledb');
const app = express();
const port = 3000;
const password = "231295Don**banco";
oracledb.initOracleClient({ libDir: 'C:\\Users\\Donruan\\Documents\\Projeto Smarex\\back-end-AI\\instantclient-basic-windows.x64-21.3.0.0.0\\instantclient_21_3' });

async function selectAllUsers(req, res) {
  try {
    connection = await oracledb.getConnection({ user: "ADMIN", password: password, connectionString: "donexp_high" });
    // run query to get all employees
    result = await connection.execute(`SELECT * FROM USERS`);
    console.log(connection)

  } catch (err) {
    //send error message
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('query send no rows');
    } else {
      //send all employees
      return res.send(result.rows);
    }

  }
}

//get /employess
app.get('/users', function (req, res) {
  selectAllUsers(req, res);
})

async function selectUsersById(req, res, id) {
  try {
    connection = await oracledb.getConnection({ user: "ADMIN", password: password, connectionString: "donexp_high" });
    // run query to get employee with employee_id
    result = await connection.execute(`SELECT * FROM USERS where id=:id`, [id]);

  } catch (err) {
    //send error message
    return res.send(err.message);
  } 
  if (result.rows.length == 0) {
    //query return zero employees
    return res.send('query send no rows');
  } else {
    //send all employees
    return res.send(result.rows);
    }
}

//get /employee?id=<id employee>
app.get('/user', function (req, res) {
  //get query param ?id
  let id = req.query.id;
  // id param if it is number
  if (isNaN(id)) {
    res.send('Query param id is not number')
    return
  }
  selectUsersById(req, res, id);
})

app.listen(port, () => console.log("nodeOracleRestApi app listening on port %s!", port))