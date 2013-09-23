
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    hash = require('./pass').hash;

var app = express();


app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser('Authentication Tutorial '));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}


function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}


app.get("/", function (req, res) {

    if (req.session.user) {
        res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});



app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


http.createServer(app).listen(3000);