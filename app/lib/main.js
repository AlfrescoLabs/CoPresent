require('copresent/core');
require('copresent/store');
require('copresent/state_manager');
require('copresent/routes');

// Em.routes.wantsHistory = true;
Em.routes.add('', App, App.routes.mainRoute);
