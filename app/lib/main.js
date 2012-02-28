require('jquery');
require('jquery.transit');
require('ember');
require('ember-data');
require('ember-touch');
require('ember-mk');
require('alfresco');
require('copresent/pdf/main');
require('copresent/core');
require('copresent/store');
require('copresent/state_manager');
require('copresent/routes');
require('copresent/views');

// Ember.routes.wantsHistory = true;
Ember.routes.add('', App, App.routes.mainRoute);
