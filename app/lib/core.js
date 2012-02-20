require('jquery');
require('ember');
require('ember-data');
require('ember-touch');
require('alfresco');
require('pdf');

App = Em.Application.create({
    VERSION: '0.1'  
});

App.CONFIG = {
    alfresco: {
		hostname: 'home.sala.us',
		login: '',
		password: '',
		protocol: 'http',
		port: 80,
		serviceBase: 'alfresco/service/',
        prefix: '/_proxy/'
	}
};

App.User = Em.Object.extend({
	name: '',
	alf_login: '',
	alf_password: '',
	alf_ticket: '',
	isPresenter: false
});

App.Node = Em.Object.extend({
    node:{},
    title: function() {
        return this.get('node').node.properties['cm:title'];
    }.property().cacheable(),
    name: function() {
        return this.get('node').node.properties['cm:name'];
    }.property().cacheable(),
    isContainer: function() {
        return this.get('node').node.isContainer;
    }.property().cacheable()
});

App.Folder = Em.ArrayProxy.extend({
	siteId: '',
	folderPath: '/',
	metadata: undefined,
	
	content: [],

	folders: function() {
        return this.filterProperty('isContainer', true);
    }.property().cacheable(),

    documents: function() {
        return this.filterProperty('isContainer', false);
    }.property().cacheable(),


	
	init: function() {
		var data = null;
		var _self = this;
		App.alf.getDocList({
			site: this.get('siteId'),
			model: 'cm:content',
			container: 'documentLibrary',
			folderPath: this.get('folderPath')
		}, function(data){
			_self.set('metadata', data.metadata);
            var items = data.items;
            var len = data.totalRecords;
            for (var i=0;i<len;i++) {
                console.log(items[i]);
			    _self.pushObject(App.Node.create({node:items[i]}));
            }
		});
	}
	
});

App.SiteController = Em.ArrayProxy.extend({
	content: [],
	
	init: function() {
		var _self = this;
		App.alf.getSites(function(data){
			console.log('Getting Sites '+data.length);
			_self.set('content', data);
		});
	},

    getFolder: function(ctx) {
        return App.Folder.create(ctx);
    }
});

App.DocumentController = Em.Object.extend({
    isDocumentLoaded: false
});
