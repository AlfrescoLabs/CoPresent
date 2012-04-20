require('copresent/core');

App.viewerState = Ember.State.create({
    initialState: 'loadDocument',
	
	loadDocument: Ember.State.create({
		enter: function(sm) {
			Ember.run.next(function(){
				if (!sm.get('isDocumentLoaded')) {
					console.log('Viewing ' + sm.get('documentUrl'));
					sm.send('downloadDocument', sm.get('documentUrl'));
				}
			});	
		},
		
		downloadDocument: function(sm, url) {
			console.log('loadDocument: '+url);

			var cfg = {
	            url: url,
	            scale: 2.0,
	            success: function() {
	                Ember.Logger.log('Document has been loaded.');
	                sm.set('isDocumentLoaded', true);
	                Ember.run.next(function(){
						sm.goToState('viewer.viewingDocument');
					});
					
	            }
			};
			
			sm.set('documentUrl', url);
	        sm.get('pdfManager').send('loadDocument', cfg);			
		}		
	}),

    viewingDocument: Ember.ViewState.create({
		
        enter: function(sm) {
            var view = this.get('view');

            if (!view) {
                view = App.SwipeView.create({
                    content: sm.get('documentController')
                });
				this.set('view', view);
            }

            view.appendTo(sm.rootElement);
        },
		
		showPage: function(sm, num) {
			this.get('view').showPage(num);
		}
    })

});
