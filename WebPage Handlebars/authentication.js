var db = require('./models');

module.exports = {
	userAuthentication: function(){  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.render('login_register', { layout: 'login' });
	}
  },

  	isAdmin: function(){
		return function(req, res, next) {
			db.Users.findOne({ where: { id: req.user, isAdmin: true }}).then((user)=> {
			  if(!req.user){
				 return res.status(404).json({message: "You are not logged in "});
			  }

			  if (!user) { 
				return res.status(404).json({message: " You are not an admin "});
			  }
		
			  // Hand over control to passport
			  return next();
			});
	  }
	}

}