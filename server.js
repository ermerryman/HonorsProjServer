var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var nodemailer = require('nodemailer');
var nodemailerSMTPtransport = require('nodemailer-smtp-transport');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer = require('multer');

var app = express();

var mongoUrl = "mongodb://localhost/gymapp";

mongoose.connect(mongoUrl, {useMongoClient: true});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use('/', express.static(__dirname));
app.use('/images', express.static(path.join(__dirname,'/images')));

require('./routes.js')(app);

app.listen(3000, function(){
	console.log('Application listening on port 3000');
})
