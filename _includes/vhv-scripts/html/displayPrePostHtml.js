{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 19:15:38 PDT 2022
// Last Modified: Fri Jul  8 16:20:34 PDT 2022
// Filename:      _includes/vhv-scripts/html/displayPrePostHtml.js
// Included in:   _includes/vhv-scripts/html/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Display PREHTML and POSTHTML parameters embedded in Humdrum data.
//
{% endcomment %}

function	displayPrePostHtml() {
	vrvWorker.getHumdrum()
		.then(humdrum => {

			let prehtml  = document.querySelector(".PREHTML");
			let posthtml = document.querySelector(".POSTHTML");
			// let humdrum = getTextFromEditor();

			let parameters = getHumdrumParameters(humdrum);
			let language = LANGUAGE;

			if (parameters.PREHTML && (Object.keys(parameters.PREHTML).length !== 0)) {
				if (parameters.PREHTML.JAVASCRIPT) {
					let jelement = document.querySelector("script#script-prehtml");
					if (jelement) {
						jelement.textContent = parameters.PREHTML.JAVASCRIPT;
					}
				}
				let text;
				if (language) {
					text = parameters.PREHTML[`CONTENT-${language}`];
				}
				if (typeof text === "undefined") {
					text = parameters.PREHTML.CONTENT;
				}
				text = applyParameters(text, parameters.PREHTML, parameters._REFS, language);
				if (text && prehtml) {
					prehtml.innerHTML = text;
					prehtml.style.display = "block";
					let prestyle = parameters.PREHTML.STYLE;
					if (prestyle) {
						prehtml.style.cssText = prestyle;
					}
				} else {
					if (prehtml) {
						prehtml.innerHTML = "";
						prehtml.style.display = "none";
					}
				}
			} else {
				if (prehtml) {
					prehtml.innerHTML = "";
					prehtml.style.display = "none";
				}
			}

			if (parameters.POSTHTML && (Object.keys(parameters.POSTHTML).length !== 0)) {
				if (parameters.POSTHTML.JAVASCRIPT) {
					let jelement = document.querySelector("script#script-posthtml");
					if (jelement) {
						jelement.textContent = parameters.POSTHTML.JAVASCRIPT;
					}
				}
				let text;
				if (language) {
					text = parameters.POSTHTML[`CONTENT-${language}`];
				}
				if (typeof text === "undefined") {
					text = parameters.POSTHTML.CONTENT;
				}
				text = applyParameters(text, parameters.POSTHTML, parameters._REFS, language);
				if (text && posthtml) {
					posthtml.innerHTML = text;
					posthtml.style.display = "block";
					let poststyle = parameters.POSTHTML.STYLE;
					if (poststyle) {
						posthtml.style.cssText = poststyle;
					}
				} else {
				if (posthtml) {
						posthtml.innerHTML = "";
						posthtml.style.display = "none";
					}
				}
			} else {
				if (posthtml) {
					posthtml.innerHTML = "";
					posthtml.style.display = "none";
				}
			}
		});
}



