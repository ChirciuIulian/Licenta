

bcrypt.compare('somePassword', hash, function(err, res) {
    if(res) {
    // Passwords match
    } else {
    // Passwords don't match
    } 
});

