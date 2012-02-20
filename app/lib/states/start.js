require('copresent/core');
require('alfresco');

App.startState = Em.State.create({
    initialSubstate: 'gettingUserRole',

    gettingUserRole: Em.ViewState.create({
        view: SC.View.extend({
            templateName: 'copresent/~templates/main_page'
        }),

        showPresenterLogin: function() {
        	Em.Logger.log('showPresenterLogin');
        	App.stateManager.goToState('start.gettingPresenterCredentials');
        }
    }),

    gettingPresenterCredentials: Em.ViewState.create({
    	view: SC.View.extend({
    		templateName: 'copresent/~templates/presenter_login'
    	}),
		
		login: function() {
			App.stateManager.goToState('start.gettingPresenterCredentials.loggingIn');
		},
		
		loggingIn: Em.State.create({
			enter: function(sm) {
				App.CONFIG.alfresco.login = sm.getPath('user.alf_login');
				App.CONFIG.alfresco.password = sm.getPath('user.alf_password');
				
				var _self = this;
				
				App.alf = AlfJS.createConnection(App.CONFIG.alfresco);
				App.alf.login(
					function() {
						// Success
						Em.Logger.log('Login Succeeded');
                        sm.set('isLoggedIn', true);
						sm.goToState('presenter');
					},
					function(error) {
						// Error
						Em.Logger.log('Login Failed');
						App.stateManager.goToState('start'); //TODO pop up an alert and retry
					});
			} // end enter()
		})
		
    })

});




