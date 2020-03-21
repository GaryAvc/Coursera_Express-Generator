const express = require('express');
const bodyParser = require('body-parser');

// -- add mongodb part --
const mongoose =require('mongoose');
const Dishes = require('../models/dishes');
// -- end mongodb part --

// router code
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// mount later
dishRouter.route('/')
.get((req,res,next)=>{
    // -- add mongodb part --
    Dishes.find({})
    .then( function (dishes){
        res.statusCode =200;
        // return a json 
        res.setHeader('Content-Type','application/json');
        // take json as string and send it back to client
        res.json(dishes);
    }, function (err){
        next(err);
    })
    .catch(function(err){
        next(err);
    });
    // -- end mongodb part --
})

.post((req,res,next)=>{
    // -- add mongodb part --
    Dishes.create(req.body)
    .then( function (dish){
        console.log('dish created');
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch( (err) =>{
        next(err);
    });
    // -- end mongodb part --
})
.put((req,res,next)=>{
    res.statusCode =403;
    res.end('PUT operation not supported on /dish');
})
// delete()
// dangerous operation - should be only restriced to certain user
.delete((req,res,next)=>{
    // -- add mongodb part --
    Dishes.remove({})
    // send some response
    .then( function (resp){
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch( (err) =>{
        next(err);
    });
    // -- end mongodb part --
});

dishRouter.route('/:dishid')

// test for next()
// the modified req,res will be pasted on to the app.get
.get((req,res,next)=>{
   // -- add mongodb part --

    Dishes.findById(req.params.dishid)
    .then( function (dishes){
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, function (err){
        next(err);
    })
    .catch(function(err){
        next(err);
    }); 

   // -- end mongodb part --
})
// post()
// the req.body will contain the parsered information
// json parser into the req.body - it has name, description, etc
.post((req,res,next)=>{
    res.statusCode =403;
    res.end('POST operation not supported on /dish');
})
.put((req,res,next)=>{
    // -- add mongodb part --

    Dishes.findByIdAndUpdate(req.params.dishid, {
        $set: req.body
    },{new: true})
    .then( function (dishes){
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, function (err){
    next(err);
    })
    .catch(function(err){
        next(err);
    }); 

   // -- end mongodb part --
})
// delete()
// dangerous operation - should be only restriced to certain user
.delete((req,res,next)=>{
    // -- add mongodb part --

    Dishes.findByIdAndRemove( req.params.dishid)
    .then( function (dishes){
        res.statusCode =200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, function (err){
    next(err);
    })
    .catch(function(err){
        next(err);
    }); 

   // -- end mongodb part --
});

module.exports = dishRouter;