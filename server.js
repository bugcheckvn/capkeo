
var express = require('express');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var Field = require('./field.js');

mongoose.connect('mongodb://tiendat:attack1234@ds051943.mongolab.com:51943/capkeodb');

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static('public'));

//app.get('/', function (request, response) {
//    response.sendFile('Index.html');
//});

app.route('/fields')
    .post(function (request, response) {
        console.log(request.body.lat + '\t' + request.body.lng);
        var field = new Field({
            loc: { type: 'Point', coordinates: [request.body.lng, request.body.lat] },
            name: request.body.name,
            phone: request.body.phone,
            addr: request.body.addr,
            san5: request.body.soSan5,
            san7: request.body.soSan7,
            san11: request.body.soSan11
        });
        field.save(function (err) {
            if (err) {
                response.status(500).json({ success:false, message: 'Server Error. Please try again!' });
            }
            else {
                response.json({ success: true, message: 'Saved!' });
            }
        });
    });

app.get('/search', function (request, response) {
    console.log(request.url);    
    var limit = 7, // 10 item 
        maxDistance = parseFloat(request.query.maxdistance); // 3 km
    console.log(request.query.lng + '\t' + request.query.lat + '\t' + maxDistance);
    /*
    Field.find({}, function (err, locations) {
        if (err) {
            console.log(err);
            response.status(500).json({ success: false, message: 'Server Error. Please try again!' });
        }
        else { response.json({ success: true, fields: locations }); }
    });
    */
    
    Field.find({
        loc: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [request.query.lng, request.query.lat]
                },
                $maxDistance: maxDistance
            }
        }
    }).limit(limit).exec(function (err, locations) {
        if (err) {
            console.log(err);
            response.status(500).json({ success: false, message: 'Server Error. Please try again!' });
        }
        else {
            var locs = [];
            locations.forEach(function (loc) {
                locs.push({ name: loc.name, phone: loc.phone, addr: loc.addr, lat: loc.loc.coordinates[1], lng: loc.loc.coordinates[0] });
            });
            response.json({ success: true, fields: locs });
        }
    });
    
});

/*
app.get('/removeall', function (request, response) {
    Field.remove({}, function (err) {
        if (err)
            response.send(err);
        else
            response.send('done');
    });    
});
*/

app.listen(3000, function () {
    /*
    fs.readFile('./samples.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var locations = JSON.parse(data.trim());
            locations.data.forEach(function (item) {
                var field = new Field({
                    loc: { type: 'Point', coordinates: [item.lng, item.lat] },
                    name: item.name,
                    phone: item.phone
                });
                field.save(function (err) {
                    if (err)
                        console.log(item + "\n+++ Error:" + err);
                });
            });
        }
    });
    */
    //Field.remove({}, function (err) { console.log(err); });
    console.log('server listening on port 3000');
});