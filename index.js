var express = require("express");
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3');
var app = express();

var port = process.env.PORT || 1284;

var db = new sqlite3.Database('attendance.db');
db.serialize(function() {

  db.run("CREATE TABLE IF NOT EXISTS attend (id INTEGER PRIMARY KEY, name TEXT, date TEXT)");

  app.post('/attend', (req, res) => {
  	var date = new Date().toLocaleDateString();
  	db.get("SELECT id, name, date FROM attend WHERE date='"+date+"' and name='"+req.query.name.toLowerCase()+"'", function(err, row) {
    	res.send(!row ? db.run("INSERT INTO attend (name, date) VALUES ('"+ req.query.name.toLowerCase() +"', '"+date+"')") : 'false');
  	});
  });

  app.get('/attended', (req, res) => {
  	var date = new Date().toLocaleDateString();
  	db.get("SELECT id, name, date FROM attend WHERE date='"+date+"' and name='"+req.query.name.toLowerCase()+"'", function(err, row) {
  		console.log(err, row);
    	res.send(!row ? 'false' : 'true');
  	});
  });

  app.get('/attendance', (req, res) => {
  	db.all("SELECT id, name, date FROM attend", function(err, row) {
  		console.log(err, row);
    	res.send(row);
  	});
  });

  app.get('/attendance/today', (req, res) => {
  	var date = new Date().toLocaleDateString();
  	db.all("SELECT id, name, date FROM attend WHERE date='"+date+"'", function(err, row) {
  		console.log(err, row);
    	res.send(row);
  	});
  });


	app.use('/app', express.static(path.join(__dirname, 'app')));

	app.listen(port, () => console.log('port at '+port));
});
