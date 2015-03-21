
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
			style.textContent = '.copyables-hide { visibility: hidden !important; }';
			document.head.insertBefore(style, document.head.firstChild);

			var src = '';
			if (!(src = tryElementImage(lastElement))) {
				hideElement(lastElement);

				var el = document.elementFromPoint(lastContext.x, lastContext.y);
				if (el && !(src = tryElementImage(el))) {
					hideElement(el);

					var el = document.elementFromPoint(lastContext.x, lastContext.y);
					if (el && !(src = tryElementImage(el))) {
						hideElement(el);

						var el = document.elementFromPoint(lastContext.x, lastContext.y);
						if (el && !(src = tryElementImage(el))) {

						}
					}
				}
			}

			unhideElements();
			if (src) {
				sendResponse(src);
			}

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

	if (el.nodeName == 'IMG' && el.src) {
		return el.src;
	}

	var bgImage = getComputedStyle(el).backgroundImage;
	if (bgImage && bgImage != 'none') {
		var match = bgImage.match(/^url\((.+)\)$/);
		if (match) {
			bgImage = match[1];
		}
		return bgImage;
	}

	return '';
}

function hideElement(el) {
	el.classList.add('copyables-hide');
}

function unhideElements() {
	[].forEach.call(document.querySelectorAll('.copyables-hide'), function(el) {
		el.classList.remove('copyables-hide');
	});
}



/**
 * CTRL + V on links
 */

document.addEventListener('copy', function(e) {
	if ( document.activeElement.nodeName == 'A' ) {
		cpLinkLabel();
	}
});
