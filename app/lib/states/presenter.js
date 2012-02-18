require('copresent/core');
require('alfresco');

App.presenterState = Em.State.create({
    initialSubstate: 'start',
	documentLoaded: false,

    start: Em.ViewState.create({
		view: Em.View.extend({
	        templateName: 'copresent/~templates/presenter_main'
	    }),
	
		enter: function(sm) {
			this._super(sm);
			var documentLoaded = this.get('documentLoaded');
			if (documentLoaded) {
				//TODO show the doc
			} else {
				sm.goToState('presenter.loadingDocument');
			}
		},
		
		exit: function(sm) {
			//TODO remove this view ONLY when going back to start state.
		}   	
    }),
	
	loadingDocument: Em.State.create({
		//TODO load document after selection
		enter: function(sm) {
			Em.Logger.log('loadingDocument');
			App.presenterState.set('siteList', App.Sites.create());
		},
		
		initialSubstate: 'browsingSites',
		
		browsingSites: Em.ViewState.create({
			view: Em.View.create({
				templateName: 'copresent/~templates/presenter_document_select'
			}),

			enter: function(sm) {
				Em.Logger.log('browsingSites');
			    var view = this.get('view');
			    if (view) {
					view.set('content', App.presenterState.get('siteList'));
			      	view.appendTo('#doc-share');
			    }
			}
		}),
		
		browsingFolders: Em.ViewState.create({
			enter: function(stateManager) {
				Em.Logger.log('browsingFolders');
			}			
		})
		
	}),

    presentingDocument: Em.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	})
    }),

    siteSelected: function(sm, ctx) {
        var siteList = this.get('siteList');

        Em.Logger.log('siteSelected');
        console.log(ctx);
        this.set('siteName', ctx.node.shortName);
        var folder = App.presenterState.get('siteList').getDocLib(ctx.node);
        this.set('currentFolder', folder);
        console.log(folder);
    },

    folderSelected: function(sm, ctx) {
        Em.Logger.log('Folder Selected');

    },

    documentSelected: function(sm, ctx) {
        Em.Logger.log('Document Selected');
    }

});




