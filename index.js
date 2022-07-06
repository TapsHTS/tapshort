//un server epxress pour raccourcir des urls et les stockers dans une base de donnée mysql
//le serveur est lancé sur le port 8989

var { create, remove, request } = require('./logger');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});
var port = 8989;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/favicon.ico', function(req, res) {
    res.send('');
});

app.get('/', function (req, res) {
  //utiliser le fichier index.html pour afficher le formulaire de saisie
    res.sendFile(__dirname + '/index.html');
})

app.get('/:shorturl', function (req, res) {
  var shorturl = req.params.shorturl;
  //regarder si le shorturl existe dans la base de donnée
    connection.query('SELECT * FROM url WHERE shorturl = ?', [shorturl], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            //si le shorturl existe, renvoyer le lien long
            request(`${req.ip} -> ${shorturl}`);
            res.redirect(results[0].url);
        } else {
            //si le shorturl n'existe pas, renvoyer une erreur
            res.status(404).send(JSON.stringify({ error: 'Shorturl not found' }));
        }
    });
})

app.post('/', function (req, res) {
  var url = req.body.url;
  var shorturl = Math.floor(Math.random() * 1000000);
  //si l'url est vide, renvoyer une erreur
    if (url == '') {
        res.status(400).send(JSON.stringify({ error: 'Url is empty' }));
    }
    //si le shorturl existe deja, on en crée un nouveau
  connection.query('INSERT INTO url (url, shorturl) VALUES (?, ?)', [url, shorturl], function (error, results, fields) {
    create('Shorturl ' + shorturl + ' ajouté');
    if (error) throw error;
    res.send(JSON.stringify({ shorturl: shorturl }));
  }
  );
})

app.delete('/:shorturl', function (req, res) {
    var shorturl = req.params.shorturl;
    //verifier si le shorturl existe
    connection.query('SELECT * FROM url WHERE shorturl = ?', [shorturl], function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) {
            res.status(404).send(JSON.stringify({ error: 'Shorturl not found' }));
        } else {
        connection.query('DELETE FROM url WHERE shorturl = ?', [shorturl], function (error, results, fields) {
        remove('Shorturl ' + shorturl + ' supprimé');
        if (error) throw error;
        res.send(JSON.stringify({ shorturl: shorturl, remove: true }));
    });
    }
    })
})

app.listen(port, function () {
    console.log(`app listening on port ${port}!`);
});