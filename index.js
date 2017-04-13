var gulp = require('gulp');
var sass = require('gulp-sass');
var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var archieml = require('archieml');
var parsed = archieml.load('key: value');
var fs = require('fs');

var navEnglish = ["The Real Queens", "Damian y Dorian", "Across the Harbor", "Viva la Familia", "Revolution on Wheels", "About"];
var navSpanish = ["Las reinas reales", "Damian y Dorian", "Cruzando el puerto", "Viva la familia", "Revolución sobre ruedas", "Sobre nosotros"];


var usingHeroku = false;

if (usingHeroku){
  app.set('port', (process.env.PORT || 5000));

} else {
  var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
  var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
  app.set('port', (server_port || 8080));
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
  response.render('pages/index', {navEng: navEnglish, navSpan: navSpanish, page: 'index', espanol: isEspanol(request)});
});

app.get('/about', function(request, response){
  var teamData = JSON.parse(fs.readFileSync('./public/data/team.json'));
  bodyData = JSON.parse(fs.readFileSync('./public/data/about.json'));
  response.render('pages/about', {navEng: navEnglish, navSpan: navSpanish, body: bodyData, team: teamData, page: 'about', espanol: isEspanol(request)});
});

app.get('/pages/:id', function(req, res){
  var pageName = req.params.id;
  var bodyData;
  var internetData;

  //Lindsay's interactive data
  internetData = JSON.parse(fs.readFileSync('./public/data/internet.json'));

  if (isEspanol(req)){
    bodyData = JSON.parse(fs.readFileSync('./public/data/' + pageName + 'espanol.json'));
  } else {
    bodyData = JSON.parse(fs.readFileSync('./public/data/' + pageName + '.json'));
  }
    res.render('pages/inner', {navEng: navEnglish, navSpan: navSpanish, internet: internetData, body: bodyData, page: '/pages/' + pageName, espanol: isEspanol(req)});
});

app.get('*', function(request, response){
  response.render('pages/404', {page: '404', espanol: isEspanol(request)});
});

var isEspanol = function(req){
	return req.query.lang && req.query.lang == "es";
};
