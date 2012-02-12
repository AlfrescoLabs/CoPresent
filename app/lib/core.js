require('jquery');
require('ember');
require('ember-data');
require('alfresco');

App = Em.Application.create({
    VERSION: '0.1'  
});

App.CONFIG = {
    alfresco: {
		hostname: 'x.local',
		login: '',
		password: '',
		protocol: 'http',
		port: 8080,
		serviceBase: 'alfresco/service/',
        prefix: '/_proxy/'
	}
};

App.user = Em.Object.create({
	name: '',
	alf_login: '',
	alf_password: '',
	alf_ticket: '',
	isPresenter: false
});

App.alfController = Em.ArrayProxy.create({
	content: [],
	
	loadSites: function() {
		var _self = this;
		App.alf.getSites(function(data){
			_self.set('content', data);
		});
	}		
});
