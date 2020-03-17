const express = require('express');
const bodyParser = require('body-parser');

// router code
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// mount later
dishRouter.route('/')
// all - no matter what requrest income, this callback function will be process first
// next() - find additional request with has the same endpoint downbelow
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
// test for next()
// the modified req,res will be pasted on to the app.get
.get((req,res,next)=>{
    res.end('Will send all the dishes to you');
})
// post()
// the req.body will contain the parsered information
// json parser into the req.body - it has name, description, etc
.post((req,res,next)=>{
    res.end('will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode =403;
    res.end('PUT operation not supported on /dish');
})
// delete()
// dangerous operation - should be only restriced to certain user
.delete((req,res,next)=>{
    res.end('Deleteing all the dishes!');
});

dishRouter.route('/:dishid')
// all - no matter what requrest income, this callback function will be process first
// next() - find additional request with has the same endpoint downbelow
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
// test for next()
// the modified req,res will be pasted on to the app.get
.get((req,res,next)=>{
    res.end('Will send dish '+ req.params.dishid+  ' to you');
})
// post()
// the req.body will contain the parsered information
// json parser into the req.body - it has name, description, etc
.post((req,res,next)=>{
    res.statusCode =403;
    res.end('POST operation not supported on /dish');
})
.put((req,res,next)=>{
    res.statusCode =403;
    res.end('PUT operation not supported on /dish');
})
// delete()
// dangerous operation - should be only restriced to certain user
.delete((req,res,next)=>{
    res.end('Deleteing all the dishes!');
});

module.exports = dishRouter;