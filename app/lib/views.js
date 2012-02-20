require('copresent/core');
require('copresent/state_manager');

App.tappable = Em.Mixin.create({
    tapEnd: function(recognizer) {
        console.log('TAP');
        this.click();
    }
});

App.SiteSelectorView = Em.View.extend(App.tappable, {
    click: function(){
        console.log('click');
        console.log(App.stateManager.get('currentState'));
        App.stateManager.send('siteSelected',{node: this.get('content')});
    }
});

App.FolderSelectorView = Em.View.extend(App.tappable, {
    click: function(){
        App.stateManager.send('folderSelected',this.get('content'));
    }
});

App.DocumentSelectorView = Em.View.extend(App.tappable, {
    click: function(){
        App.stateManager.send('documentSelected',{node: this.get('content')});
    }
});