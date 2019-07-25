const express = require('express');
const bcrypt= require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');

// load user model/
require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req,res)=>{
    res.render('users/login');
})

router.get('/register', (req,res)=>{
    res.render('users/register');
})

router.post('/login', (req,res, next)=>{
    passport.authenticate('local', {successRedirect: '/ideas', failureRedirect:'/users/login', failureFlash: true})(req,res,next);
});

router.post('/register', (req,res)=>{
    console.log(req.body);
    const errors = []

    if(req.body.password != req.body.password2){
        errors.push({text: "Passwords not matched!"});
    }
    if(req.body.password.length < 4){
        errors.push({text: "Password length must be at least 4 characters!"});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        })
    }else{
        User.findOne({email:req.body.email})
            .then(user=>{
                if(user){
                    req.flash('error_msg', "Email already exist!")
                    res.redirect('/users/login');
                } else{
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt, (err,hash)=>{
                            if(err)throw err;
                            newUser.password = hash;
                            new User(newUser).save().then(user=>{
                                req.flash('success_msg', "New User created!");
                                res.redirect('/users/login');
                            }).catch(err=>console.log(err));
                        });
                    });
            
                }
            })
        // res.send("passed");
        
    }
    
    // res.send('Registered!');
});

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', "You are logged out");
    res.redirect('/users/login')
});
module.exports = router;