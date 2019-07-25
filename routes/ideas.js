const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
// idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/add',ensureAuthenticated, (req,res)=>{
    res.render('ideas/add');
});

router.get('/edit/:id',ensureAuthenticated, (req,res)=>{
    Idea.findOne({_id:req.params.id})
    .then(idea=>{
        if (idea.user!=req.user.id) {
            req.flash("error_msg", "Not Authorized");
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit', {idea: idea});
        }
    })
});

router.get('/', ensureAuthenticated,(req,res)=>{
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas=>res.render('ideas/index',{ideas:ideas}));
    
});

router.put('/:id', ensureAuthenticated, (req,res)=>{
    Idea.findOne({_id:req.params.id})
    .then(idea=>{
        idea.title = req.body.title
        idea.details = req.body.details
        idea.save().then(idea=>{
            req.flash('success_msg', 'Video idea updated');
            res.redirect('');
        });
        
    })
})

router.delete('/:id', ensureAuthenticated, (req,res)=>{
    // res.send("DELETE");
    Idea.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Video idea removed')
        res.redirect('');
    });
})
router.post('/', ensureAuthenticated, (req,res)=>{
    const errors = []
    if(!req.body.title){
        errors.push({text:"Title is required!"})
    }
    if(!req.body.details){
        errors.push({text:"details required!"})
    }
    if(errors.length>0){
        res.render('ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }
    else{
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
        .save()
        .then(idea=>{
            req.flash('success_msg', 'Video idea added')

            res.redirect('');
        })
        .catch(err=>console.log(err));
        // res.send("passed!")
    }
})

module.exports = router;