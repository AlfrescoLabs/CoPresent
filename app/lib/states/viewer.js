require('copresent/core');

App.viewerState = Em.State.create({
    initialSubstate: 'selectSession',

    selectSession: Em.ViewState.create({
        view: SC.View.extend({
            templateName: 'copresent/~templates/viewer_session_select'
        }),

        loadViewerDocument: function() {
        	App.stateManager.goToState('viewer.loadDocument');
        }
    }),
	
	loadDocument: Em.State.create({
		//TODO Load document
		// success -> goto viewingDocument
		// fail -> goto selectSession & pass error msg.
	}),

    viewingDocument: Em.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	})
    })

});
