mongoose.connect("mongodb://localhost/myapp");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);