const authenticate = require ('../../authentication');
const send = require('../../sendinfo');
var randomstring = require("randomstring");

module.exports = function (app, db) {

    // homepage route
    app.route('/home')
    .get((req, res) => {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('home', {logged: req.user});
    });

    // account routes
    app.route('/account')
    .get(authenticate.userAuthentication(), (req, res) => {
        db.Users.findOne({ where: { id:req.user }}).then(useraccount =>{
            res.render('profileinfo', { useraccount, layout: 'profileinfo' })
        });
    });

    // contact routes
    app.route('/contact')
    .get((req, res) => {
        res.render('contactus', { layout: 'contact' });
    })
    .post((req, res) => {
        db.Users.findOne({ where: { id:req.user }}).then(user =>{
            if(user){
                send.sendContactMail(user, req.body.Subject, req.body.Message);
            }
            else{
                res.send("You need to login before submiting the form!")
            }
        });
    });

    //shop routes
    app.route('/shop')
    .get(authenticate.userAuthentication(), (req,res) =>{
        db.Products.findAll().then(product => {
            res.render('shop', {product, logged: req.user})
        })
    });

    app.route('/shop/add')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req,res) => {
            db.Products.create({
                Name: req.body.name,
                Quantity: req.body.quantity,
                Price: req.body.price,
                Short_Description: req.body.sdescription,
                Long_Description: req.body.ldescription
            }).then((product)=>{
                if(!product){
                    res.status(404).json({message: "the product could not be added for some reason"});
                }
                else{
                    res.status(200).json({message: "the product has been added"});
                }
            });
        });

    app.route('/shop/delete')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req, res) =>{
            db.Products.destroy({ where: { id: req.body.id }});
    });

    app.route('/test')
    .post(authenticate.userAuthentication(), (req, res) =>{
        var prodnameobj = req.body.product[0].prodname;
        var prodquantityobj = req.body.product[0].prodquantity;
        for(var i = 0; i<prodnameobj.length; i++){
            console.log(prodnameobj[i]);
            console.log(prodquantityobj[i]);
        }
    });

    app.route('/shop/buy')
    .post(authenticate.userAuthentication(),(req,res) => {
                var prodnameobj = req.body.product[0].prodname;
                var prodquantityobj = req.body.product[0].prodquantity;
                for(var i = 0; i<prodnameobj.length; i++){
                        db.Products.update({
                            Quantity: 10 - prodquantityobj[i]
                        },
                        { where: { Name: prodnameobj[i]}}),
                            db.Transactions.create({
                                quantity: prodquantityobj[i],
                                Product_Name: prodnameobj[i],
                                user_id: req.user
                            }),
                        db.Basket.destroy({ where: { Product_Name: prodnameobj[i]}});
                }
                res.status(200).json({ message: "You bought " + req.body.quantity + " products "});
            });

    app.route('/shopping/cart')
    .get(authenticate.userAuthentication(), (req,res) =>{
        db.Basket.findAll({ where: { UserId: req.user }}).then(basket =>{
            db.Users.findOne({ where: { id: req.user }}).then(user => {
                res.render('shoppingcart', {user, basket, logged: req.user});
            });
        });
    });

    app.route('/shopping/cart/add')
    .post(authenticate.userAuthentication(), (req,res) =>{
        db.Basket.create({
            Product_Name: req.body.pname,
            Quantity: req.body.quantity,
            Price: req.body.price,
            UserId: req.user 
        });
    });

    // login/register routes
    app.route('/login')
    .get((req, res) => {
        res.render('login_register', { layout: 'login' });
    }).post((req, res) =>{
        db.Users.findOne( {where: { username: req.body.username }}).then(user => {
            if(!user){
                res.status(404).json({ message: "did not find user "});
                }
            else if (!user.validPassword(req.body.password)){
                res.send(user.password);
            }
            else{
            req.login((user.id), (err =>{
                res.redirect('/home');
            }));
        }
        });
    });

    app.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/home')
    });
    
    app.route('/signup')
    .post ((req, res) =>{
        db.Users.create({
            Name:req.body.name,
            Surname: req.body.surname,
            Gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.cusername,
            password: req.body.cpassword
        });
    });

    app.route('/change/pass')
    .get(authenticate.userAuthentication(), (req, res) =>{
        res.render('changepass', { layout: 'profileinfo'});
    })
    .post(authenticate.userAuthentication(), (req, res) =>{
        db.Users.findOne({ where: { id: req.user }}).then( user =>{
            if(!user.validPassword(req.body.password)){
                res.send({ message: "The password you introduced is not correct!"});
            }
            else
            {
                user.update({
                    password: req.body.password2
                });
                res.send({ message: "The password has been changed"});
            }
        });
    });

    app.route('/forgot/pass')
    .get((req, res) =>{
        res.render('forgotpass', { layout: 'profileinfo'});
    })
    .post((req, res) =>{
        db.Users.findOne({ where: { email: req.body.email, username: req.body.username }}).then(user =>{
            if(!user){
                res.send({ message: "The data you introduced was nod correct, please try again! "});
            }
            else{
                var newPass = randomstring.generate(12);
                user.update({
                    password: newPass
                });
                send.sendPasswordMail(user, newPass);
            }
        });
    });

    //admin page
    app.route('/admin')
    .get (authenticate.userAuthentication(), authenticate.isAdmin(), (req,res) =>{
        db.Users.findAll({ where: { isTrainer: false }}).then(user => {
            db.Products.findAll().then(product =>{
                db.Users.findAll({ where: { isTrainer: true }}).then(trainer => {
                    db.Gym.findAll().then(gym =>{
                        db.Calories.findAll().then(diet => {
                            res.render('admin', { user, trainer, product, gym, diet, layout: 'admin'});
                        });
                    });
                });
            });
        });
    });

    // trainers routes
    app.route('/trainers')
    .get(authenticate.userAuthentication(), (req, res) =>{
        db.Users.findAll({ where: { isTrainer: true },
            }).then(trainer =>{
                db.Users.findAll({ where: { isTrainer: true }}).then( trainerDesc =>{
                    res.render('trainers', { trainer, logged: req.user })
                });
        });
    });

    app.route('/trainer/add')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req, res) =>{
        db.Users.update({ isTrainer: true }, { where: { id: req.body.userid }}),
            db.Trainers.create({
                Salary: req.body.Salary,
                Title: req.body.Title,
                Short_Description: req.body.Short_Description,
                Long_Description: req.body.Long_Description,
                Price: req.body.Price,
                UserId: req.body.userid,
                GymId: req.body.gymid
        });
    });

    app.route('/trainer/delete')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req, res) =>{
            db.Trainers.destroy({ where: { UserId: req.body.id }}).then( user =>{
                db.Users.destroy({ where: { id: req.body.id }});
            });
    });

    app.route('/trainer/subscribe')
    .post(authenticate.userAuthentication(), (req, res) =>{
        db.Users.findOne({ where: { id: req.user }}).then(user =>{
            db.Users.findOne({ where: { id: req.body.trainerid }}).then(trainer =>{
                db.Users.update({Subscribed_To: trainer.id}, {where: { id: req.user }});
                send.sendTrainerMail(trainer, user)
            });
        });
    });

    app.route('/view/trainer')
    .post((req, res) =>{
        db.Trainers.findOne({ where: { UserId: req.body.id } }).then(trainer => {
            db.Gym.findOne({ where: { id: trainer.GymId }}).then( gyms =>{
                res.render('trainerinfo', {gyms, trainer, logged: req.user});
            });
        });
    });

    //gym routes
    app.route('/gyms')
    .get(authenticate.userAuthentication(), (req, res) =>{
        db.Gym.findAll().then( gym =>{
            res.render('gyms', { gym, logged: req.user});
        });
    });

    app.route('/gym/add')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req, res) =>{
        db.Gym.create({
            Name: req.body.name,
            Address: req.body.address,
            Capacity: req.body.capacity,
            Subscription: req.body.subscription,
            Description: req.body.description
        });
    });

    app.route('/gym/delete')
    .post(authenticate.userAuthentication(), authenticate.isAdmin(), (req, res) =>{
        db.Gym.destroy({ where: { id: req.body.id }});
    });

    // diet
    app.route('/diet')
    .get(authenticate.userAuthentication(), (req, res) => {
        db.Users.findOne({ where: { id:req.user }}).then(user =>{
            db.Calories.findAll().then( diet =>{
                db.Users.findAll({ where: { Subscribed_To: req.user}}).then( subscribtor =>{
                    db.Calories.findAll({ where: { id: user.Diet }}).then( selectediet =>{
                        res.render('diet', {selectediet, subscribtor, diet ,user, logged: req.user })
                    });
                });
            });
        });
    });

    app.route('/diet/asign')
    .post(authenticate.userAuthentication(), (req, res) => {
        db.Users.update({ Diet: req.body.dietid }, { where: { id:req.body.userid }});
    });

    app.route('/diet/add')
    .post(authenticate.userAuthentication(),authenticate.isAdmin(), (req, res) => {
        db.Calories.create({
            Diet_Name: req.body.Diet_Name,
            Meal1: req.body.Meal1,
            Meal2: req.body.Meal2,
            Meal3: req.body.Meal3,
            Calories: req.body.Calories
        });
    });

    app.route('/diet/delete')
    .post(authenticate.userAuthentication(),authenticate.isAdmin(), (req, res) => {
        db.Calories.destroy({ where: { id:req.body.id }});
    });
}