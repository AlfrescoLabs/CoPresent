require('copresent/core');
require('copresent/states/start');
require('copresent/states/presenter');
require('copresent/states/viewer');
require('copresent/states/doc_select');

Ember.LOG_STATE_TRANSITIONS = true;

App.set('stateManager', Ember.StateManager.create({

	rootElement: '#main',
    initialState: 'start',

    start: App.startState,
	presenter: App.presenterState,
	viewer: App.viewerState,
    documentSelect: App.documentSelectionState,

    pdfManager: PDF.manager,

    currentSiteName: null,
    folderStack: Ember.A([]),
    currentFolder: null,
    documentController: PDF.manager.controller,
    currentDocument: null,
	documentUrl: null,
    isDocumentLoaded: false,
    currentPage: 0,
    siteController: null,
    siteTitle: null,
    user: App.User.create(),
    isLoggedIn:false,
	sessionId: '',
    
    navController: App.navigationController,

    init: function() {
        this._super();

        this.set('isDocumentLoadedBinding', 'App.stateManager.documentController.isDocumentLoaded');
        this.get('navController').appendNav();
    },

    siteSelected: function(sm, ctx) {

        this.set('siteName', ctx.node.shortName);

        //Ember.Logger.log('site has been selected '+ this.get('siteController'));
        var folder = this.siteController.getFolder({
            siteId: ctx.node.shortName,
            folderPath: '/'
        });
        this.set('currentFolder', folder);
        this.goToState('documentSelect.browsingFolders');
    },

    folderSelected: function(sm, ctx) {
        //Ember.Logger.log('Folder Selected '+ctx.get('name'));
        //Ember.Logger.log(ctx);
        var currentFolder = sm.get('currentFolder');
        sm.folderStack.pushObject(currentFolder);
        var newPath = currentFolder.get('folderPath')+'/'+ctx.get('name');

        var folder = sm.siteController.getFolder({
            siteId: sm.get('siteName'),
            folderPath: newPath
        });

        Ember.Logger.log('folder has been selected '+ folder);
        this.set('currentFolder', folder);
    },

    previousFolder: function(sm, ctx) {
        if (sm.folderStack.length > 0) {
            sm.set('currentFolder', this.folderStack.popObject());
        } else {
            sm.goToState('documentSelect.browsingSites');
        }
    },

    documentSelected: function(sm, ctx) {
        Ember.Logger.log('Document Selected');
        Ember.Logger.log(ctx);

        var node = ctx.node.get('node').node;
        Ember.Logger.log(node);

        var id = node.properties['sys:node-uuid'];
        var store_protocol  = node.properties['sys:store-protocol'];
        var store = node.properties['sys:store-identifier'];
        var ticket = App.alf.getTicket();
        var pdfServiceUrl = 'ext/node/' + store_protocol + '/' + store + '/' + id + '/pdf';

        var protocol = App.CONFIG.alfresco.protocol;
        var host = App.CONFIG.alfresco.hostname;

        var loc = window.location;
        var prefix = loc.protocol+'//'+ loc.host + App.CONFIG.alfresco.prefix;

        var serviceBase = App.CONFIG.alfresco.serviceBase;

        var url = prefix + protocol + '://' + host + '/' + serviceBase + pdfServiceUrl + '?alf_ticket=' + ticket;

        Ember.Logger.log('URL: ' + url);
		this.set('documentUrl', url);
        this.set('currentDocument', ctx.node);
		
		var _self = this;
		var cfg = {
	            url: url,
	            scale: 2.0,
	            success: function() {
	                Ember.Logger.log('Document has been loaded.');
	                _self.set('isDocumentLoaded', true);
	                _self.goToState('presenter');
	            }
			};
		this.set('documentUrl', cfg.url);
        this.get('pdfManager').send('loadDocument', cfg);

    }
}));