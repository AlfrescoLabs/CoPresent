require('copresent/core');
require('copresent/state_manager');

App.ContentSelectorView = Em.View.extend({
    click: function(){
        console.log('click');
        App.stateManager.send('siteSelected', {node: this.get('content')});
    }
});