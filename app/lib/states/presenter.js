require('copresent/core');
require('alfresco');

App.set('presenterState', Ember.State.create({
    initialState: 'start',
	documentLoaded: false,

    /* ***** STATES ***** */

    start: Ember.ViewState.create({
		view: Ember.View.create({
	        templateName: 'copresent/~templates/presenter_main'
	    }),

		enter: function(sm) {
			this._super(sm);
			var documentLoaded = sm.get('isDocumentLoaded');
			Ember.run.next(function(){
				if (documentLoaded) {
					sm.goToState('presenter.creatingRoom');
				} else {
					sm.goToState('documentSelect');
				}
			});

		}
    }),
	
    creatingRoom: Ember.ViewState.create({
		view: Ember.View.create({
	        templateName: 'copresent/~templates/presenter_main'
	    }),

		enter: function(sm) {
			this._super(sm);
			var sessionId = now.createSession();
			sm.set('sessionId', sessionId);
			console.log('got session id '+sessionId);
			Ember.run.next(function(){
				sm.goToState('presenter.presentingDocument');
			});
			
		}
    }),
	

    presentingDocument: Ember.ViewState.create({

        enter: function(sm) {
            var view = this.get('view');

            if (!view) {
                view = App.SwipeView.create({
                    content: sm.get('documentController')
                });
				this.set('view', view);
            }
			var _self = this;
			view.addObserver('nowShowingIdx', function() {
				console.log('Distributing Page Change: '+_self.get('view').get('nowShowingIdx'));
				now.distributePageChange(_self.get('view').get('nowShowingIdx'));
			});
            view.appendTo(sm.rootElement);
        },
		
		nextPage: function() {
			console.log('next');
			this.get('view').showNext();
		},
		
		previousPage: function() {
			this.get('view').showPrevious();
		}
    })

}));




