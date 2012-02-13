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

App.Folder = Em.ArrayProxy.extend({
	siteTitle: '',
	siteId: '',
	folderPath: '/',
	metadata: undefined,
	
	content: [],
	
	folders: function(){
		return this.filterProperty('node.isContainer', true);
	}.property('children').cacheable(),
	 
	docs: function(){
		return this.filterProperty('node.isContainer', true);
	}.property('children').cacheable(),
	
	init: function() {
		var data = null;
		
		App.alf.getDocList({
			site: this.get('siteId'),
			model: 'cm:content',
			container: 'documentLibrary',
			folderPath: '/'
		}, function(data){
			this.set('metadata', data.metadata);
			
			this.set('content', data.items);
		});
	}
	
});



App.Sites = Em.ArrayProxy.extend({
	content: [],
	
	init: function() {
		var _self = this;
		App.alf.getSites(function(data){
			console.log('Getting Sites '+data.length);
			_self.set('content', data);
		});
	},
	
	getSiteDocLib: function(idx) {
		var item = this.objectAt(idx);
		return App.Folder.create({
			siteId: item.shortName,
			siteTitle: item.title,
			folderPath: '/'
		});
	}	
});
