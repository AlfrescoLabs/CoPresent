require('copresent/core');

App.documentLoadingState = Ember.State.create({

    initialState: 'documentNotLoaded',

    documentNotLoaded: Ember.State.create({

        initialState: 'loadingDocument',

        loadingDocument: Ember.State.create({

            enter: function() {
				Ember.Logger.log('loadingDocument');
            }


        }),

        loadingDocumentFailed: Ember.State.create({

        })

    }),

    documentLoaded: Ember.State.create({
        enter: function(sm){
            sm.set('isDocumentLoaded', true);

            //TODO Create the necessary PDF view
        }
    })

}); // end App.documentLoadingState
