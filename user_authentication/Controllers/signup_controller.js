app.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

app.post("/signup", userExist, function (req, res) {

    hash(req.body.password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: req.body.username,
            password : req.body.password,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, newUser.password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.redirect('/');
                    })
                }
            });
        });
    });
});