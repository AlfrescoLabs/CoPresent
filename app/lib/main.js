require('copresent/core');
require('copresent/store');
require('copresent/state_manager');
require('copresent/routes');
require('copresent/views');

// Ember.routes.wantsHistory = true;
Ember.routes.add('', App, App.routes.mainRoute);
