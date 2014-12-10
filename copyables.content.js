
/**
 * Devtools helpers
 */

var script = [
	'var copyToClipboard = ' + String(copyToClipboard) + ';',
	'window.cpLinkLabel = ' + String(cpLinkLabel) + ';',
	'window.cpLinkURL = ' + String(cpLinkURL) + ';',
].join("\n");
(document.head || document.body || document.documentElement).appendChild((function(el) {
	el.innerHTML = '(function() { ' + script + ' })();';
	return el;
})(document.createElement('script')));



/**
 * Context menu item (background page)
 */

var lastElement;
document.addEventListener('contextmenu', function(e) {
	lastElement = e.target;
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.getLastElement) {
		// For some reason, this is executed 5 times, 4 times without lastElement...
		if (lastElement) {
			sendResponse(lastElement.textContent.trim());
		}
	}
});



/**
 * CTRL + V on links
 */

document.addEventListener('copy', function(e) {
	if ( document.activeElement.nodeName == 'A' ) {
		cpLinkLabel();
	}
});
