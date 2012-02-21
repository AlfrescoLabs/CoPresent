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

    currentSiteName: null,
    folderStack: Ember.A([]),
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

        Ember.Logger.log('site has been selected '+ this.get('siteController'));
        var folder = this.siteController.getFolder({
            siteId: ctx.node.shortName,
            folderPath: '/'
        });
        this.set('currentFolder', folder);
        this.goToState('documentSelect.browsingFolders');
    },

    folderSelected: function(sm, ctx) {
        Ember.Logger.log('Folder Selected '+ctx.get('name'));
        Ember.Logger.log(ctx);
        var currentFolder = this.get('currentFolder');
        this.folderStack.push(currentFolder);
        var newPath = currentFolder.get('folderPath')+'/'+ctx.get('name');

        var folder = this.siteController.getFolder({
            siteId: this.get('siteName'),
            folderPath: newPath
        });

        Ember.Logger.log('folder has been selected '+ folder);
        this.set('currentFolder', folder);
    },

    previousFolder: function(sm, ctx) {
        if (this.folderStack.length > 0) {
            this.set('currentFolder', this.folderStack.pop());
        } else {
            sm.goToState('documentSelect.browsingSites');
        }
    },

    documentSelected: function(sm, ctx) {
        Ember.Logger.log('Document Selected');
    }
}));