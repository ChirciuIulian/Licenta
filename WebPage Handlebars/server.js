var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var db = require('./models');
var passport = require('passport');
var { COOKIE_SECRET } = require('./config/cookiesecret');
var session = require('express-session');
var apiRoutes = require('./app/routes/apiRoutes.js');
var PORT = process.env.PORT || 3000;

//Set up the Express app to handle data.parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));


//Static pages directory
app.use(express.static('app/public'));

//Handlebars views
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Session cookie LOGIN
var SequelStore = require('connect-session-sequelize')(session.Store);
var sql = new SequelStore({ db: db.sequelize });

app.use(session({
    secret: COOKIE_SECRET,
    store: sql,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 360000 }
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user_id, done) =>{
    done(null, user_id);
});
passport.deserializeUser((user_id, done) =>{
    done(null, user_id);
});


//DATABASE RELATIONS
db.Trainers.belongsTo(db.Gym);
db.Trainers.belongsTo(db.Users);
db.Transactions.belongsTo(db.Users, {foreignKey: 'user_id', targetKey: 'id'});
db.Users.belongsTo(db.Gym);
db.Users.belongsTo(db.Users, {foreignKey:'Subscribed_To', targetKey: 'id'});
db.Users.belongsTo(db.Calories, {foreignKey: 'Diet', targetKey:'id'});
db.Basket.belongsTo(db.Users);


//Server
apiRoutes(app, db);
db.sequelize.sync().then(function(){
    app.listen(3000, function (){
        console.log('Listening on PORT ' + PORT);
    });
});