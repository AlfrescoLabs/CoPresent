require('copresent/core');

App.viewerState = Ember.State.create({
    initialSubstate: 'loadDocument',
	
	loadDocument: Ember.State.create({
		//TODO Load document
		// success -> goto viewingDocument
		// fail -> goto selectSession & pass error msg.
	}),

    viewingDocument: Ember.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	})
    })

});
