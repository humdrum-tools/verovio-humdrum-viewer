{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 19:15:38 PDT 2022
// Last Modified: Sat Jun 11 19:15:40 PDT 2022
// Filename:      _includes/vhv-scripts/html/displayPrePostHtml.js
// Included in:   _includes/vhv-scripts/html/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Display PREHTML and POSTHTML parameters embedded in Humdrum data.
//
{% endcomment %}

function	displayPrePostHtml() {
	let prehtml  = document.querySelector(".PREHTML");
	let posthtml = document.querySelector(".POSTHTML");
	let humdrum = getTextFromEditor();
	let parameters = getHumdrumParameters(humdrum);

	if (parameters.PREHTML) {
			let text = parameters.PREHTML.CONTENT;
			text = applyParameters(text, parameters.PREHTML, parameters._REFS);
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

	if (parameters.POSTHTML) {
			let text = parameters.POSTHTML.CONTENT;
			text = applyParameters(text, parameters.POSTHTML, parameters._REFS);
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
}



