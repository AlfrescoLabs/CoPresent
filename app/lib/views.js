require('copresent/core');
require('copresent/state_manager');

App.ContentSelectorView = Em.View.extend({
    click: function(){
        App.stateManager.send('siteSelected',{node: this.get('content')});
    }
});