var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8080;

var sqlpool = mysql.createPool({
	host: 'localhost',
	user: 'panadulek',
	password: 'wahL8ohG8co2pee2',
	database: 'Instagramsql',
	connectionLimit: 100,
	debug: false
});

app.post('/login', (req, res) => {
	var email = req.body.email;
	var pass = req.body.password;
	console.log("Logowanie: " + email + " - " + pass);
	var sql = "SELECT * FROM Uzytkownik WHERE haslo LIKE '" + pass + "' AND email LIKE '" + email + "';";
	sqlpool.query(sql, (err, rows, fields) => {
		if (err)
			res.json({'status': 'ERR', 'errorId': 1})
		else if (rows.length > 0)
			res.json({'status': 'OK'});
		else
			res.json({'status': 'ERR', 'errorId': 2});
	});
});
app.post('/register', (req, res) => {
	var email = req.body.email;
	var pass = req.body.password;
	var username = req.body.username;
	console.log("Email: " + email + " Password: " + pass + " Username: " + username);
	var sql = "SELECT * FROM Uzytkownik WHERE login LIKE ? or email LIKE ?";
	sqlpool.query(sql, [username, pass], (err, rows, fields) => {
		if(err)
			res.json({'status': 'ERR', 'errorId': 1});
		else if (rows.length == 0)
		{
			sql = "INSERT INTO Uzytkownik (login, haslo, email) VALUES (?, ?, ?)";
			sqlpool.query(sql, [username, pass, email], (err, rows, fields) =>{
				if(err)
					res.json({'status': 'ERR', 'errorId': 5});
				else
					res.json({'status': 'OK'});
			});

		}

		else
			res.json({'status': 'ERR', 'errorId': 4}); 
	});
});
app.listen(port, () => {});
