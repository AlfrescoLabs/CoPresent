require('copresent/core');
require('copresent/states/start');
require('copresent/states/presenter');
require('copresent/states/viewer');
require('copresent/states/doc_select');

Ember.LOG_STATE_TRANSITIONS = true;

App.set('stateManager', Em.StateManager.create({

	rootElement: '#main',
    initialState: 'start',

    start: App.startState,
	presenter: App.presenterState,
	viewer: App.viewerState,
    documentSelect: App.documentSelectionState,

    currentSiteName: null,
    folderStack: Em.A([]),
    currentFolder: null,
    documentController: App.DocumentController.create(),
    isDocumentLoaded: false,
    currentPage: 0,
    siteController: null,
    siteTitle: null,
    user: App.User.create(),
    isLoggedIn:false,

    init: function() {
        this._super();

        this.set('isDocumentLoadedBinding', 'App.stateManager.documentController.isDocumentLoaded');
    },
    
    siteSelected: function(sm, ctx) {

        this.set('siteName', ctx.node.shortName);

        console.log('site has been selected '+ this.get('siteController'));
        var folder = this.siteController.getFolder({
            siteId: ctx.node.shortName,
            folderPath: '/'
        });
        this.set('currentFolder', folder);
        this.get('folderStack').push(folder);
        this.goToState('documentSelect.browsingFolders');
    },

    folderSelected: function(sm, ctx) {
        Em.Logger.log('Folder Selected '+ctx.get('name'));
        console.log(ctx);
        var newPath = this.getPath('currentFolder.folderPath')+'/'+ctx.get('name');
        var folder = this.get('siteController').getFolder({
            siteId: this.get('siteName'),
            folderPath: newPath
        });

        console.log('folder has been selected '+ folder);
        this.set('currentFolder', folder);
        this.get('folderStack').push(folder);
    },

    previousFolder: function(sm, ctx) {
        this.set('currentFolder', this.get('folderStack').pop());
    },

    documentSelected: function(sm, ctx) {
        Em.Logger.log('Document Selected');
    }
}));