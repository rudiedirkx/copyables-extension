
/**
 * Devtools helpers
 */

if ( document.documentElement && document.documentElement.nodeName == 'HTML' ) {
	var script = [
		'var copyToClipboard = ' + String(copyToClipboard) + ';',
		'window.cpLinkLabel = ' + String(cpLinkLabel) + ';',
		'window.cpLinkURL = ' + String(cpLinkURL) + ';',
	].join("\n");
	(document.head || document.body || document.documentElement).appendChild((function(el) {
		el.dataset.origin = 'copyables';
		el.innerHTML = '(function() { ' + script + ' })();';
		return el;
	})(document.createElement('script')));
}


/**
 * Context menu item (background page)
 */

var lastElement, lastContext = {x: 0, y: 0};
document.addEventListener('contextmenu', function(e) {
	lastElement = e.target;
	lastContext.x = e.x;
	lastContext.y = e.y;
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	if (lastElement) {
		if (message.getLastElement) {
			sendResponse(lastElement.textContent.trim());
		}

		if (message.getFirstImage) {
			var style = document.createElement('style');
			style.textContent = ':before, :after { visibility: hidden !important; }';
			document.head.insertBefore(style, document.head.firstChild);

			console.log('[copyables] lastContext', lastContext);

			// Trigger reflow?
			var x = lastElement.offsetHeight;

			// Evaluate for all elements under the pointer
			var els = document.elementsFromPoint(lastContext.x, lastContext.y);
			var src = '';
			for (var i=0; i<els.length; i++) {
				var el = els[i];
				src = tryElementImage(el);
				if (src) {
					break;
				}
			}

			// Send result, empty or not, back to background script
			console.log('[copyables] src', '"' + src + '"');
			sendResponse(src);

			style.remove();
		}
	}
});

function tryElementImage(el) {
	if (el.nodeName == 'HTML') {
		var src = tryElementImage(document.body);
		if (src) {
			return src;
		}
	}

	console.log('[copyables] Trying', el);

	// @todo Catch `[srcset]`, `<picture>` etc

	if (el.nodeName == 'IMG' && el.src) {
		return el.src;
	}

	var bgImage = getComputedStyle(el).backgroundImage;
	if (bgImage && bgImage != 'none') {
		var match = bgImage.match(/^url\(['"]*(.+?)['"]*\)$/);
		if (match) {
			bgImage = match[1];
		}
		return bgImage;
	}

	return '';
}



/**
 * CTRL + V on links
 */

document.addEventListener('copy', function(e) {
	if ( document.activeElement.nodeName == 'A' ) {
		cpLinkLabel();
	}
});
