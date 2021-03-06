App.tappable = Ember.Mixin.create({
    tapEnd: function(recognizer) {
        //console.log('TAP');
        this.click();
    }
});

App.SiteSelectorView = Ember.View.extend(App.tappable, {
    click: function(){
        //console.log('click');
        //console.log(App.stateManager.get('currentState'));
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

App.NavigationView = Ember.View.extend({
    templateName: 'copresent/~templates/navigation',
    tagName: 'nav',
    classNames: ['navbar', 'navbar-fixed-top']
});

App.NavButton = Ember.View.extend(Ember.TargetActionSupport, {
    classNames: ['btn-navbar'],
    tagName: 'a',
    name: 'unnamed',
	target: 'App.navigationController',
	isVisible:false,
    propagateEvents: false,

    click: function() {
      // Actually invoke the button's target and action.
      // This method comes from the Ember.TargetActionSupport mixin.
      this.triggerAction();

      return this.get('propagateEvents');
    },
	
    init: function() {
        this._super();

        var target = Ember.getPath(this.get('target'));
			
		if (target) {
        	target.set(this.get('name'), this);
		}		
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
        var _self = this;
        Ember.run.next(function(){

            var items = _self.get('content');

            if (items) {
                var length = items.get('length');
                if (length > 0) {
                    items.objectAt(0).set('isVisible', true);
                }
            }

        });


    },

    arrayContentDidChange: function(content,start,removed,added) {
        this._super(content,start,removed,added);

        if (content) {
            var length = content.get('length');
            if (length > 0) {
                content.objectAt(0).set('isVisible', true);
            }
        }
    },

    showPage: function(idx) {
        var items = this.get('content');
		var currentIdx = this.get('nowShowingIdx');
		this.set('nowShowingIdx', idx);
        items.objectAt(currentIdx).set('isVisible', false);
        items.objectAt(idx).set('isVisible', true);
    		
    },
	swap: function(relIdx) {
        var items = this.get('content');
        var length = items.get('length');

        var currentIdx = this.get('nowShowingIdx');
        var idx = currentIdx + relIdx;

        idx = (idx >= length) ? length-1 : idx;
        idx = (idx < 0) ? 0 : idx;

        this.set('nowShowingIdx', idx);
		console.log('View nowShowingIdx: ' + this.get('nowShowingIdx'));

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
    }
});
