
function copyToClipboard(text, done) {
	var ta = document.createElement('textarea');
	ta.value = text;
	document.body.appendChild(ta);
	ta.select();

	// Method 1: doesn't seem to work in content scripts...
	document.execCommand('copy');

	// Method 2: keep the text in the textarea selected until the copy
	// trigger is done: the normal copy procedure will have copied the text
	requestAnimationFrame(function() {
		document.body.removeChild(ta);
		done && done();
	});
}

function cpLinkLabel() {
	var el = document.activeElement,
		text = el.textContent.trim();
	copyToClipboard(text, function() {
		el.focus();
	});
	return text;
}

function cpLinkURL() {
	var el = document.activeElement,
		text = el.href;
	copyToClipboard(text, function() {
		el.focus();
	});
	return text;
}
