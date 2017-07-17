var fs = require('fs');
var mysql = require('mysql');
var express = require('express');

var app = express();

var con = mysql.createConnection({
    host: 'localhost',
    port: 7492,
    user: 'shopingmaniac',
    password: '159',
    database: 'ShopingManiac'
})

app.use('/images', express.static(__dirname + '/images'));
console.log(__dirname + '/images');

var isAvailable = true;

if (isAvailable) {
    callStoredProcedure('GetDiscountInfo');
    callStoredProcedure('GetPriceHistory');
    callStoredProcedure('GetAllItem');
    callStoredProcedure('GetItemByCategory');
    callStoredProcedure('InsertDiscountInfo');
    callStoredProcedure('InsertItem');
    callStoredProcedure('InsertPrice');
    callStoredProcedure('GetAllBeacon');
    callStoredProcedure('GetBeaconByCategory');
    callStoredProcedure('GetBeaconByBeaconId');
    callStoredProcedure('UpdateBeacon');
    callStoredProcedure('UpdateItem');
    callStoredProcedure('UpdateDiscountInfo');
    callStoredProcedure('GetCategory');
}


// writeImage();
executeQuery('beacon', 'CALL Beacon');

function executeQuery(reqUrl, queryString) {            //매개변수1 : 요청URL, 매개변수2 : 쿼리문
    isAvailable = false;
    app.get(`/${reqUrl}`, function (req, res) {
        var temp = queryString + '(';                   //HTTP GET을 통해 받은 변수를 Stored Procedure의 매개변수로 변환
        var keys = Object.keys(req.query);
        var len = keys.length

        for (var i = 0; i < len; i++) {
            if (i == len - 1) {
                temp = temp + req.query[keys[i]];
            }
            else {
                temp = temp + req.query[keys[i]] + ', ';
            }
        }
        temp = temp + ')';
        console.log(temp);
        con.query(temp, (err, sqlRes, field) => {
            var resultToSend = {};
            if (err == null) {
                resultToSend[reqUrl] = sqlRes[0];
                res.send(resultToSend);
            }
            else {
                res.send('err occured!');
            }
        })
    })
}

function callStoredProcedure(storedProcedure) {            //매개변수1 : 요청URL, 매개변수2 : 쿼리문(대개 Stored Procedure로 호출)
    executeQuery(storedProcedure, 'CALL ' + storedProcedure);
}

// function writeImage() {
//     app.post("/WriteImage", function(req, res){
//         console.log(req.body);
//     })
// }

app.listen(3030, function () {
    console.log('Server is Running!');
});


