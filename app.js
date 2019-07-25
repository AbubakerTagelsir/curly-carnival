const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();
//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);
// connect to db
remote_url = "mongodb+srv://bakri:h3AFzujAT.2_vnu@cluster0-pjo5i.mongodb.net/test?retryWrites=true&w=majority";
local_url = 'mongodb://localhost/vidjot-dev';
if (process.env.NODE_ENV === 'production'){
    target_url = remote_url;
}else{
    target_url = local_url;
}
mongoose.connect(target_url).then(()=>{
    console.log('MongoDB connected!');
}).catch(err=>console.log(err));


const port = process.env.PORT || 5000;
// middlewares
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret:'Secret',
    resave:true,
    saveUninitialized:true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    console.log(res.locals.user)
    next();
});
// routes
app.use('/ideas', ideas);
app.use('/users', users);
app.use('/about', (req,res)=>{
    res.render('about');
});
app.use('/', (req,res)=>{
    res.render("index");
});

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
});