---
vim: ts=3
---


{% if site.local == "yes" %}
	importScripts('local/verovio-toolkit.js');
{% else %}
	importScripts("http://verovio-script.humdrum.org/scripts/verovio-toolkit.js");
{% endif %}
importScripts("ace/humdrumValidator.js");
importScripts("verovio-calls.js");



function resolve(data, result) {
	postMessage({
		method: data.method,
		idx: data.idx,
		result: result,
		success: true
	});
};



function reject(data, result) {
	postMessage({
		method: data.method,
		idx: data.idx,
		result: result,
		success: false
	});
};


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


