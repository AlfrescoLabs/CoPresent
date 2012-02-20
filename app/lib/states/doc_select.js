require('copresent/core');

App.set('documentSelectionState', Em.State.create({

    initialSubstate: 'browsingSites',

    browsingSites: Em.ViewState.create({
        view: Em.View.create({
            templateName: 'copresent/~templates/presenter_site_select'
        }),

        enter: function(sm) {
            Em.Logger.log('browsingSites');

            var siteController = sm.get('siteController');
            if (!siteController) {
                siteController = App.SiteController.create();
                sm.set('siteController', siteController);
            }

            var view = this.get('view');

            if (view) {
                view.set('content', siteController);
                view.appendTo('#doc-share');
            }
        },

        exit: function(sm) {
            console.log('removing browsing sites');
            this._super();
        }
    }), // end browsingSites

    browsingFolders: Em.ViewState.create({
        view: Em.View.create({
            contentBinding: 'App.stateManager.currentFolder',
            templateName: 'copresent/~templates/presenter_document_select'
        }),

        enter: function(sm) {
            Em.Logger.log('browsingFolders');

            var view = this.get('view');
            /*
            // Defer creation of the view.
            if (!view) {
                view = this.BrowseView.create();
                this.set('view', view);
            } */
            view.appendTo('#doc-share');
        }/*,

        folderChanged: function() {
            var view = this.get('view');
            console.log('Removing View');
            if (view) {
                console.log('Removing View');
                view.remove();
                view.destroy();
                view = this.BrowseView.create();
                this.set('view', view);
                view.appendTo('#doc-share');
            }
        }.observes('App.stateManager.currentFolder')   */
    })  // end browsingFolders

})); // end documentSelectionState
