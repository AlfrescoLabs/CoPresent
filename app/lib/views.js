require('copresent/core');
require('copresent/state_manager');

App.tappable = Ember.Mixin.create({
    tapEnd: function(recognizer) {
        console.log('TAP');
        this.click();
    }
});

App.SiteSelectorView = Ember.View.extend(App.tappable, {
    click: function(){
        console.log('click');
        console.log(App.stateManager.get('currentState'));
        App.stateManager.send('siteSelected',{node: this.get('content')});
    }
});

App.FolderSelectorView = Ember.View.extend(App.tappable, {
    click: function(){
        App.stateManager.send('folderSelected',this.get('content'));
    }
});

App.DocumentSelectorView = Ember.View.extend(App.tappable, {
    click: function(){
        App.stateManager.send('documentSelected',{node: this.get('content')});
    }
});

/*App.SwipeView = Mk.SwipeView.extend({
    init: function() {
        this._super();
        console.log('SwipeView Init');
        console.log('content');
    }
});

App.SwipeItemView = PDF.PageView.extend(Mk.ScrollMixin, Mk.ScalableMixin,{

    scrollOptions: {
         hScroll: false,
         vScroll: true,
         duration: 750,
         velocity: 0.02,
         simultaneously: false,
         initThreshold: 10
    }
});
*/

App.SwipeView = Ember.CollectionView.extend({
    nowShowingIdx: 0,
    itemViewClass: 'App.SwipeItemView',

    init: function() {
        //var items = this.get('childViews');
        this._super();
        console.log('!!!!!!');
        var _self = this;
        Ember.run.next(function(){

            console.log('init ');
            var items = _self.get('content');
            console.log(items);


            if (items) {

                console.log('Length: ', items.get('length'));
                console.log(typeof(items));

                var length = items.get('length');
                if (length > 0) {
                    console.log('Making first item visible');
                    items.objectAt(0).set('isVisible', true);
                }
            }

        });


    },

    arrayContentDidChange: function(content,start,removed,added) {
        console.log('******arrayContentDidChange');
        this._super(content,start,removed,added);
        //var items = this.get('content');

        if (content) {
            var length = content.get('length');
            if (length > 0) {
                content.objectAt(0).set('isVisible', true);
            }
        }
    },

    swap: function(relIdx) {
        var items = this.get('content');
        var length = items.get('length');

        var currentIdx = this.get('nowShowingIdx');
        var idx = currentIdx + relIdx;

        idx = (idx > length) ? length-1 : idx;
        idx = (idx < 0) ? 0 : idx;

        this.set('nowShowingIdx', idx);

        items.objectAt(currentIdx).set('isVisible', false);
        items.objectAt(idx).set('isVisible', true);

    },

    showNext: function(){
        this.swap(1);
    },

    showPrevious: function() {
        this.swap(-1);
    },

    showFirst: function() {
        var views = this.get('content');
        views.objectAt(this.get('nowShowingIdx')).set('isVisible', false);
        this.get('content').objectAt(0).set('isVisible', true);
    },

    showLast: function() {
        var views = this.get('content');
        views.objectAt(this.get('nowShowingIdx')).set('isVisible', false);
        this.get('content').objectAt(views.get('length')-1).set('isVisible', true);
    },

    skipTwoForward: function() {
        this.swap(2);
    },

    skipTwoBack: function() {
        this.swap(-2);
    }
});

App.SwipeItemView = PDF.PageView.extend({
    isVisibleBinding: 'content.isVisible',

    init: function() {
        this._super();
        console.log('SwipeItemView');
        console.log(this.get('isVisible'));
    }
});
