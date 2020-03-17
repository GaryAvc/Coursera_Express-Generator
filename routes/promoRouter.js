const express = require('express');
const bodyparser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyparser.json());

promoRouter.route('/')
.all( function (req,res,next){
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get(function (req,res,next) {
    res.end('Send the promotions to you')
})
.post(function ( req,res,next){
    res.end('We will receive your promotions: ' + req.body.content);
})
.put(function(req,res,next){
    res.statusCode=403;
    res.end('PUT operations is not allowed')
})
.delete((req,res,next)=>{
    res.end("Delete operations are not allowed");
});

promoRouter.route('/:promotionsId')
.all( function (req,res,next){
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get(function (req,res,next) {
    res.end('Send the promotion ' + req.params.promotionsId +' to you')
})
.post(function ( req,res,next){
    res.end('We will receive your promotions: ' + req.body.content);
})
.put(function(req,res,next){
    res.statusCode=403;
    res.end('PUT operations is not allowed')
})
.delete((req,res,next)=>{
    res.end("Delete operations are not allowed");
});

module.exports = promoRouter;

