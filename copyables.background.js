
var linkMenuItemId = chrome.contextMenus.create({
	"title": 'Copy link label',
	"contexts": ['link'],
	"onclick": function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {"getLastElement": true}, function(response) {
			if (!response) return;

			copyToClipboard(response);
		});
	}
});
