require('copresent/core');
require('alfresco');

App.set('presenterState', Ember.State.create({
    initialSubstate: 'start',
	documentLoaded: false,

    /* ***** STATES ***** */

    start: Ember.ViewState.create({
		view: Ember.View.create({
	        templateName: 'copresent/~templates/presenter_main'
	    }),

		enter: function(sm) {
			this._super(sm);
			var documentLoaded = sm.get('isDocumentLoaded');
			if (documentLoaded) {
				sm.goToState('presenter.presentingDocument');
			} else {
				sm.goToState('documentSelect');
			}
		}
    }),

    presentingDocument: Ember.ViewState.create({

        enter: function(sm) {
            var view = this.get('view');

            if (!view) {
                view = App.SwipeView.create({
                    content: sm.get('documentController')
                });
            }

            view.appendTo(sm.rootElement);
        }
    })

}));




