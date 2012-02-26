PDF = Ember.Namespace.create();

//Ember.LOG_STATE_TRANSITIONS = true;

PDF.Controller = Ember.ArrayController.extend({
    content: [],

    pdf: null,
    visiblePages: [],

    getPDF: function(url, scale, progressCb, errorCb, successCb) {

        var _self = this;
        console.log('PDFDoc GetPDF called');

        // The worker is defined in the main pdf.js script
        PDFJS.workerSrc = '/assets/pdf.js';

        PDFJS.getPdf({
            url: url,
            progress: progressCb || function(evt){
                if (evt.lengthComputable) {
                    console.log('Progress: ' + Math.round((evt.loaded / evt.total) * 100));
                } else {
                    console.log('Progress: Downloading...')
                }
            },
            error: errorCb || function(err){
                console.log('PDFController: Error getting ' + url);
                console.log(err);
            }
        }, function(data){
            console.log('PDF Loading...');
            _self.load(data, scale, successCb, errorCb);
        });

    },
    // This is invoked from getPDF so use _self instead of this.
    load: function(data, scale, successCb, errorCb) {
        var pdf;
        console.log('PDF Data Received');
        try {
            pdf = new PDFJS.PDFDoc(data);
        } catch (err) {
            if (errorCb){
                errorCb(err);
            } else {
                console.log('PDF: An error occurred');
            }
            return;
        }

        var pages = [];
        this.set('pdf', pdf);
        var numPages = pdf.numPages;
        console.log('PDF Pages Loaded '+numPages);
        for (var i=0;i<numPages;i++) {
            pages[i] = pdf.getPage(i+1);
        }

        this.set('content', pages);

        if (successCb) {
            successCb(data, scale);
        }
    }
});

PDF.PageView = Ember.View.extend({
    tagName: 'canvas',
    didInsertElement: function() {
        console.log('Page Element Inserted');
        var elementId = '#'+this.get('elementId');
        var page = this.get('content');
        // TODO Defer rendering to a "render queue" that limits how many pages are rendered at once.
        Ember.run.next(function(){
            var canvas = $(elementId)[0];
            var context = canvas.getContext('2d');
            canvas.height = page.height;
            canvas.width = page.width;
            page.startRendering(context);
        });

    }

});

PDF.progressBar = Ember.View.extend({
    progress: 0
});

PDF.manager = Ember.StateManager.create({

    controller: PDF.Controller.create(),
    documentLoaded: false,
    loadProgress:0,

    currentScale: null,
    currentPage: 0,


    start: Ember.State.create({
        enter: function(sm) {
            console.log('PDF Start State');
        },

        loadDocument: function(sm, ctx) {
            console.log('PDF Load Document Event Received');

            var success = function (data) {
                sm.goToState('loaded');

                if (ctx.success) {
                    ctx.success(data);
                }
            };

            sm.get('controller').getPDF(ctx.url, 1.0, ctx.progress, ctx.error, success);
        }
    }),

    loaded: Ember.State.create({
        enter: function(sm) {
            sm.set('documentLoaded', true);
            sm.set('currentPage', 1);
            sm.set('currentScale', 1.0)
        },

        changeScale: function(sm, ctx) {

        },

        show: function(sm, ctx) {

        },

        showNextPage: function(sm, ctx) {

        },

        showPreviousPage: function(sm, ctx) {

        }

    })
});