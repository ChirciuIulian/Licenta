const passport = require ('passport');
const authenticate = require ('../../authentication');

module.exports = function (app, db) {

    app.route('/shop')
    .get(authenticate.userAuthentication(),(req, res) =>{
        res.sendFile("shop.html", {"root": 'app/public'});
        }).post(authenticate.isAdmin(), authenticate.userAuthentication(),(req,res) => {
            db.Products.create({
                Name: req.body.name,
                Quantity: req.body.quantity,
                Price: req.body.price,
                Description: req.body.description
            }).then((product)=>{
                if(!product){
                    res.status(404).json({message: "the product could not be added for some reason"});
                }
                else{
                    res.status(200).json({message: "the product has been added"});
                }
            });
        }).put(authenticate.userAuthentication(),(req,res) => {
            db.Products.findOne({ where: { Name: req.body.name }}).then(product => {
                if(req.body.quantity > product.Quantity){
                    res.status(404).json({ message: "you selected more products then there are available"});
                }
                else{
                    db.Products.update({
                        Quantity: product.Quantity - req.body.quantity
                    },
                    {where: {Name: req.body.name}}).then(() => {
                        db.Transactions.create({
                            quantity: req.body.quantity,
                            ProductId: product.id,
                            user_id: req.user
                        });
                    });
                    res.status(200).json({ message: "You bought " + req.body.quantity + " products "});
                }
            });
        });

    // pentru a ajunge pe homepage
    app.route('/home')
    .get((req, res) => {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.sendFile("homepage.html", {"root": 'app/public'});
    });

    // pentru a ajunge pe pagina de login
    app.route('/login')
    .get((req, res) => {
        res.sendFile("login_register.html", {"root": 'app/public'});
    }).post((req, res) =>{
        db.Users.findOne( {where: { username: req.body.username }}).then(user => {
            if(!user){
                res.status(404).json({ message: "did not find user "});
                }
            else{
            req.login((user.id), (err =>{
                res.status(200).json( { message: " logged id "} );
            }));
        }
        });
    });
    
    app.route('/signup')
    .post ((req, res) =>{
        db.Users.create({
            Name:req.body.name,
            Surname: req.body.surname,
            Gender: req.body.gender,
            email: req.body.email,
            username: req.body.cusername,
            password: req.body.cpassword
        });
    });
}