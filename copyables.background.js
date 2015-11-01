
chrome.contextMenus.create({
	"title": 'Open image in new tab',
	"contexts": ['all'],
	"onclick": function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {"getFirstImage": true}, function(response) {
console.log('"' + response + '"');
			if (response) {
				chrome.tabs.create({
					"url": response,
					"active": true,
					"index": tab.index + 1,
				});
			}
		});
	}
});

chrome.contextMenus.create({
	"title": 'Copy element text',
	"contexts": ['all'],
	"onclick": function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {"getLastElement": true}, function(response) {
			if (!response) return;

			copyToClipboard(response);
		});
	}
});
