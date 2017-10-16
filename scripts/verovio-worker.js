---
vim: ts=3
---

{% comment %}

Web worker interface for verovio, which separates notation rendering into a separate
thread from the user interface.

For more information about web workers:
     https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

{% endcomment %}


{% if site.local == "true" %}
	importScripts('local/verovio-toolkit.js');
{% else %}
	importScripts("http://verovio-script.humdrum.org/scripts/verovio-toolkit.js");
{% endif %}
importScripts("ace/humdrumValidator.js");
importScripts("verovio-calls.js");


//////////////////////////////
//
// resolve --
//

function resolve(data, result) {
	postMessage({
		method: data.method,
		idx: data.idx,
		result: result,
		success: true
	});
};



//////////////////////////////
//
// reject --
//

function reject(data, result) {
	postMessage({
		method: data.method,
		idx: data.idx,
		result: result,
		success: false
	});
};


//////////////////////////////
//
// message event listener --
//

addEventListener("message", function(oEvent) {
	try {
		resolve(oEvent.data, methods[oEvent.data.method].apply(methods, oEvent.data.args));
	} catch(err) {
		reject(oEvent.data, err);
	};
});


methods = new verovioCalls();
methods.vrvToolkit = new verovio.toolkit();

postMessage({method: "ready"});


