const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all( (req,res,next)=>{
    res.statusCode=200;
    res.setHeader = ('Content-Type','text/plain');
    next();
})
.get( (req,res,next)=>{
    res.end('Will send all the leader to you');
})
.put( (req,res,next)=>{
    res.end('PUT operation not allowed');
})
.post( (req,res,next)=>{
    res.end('receive your post ' + req.body.content);
})
.delete( (req,res,next)=>{
    res.end('DELETE operation not allowed');
})

leaderRouter.route('/:leaderid')
.all( (req,res,next)=>{
    res.statusCode=200;
    res.setHeader = ('Content-Type','text/plain');
    next();
})
.get( (req,res,next)=>{
    res.end('Will send the ' +req.params.leaderid  +' leader to you');
})
.put( (req,res,next)=>{
    res.end('PUT operation not allowed');
})
.post( (req,res,next)=>{
    res.end('receive your post ' + req.body.content);
})
.delete( (req,res,next)=>{
    res.end('DELETE operation not allowed');
})


module.exports = leaderRouter;