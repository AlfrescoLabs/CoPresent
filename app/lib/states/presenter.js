require('copresent/core');
require('alfresco');

App.presenterState = Em.State.create({
    initialSubstate: 'start',
	documentLoaded: false,

    start: Em.ViewState.create({
		view: Em.View.create({
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
			if (!App.presenterState.get('siteList')){
                App.presenterState.set('siteList', App.Sites.create());
            }
		},
		
		initialSubstate: 'browsingSites',
		
		browsingSites: Em.ViewState.create({
			view: Em.View.create({
				templateName: 'copresent/~templates/presenter_site_select'
			}),

			enter: function(sm) {
				Em.Logger.log('browsingSites');
			    var view = this.get('view');
			    if (view) {
					view.set('content', App.presenterState.get('siteList'));
			      	view.appendTo('#doc-share');
			    }
                console.log(sm.get('currentState'));
			},

            exit: function(sm) {
                console.log('removing browsing sites');
                this._super();
            }
		}),
		
		browsingFolders: Em.ViewState.create({
            view: Em.View.create({
            	templateName: 'copresent/~templates/presenter_document_select'
            }),

			enter: function(sm) {
				Em.Logger.log('browsingFolders');
                var view = this.get('view');
                if (view)
                {   console.log(App.presenterState.get('currentFolder'));
                    view.set('content', App.presenterState.get('currentFolder'));
                    view.appendTo('#doc-share');
                }
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
        var folder = this.get('siteList').getDocLib(ctx.node);
        this.set('currentFolder', folder);
        console.log(folder);
        App.stateManager.goToState('presenter.loadingDocument.browsingFolders');
    },

    folderSelected: function(sm, ctx) {
        Em.Logger.log('Folder Selected');

    },

    documentSelected: function(sm, ctx) {
        Em.Logger.log('Document Selected');
    }

});




