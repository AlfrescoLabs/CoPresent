require('copresent/core');

App.documentLoadingState = Ember.State.create({

    initialSubstate: 'documentNotLoaded',

    documentNotLoaded: Ember.State.create({

        initialSubstate: 'loadingDocument',

        loadingDocument: Ember.State.create({

            enter: function() {


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
