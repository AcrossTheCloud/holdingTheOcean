var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Q = require('q');
var path = require("path");

var app = express();
var mailer = require('./lib/mailer');

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(__dirname + "/public/assets"));
app.use(express.static(__dirname + "/public/scripts"));
app.use(express.static(__dirname + "/public/views"));


app.get('/', function(req, res){
	res.sendFile('/index.html');
});

var router = express.Router();

app.use('/subscribe', router);
router.post('/', mailer.saveEmail);

app.listen(3434, () => console.log('listening on 3434 '))
