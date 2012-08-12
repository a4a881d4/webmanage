var js = require('./routes/js');
var index = require('./routes/index')
var admin = require('./routes/admin')

module.exports = function (app) {
  app.get('/', index.index);
  app.get('/navbar.js', js.navbar);
  app.get('/init',index.init);
  app.get('/clean',index.clean);
  
  // get
  app.get('/login',admin.login);
  app.get('/logout',admin.logout);
  
  // post
  app.post('/login',admin.login);
  
}

