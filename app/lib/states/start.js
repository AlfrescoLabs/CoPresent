require('copresent/core');
require('alfresco');

App.startState = Ember.State.create({
    initialSubstate: 'gettingUserRole',

    gettingUserRole: Ember.ViewState.create({
        view: SC.View.extend({
            templateName: 'copresent/~templates/main_page'
        }),

        showPresenterLogin: function() {
        	Ember.Logger.log('showPresenterLogin');
        	App.stateManager.goToState('start.gettingPresenterCredentials');
        },
		
		showSessionSelect: function() {
			App.stateManager.goToState('start.gettingViewerSessionId')
		}
    }),

    gettingPresenterCredentials: Ember.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	}),
		
		login: function() {
			App.stateManager.goToState('start.gettingPresenterCredentials.loggingIn');
		},
		
		loggingIn: Ember.State.create({
			enter: function(sm) {
				App.CONFIG.alfresco.login = sm.getPath('user.alf_login');
				App.CONFIG.alfresco.password = sm.getPath('user.alf_password');
				
				var _self = this;
				
				App.alf = AlfJS.createConnection(App.CONFIG.alfresco);
				App.alf.login(
					function() {
						// Success
						Ember.Logger.log('Login Succeeded');
                        sm.set('isLoggedIn', true);
						sm.goToState('documentSelect');
					},
					function(error) {
						// Error
						Ember.Logger.log('Login Failed');
						App.stateManager.goToState('start'); //TODO pop up an alert and retry
					});
			} // end enter()
		})
		
    }),
	
    gettingViewerSessionId: Ember.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/viewer_session_select'
    	}),
		
		joinSession: function() {
			App.stateManager.goToState('start.gettingViewerSessionId.joiningSession');
		},
		
		joiningSession: Ember.State.create({
			enter: function(sm) {
				now.joinSession(sm.get('sessionId'));
				
				Ember.run.next(function(){
					sm.goToState('viewer.loadDocument');
				});
			}
		})
	})

});




