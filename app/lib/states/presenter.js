require('copresent/core');
require('alfresco');

App.presenterState = Ember.State.create({
    initialSubstate: 'start',
	documentLoaded: false,

    /* ***** STATES ***** */

    start: Ember.ViewState.create({
		view: Ember.View.create({
	        templateName: 'copresent/~templates/presenter_main'
	    }),

		enter: function(sm) {
			this._super(sm);
			var documentLoaded = sm.get('documentLoaded');
			if (documentLoaded) {
				//TODO show the doc
			} else {
				//sm.goToState('documentSelect');
			}
		},

		exit: function(sm) {
            this._super(sm);
			//TODO remove this view ONLY when going back to start state.
		}
    }),

    presentingDocument: Ember.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	})
    })

});




