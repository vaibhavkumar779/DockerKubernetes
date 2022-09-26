var express = require('express');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "main.html"));
});

app.get('/get-profile', function (req, res) {
    var response = res;
    // Connect to the db
    MongoClient.connect('mongodb://admin:password@localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;

        var db = client.db('user-account');
        var query = { userid: 1 };
        db.collection('users').findOne(query, function (err, result) {
            if (err) throw err;
            client.close();
            response.send(result);
        });
    });
});

app.post('/update-profile', function (req, res) {
    var userObj = req.body;
    var response = res;

    console.log('connecting to the db....');

    MongoClient.connect('mongodb://admin:password@localhost:27017',{ useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;

        var db = client.db('user-account');
        userObj['userid'] = 1;
        var query = { userid: 1 };
        var newvalues = { $set: userObj };

        console.log('successfully connected to user-account db');

        db.collection("users").updateOne(query, newvalues, { upsert: true }, function (err, res) {
            if (err) throw err;
            console.log('successfully updated or inserted data');
            client.close();
            response.send(userObj);
        });
    });
});

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.listen(9977, function () {
    console.log("application listening on port 9977!");
});