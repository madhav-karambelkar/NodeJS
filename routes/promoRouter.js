const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
    .all( (req, res, next ) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next(); //lookfor addition matches
    })

    .get((req, res, next) => {
        res.end('Will send all the Promotion to you!');
    })

    .post((req, res, next) => {
        res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
    })

    .put( (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotion');
    })

    .delete( (req, res, next) => {
        res.end('Deleting all promotion');
    });

module.exports = promoRouter;