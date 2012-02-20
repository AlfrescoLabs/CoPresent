require('copresent/core');
require('alfresco');

App.presenterState = Em.State.create({
    initialSubstate: 'start',
	documentLoaded: false,

    /* ***** STATES ***** */

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
				sm.goToState('documentSelect');
			}
		},

		exit: function(sm) {
			//TODO remove this view ONLY when going back to start state.
		}
    }),

    presentingDocument: Em.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	})
    })

});




