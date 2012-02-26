require('copresent/core');

App.set('documentSelectionState', Ember.State.create({

    initialSubstate: 'browsingSites',

    browsingSites: Ember.ViewState.create({
        view: Ember.View.create({
            templateName: 'copresent/~templates/presenter_site_select'
        }),

        enter: function(sm) {
            Ember.Logger.log('browsingSites');

            var view = this.get('view');

            if (view) {
                var siteController = sm.get('siteController');
                if (!siteController) {
                    siteController = App.SiteController.create();
                    sm.set('siteController', siteController);
                    view.set('content', siteController);
                }
                //view.appendTo('#doc-share');
                if (view.get('state') == "inDOM") {
                    view.show();
                } else {
                    view.appendTo(App.stateManager.get('rootElement'));
                }

            }
        }/*,

        exit: function() {
            this._super();
            var view = this.get('view');
            Ember.Logger.log("View State "+view.get('state'));
        }*/
    }), // end browsingSites

    browsingFolders: Ember.ViewState.create({
        view: Ember.View.create({
            contentBinding: 'App.stateManager.currentFolder',
            templateName: 'copresent/~templates/presenter_document_select'
        }),

        enter: function(sm) {
            Ember.Logger.log('browsingFolders');

            var view = this.get('view');

            if (view) {
                view.appendTo(App.stateManager.get('rootElement'));
            }
        },

        folderChanged: function() {
            var view = this.get('view');
            view.rerender(); // This is enough to get the view to update itself.
        }.observes('App.stateManager.currentFolder')
    })  // end browsingFolders

})); // end documentSelectionState
