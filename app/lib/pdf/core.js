PDF = Ember.Namespace.create();

//Ember.LOG_STATE_TRANSITIONS = true;

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
PDF.Page = Ember.Object.extend({
    page: null,
    isVisible: false
});

PDF.Controller = Ember.ArrayController.extend({
    content: [],
    _renderQueue: [],
    processor: null,
    _MAX_RENDERS: 2,
    inProcessRenders: 0,
    _RENDER_INTERVAL: 1500,

    pdf: null,

    getPDF: function(url, scale, progressCb, errorCb, successCb) {

        var _self = this;
        console.log('PDFDoc GetPDF called');

        // The worker is defined in the main pdf.js script
        PDFJS.workerSrc = '/assets/pdf.js';
        //PDFJS.disableWorker = true;

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
            if (typeof(errorCb) !== 'undefined'){
                errorCb(err);
            } else {
                console.log('PDF Load: ' + err);
            }
            return;
        }

        var pages = [];
        this.set('pdf', pdf);
        var numPages = pdf.numPages;
        console.log('PDF Pages Loaded '+numPages);
        for (var i=0;i<numPages;i++) {
            pages[i] = PDF.Page.create({page:pdf.getPage(i+1)});
        }

        this.set('content', pages);

        if (successCb) {
            successCb(data, scale);
        }
    },

    queueRendering: function(page, context) {
        var q = this._renderQueue;   // The queue is not going to be treated as an observable object
        var processor = this.get('queueProcessor');

        q.push({page:page,context:context});

        var _self = this;

        if (!processor) {
            this.set('processor', setInterval(function(){
                var q = _self._renderQueue;

                //console.log('PDF: Processor queue length: ' + q.length+ ' , in process: ' + _self.inProcessRenders);

                if (q.length && (_self.inProcessRenders < _self._MAX_RENDERS)) {
                    _self.inProcessRenders++;
                    var ctx = q.shift(); // Remove first item

                    //console.log('Procesing page ' + ctx.page.pageNumber );

                    ctx.page.startRendering(ctx.context, function(err) {
                        if (err) {
                            console.log('PDF: Error Rendering Page ' +ctx.page.pageNumber);
                            //TODO Add some kind of retry
                        }
                        _self.inProcessRenders--;
                    }); // end startRendering

                } // end if (q.length ...)

            }, _self._RENDER_INTERVAL)); // end setInterval
        } // end if (!processor)
    } // end queueRendering()
});

PDF.PageView = Ember.View.extend({
    tagName: 'canvas',
    didInsertElement: function() {
        //console.log('Page Element Inserted');
        var elementId = '#'+this.get('elementId');
        var page = this.get('content').get('page');
        // TODO Defer rendering to a "render queue" that limits how many pages are rendered at once.
        Ember.run.next(function(){
            var canvas = $(elementId)[0];
            var context = canvas.getContext('2d');
            canvas.height = page.height;
            canvas.width = page.width;
            PDF.manager.queueRendering(page, context);
        });
    } // end didInsertElement()
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

    }),

    queueRendering: function(page, context) {
        this.get('controller').queueRendering(page, context);
    }
});