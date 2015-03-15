
chrome.contextMenus.create({
	"title": 'Copy link label',
	"contexts": ['link'],
	"onclick": function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {"getLastElement": true}, function(response) {
			if (!response) return;

			copyToClipboard(response);
		});
	}
});

chrome.contextMenus.create({
	"title": 'Open image in new tab',
	"contexts": ['all'],
	"onclick": function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {"getFirstImage": true}, function(response) {
			chrome.tabs.create({
				"url": response,
				"active": true,
				"index": tab.index + 1,
			});
		});
	}
});
