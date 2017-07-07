var fs = require('fs');
var mysql = require('mysql');
var express = require('express');

var app = express();

var pool = mysql.createPool({
    host: 'server.raystar.kro.kr',
    port: 7492,
    user: 'root',
    password: 'dayss365',
    database: 'ShopingManiac'
})


executeQuery('/discountinfo', 'CALL DiscountInfo', {discountInfo : {}});
executeQuery('/beacon', 'CALL Beacon', {beacon : {}});

function executeQuery(url, queryString, resultToSend) {
    app.get(url, function (req, res) {
        pool.getConnection((err, con) => {
            con.query(queryString, (err, queryres, field) => {
                console.log(Object.keys(queryres));
                var key = Object.keys(resultToSend)[0];
                resultToSend[key] = queryres[0];
                res.send(resultToSend);
                console.log(resultToSend);
            })
        })
    });
}

app.listen(3030, function () {
    console.log('Server is Running!');
});


