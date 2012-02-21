window.EmExt = {};

// TODO Prevent swipe/scrolling of background list when modal is shown.
EmExt.ModalView = Ember.View.extend({
    elementInserted: false,

    init: function(){
        this._super();
        this.modal({
            //backdrop: 'static'
        });

    },

    didInsertElement: function(){
        this.set('elementInserted', true);

        // This is an attempt to attach event handlers for 'shown' and 'hidden' to disable scrolling.
        // http://jsbin.com/ikuma4/2/edit#source
        // http://stackoverflow.com/questions/3656592/programmatically-disable-scrolling
        /*
        var _self = this;
        this.$().bind('shown', function(){
            var top = $(window).scrollTop();
            var left = $(window).scrollLeft();

            var e = _self.$();
            console.log('shown '+top+':'+left);
            $('body').css('overflow', 'hidden');
            $(window).scroll(function(){
                $(this).scrollTop(top).scrollLeft(left);
            });
        });
        this.$().bind('hidden', function(){
            console.log('hidden');
            $('body').css('overflow', 'auto');
            $(window).unbind('scroll');
        });
        */
		
        /*this.$().bind('hide', function(){
           App.itemModalViewController.hideView();
        });
		*/
    },

    toggle: function(){
        this.modal('toggle');
    },

    show: function(){
        this.modal('show');
    },

    hide: function(){
        this.modal('hide');
    },

    modal: function(cmd) {
        var elementId = '#'+this.get('elementId');
        // We recursively delay execution until the next RunLoop tick to make sure the element has been inserted into the DOM. Otherwise, calling a modal method will fail.
        // TODO Find a better way to defer execution of the modal function.
        var _self = this;
        if (_self.get('elementInserted')) {
            console.log(elementId);
            $(elementId).modal(cmd);
        } else {
            Ember.run.next(function(){
                _self.modal(cmd);
            });
        }

    }
});
