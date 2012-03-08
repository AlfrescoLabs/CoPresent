App = Ember.Application.create({
    VERSION: '0.1',
	
	ready: function() {
		this._super();
		
		now.loadDocument = function(url) {
			App.stateManager.set('documentUrl', now.documentUrl);
			App.stateManager.set('isDocumentLoaded', false);
			App.stateManager.send('loadDocument', url);
		};

		now.changePage = function(num) {
			App.stateManager.send('showPage', num);
		};
		
		now.presenterJoinedRoom = function(sessionId) {
			console.log('Presenter Session ID: ' + sessionId);
			App.stateManager.set('sessionId', sessionId);
			now.distributeLoadDocument(App.stateManager.documentUrl)
		};
		
		now.viewerJoinedRoom = function(sessionId, documentUrl) {
			console.log('Viewer Session ID: ' + sessionId);
			App.stateManager.set('sessionId', sessionId);
			App.stateManager.set('documentUrl', documentUrl);
			App.stateManager.goToState('viewer');
		}	
	}
});

require('copresent/views');

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

App.User = Ember.Object.extend({
	name: '',
	alf_login: '',
	alf_password: '',
	alf_ticket: '',
	isPresenter: false
});

App.Node = Ember.Object.extend({
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

App.Folder = Ember.ArrayProxy.extend({
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
        this.set('content',[]);
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
                //console.log(items[i]);
			    _self.pushObject(App.Node.create({node:items[i]}));
            }
		});
	}
	
});

App.SiteController = Ember.ArrayProxy.extend({
	content: [],
	
	init: function() {
		var _self = this;
		App.alf.getSites(function(data){
			//console.log('Getting Sites '+data.length);
			_self.set('content', data);
		});
	},

    getFolder: function(ctx) {
        return App.Folder.create(ctx);
    }
});

App.DocumentController = Ember.Object.extend({
    isDocumentLoaded: false
});

App.set('navigationController', Ember.Object.create({

    rootElement: '#main',

    navigationView: null,

    navItems: null,

    init: function() {
        this._super();
        this.set('navigationView', App.NavigationView.create());
    },

    appendNav: function() {
        this.get('navigationView').appendTo(this.get('rootElement'));
    },

    showNav: function() {
        this.get('navigationView').set('isVisible', true);
    },

    hideNav: function() {
        this.get('navigationView').set('isVisible', false);
    },

    toggleDocumentSelect: function() {
		console.log('ToggleDocumentSelect');
    },

    exit: function() {

    },
	
	nextPage: function() {
		App.stateManager.send('nextPage');
	},
	
	previousPage: function() {
		App.stateManager.send('previousPage');
	}

}));