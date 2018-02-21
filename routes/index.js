const express = require('express');
const pdf = require('pdfkit');

const router = express.Router();

const connection = require('../public/javascripts/mysql');
const con = connection.Connection;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res) {
    con.query(`SELECT * FROM user WHERE firstName='${req.body.firstName}'`, function(err, result) {
        result.length != 0 ? generatePdf(req, res, result) :  res.send(false);
    });
});

function generatePdf(req, res, result) {
    const myPdf = new pdf;

    myPdf.font('Times-Roman')
        .fontSize(24)
        .text(`firstName: ${result[0].firstName} lastName: ${result[0].lastName}`);
    myPdf.image(result[0].image, 50, 150);

    myPdf.end();

    const buffers = [];
    myPdf.on('data', buffers.push.bind(buffers));

    myPdf.on('end', function () {
        con.query(`UPDATE user SET ? WHERE firstName = '${req.body.firstName}'`, {pdf: Buffer.concat(buffers)}, function (err, result) {
            res.send(true);
        });
    });
}

module.exports = router;
