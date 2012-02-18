require('copresent/core');
require('copresent/store');
require('copresent/state_manager');
require('copresent/routes');
require('copresent/views');

// Em.routes.wantsHistory = true;
Em.routes.add('', App, App.routes.mainRoute);
