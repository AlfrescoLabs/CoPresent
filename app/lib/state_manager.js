require('copresent/core');
require('copresent/states/start');
require('copresent/states/presenter');
require('copresent/states/viewer');

Ember.LOG_STATE_TRANSITIONS = true;

App.stateManager = Em.StateManager.create({

	rootElement: '#main',
    initialState: 'start',

    start: App.startState,
	presenter: App.presenterState,
	viewer: App.viewerState

});
