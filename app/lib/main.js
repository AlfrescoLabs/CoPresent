require('jquery');
require('jquery.transit');
require('ember');

require('copresent/~templates/document_viewer');
require('copresent/~templates/main_page');
require('copresent/~templates/navigation');
require('copresent/~templates/presenter_document_select');
require('copresent/~templates/presenter_login');
require('copresent/~templates/presenter_main');
require('copresent/~templates/presenter_site_select');
require('copresent/~templates/viewer_session_select');

require('ember-data');
require('ember-touch');
require('ember-mk');
require('alfresco');
require('copresent/pdf/main');
require('copresent/core');
require('copresent/store');
require('copresent/state_manager');
require('copresent/routes');
require('copresent/views')

// Ember.routes.wantsHistory = true;
Ember.routes.add('', App, App.routes.mainRoute);
