{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 19:15:38 PDT 2022
// Last Modified: Sat Jun 10 18:01:26 PDT 2023
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

			let prehtmlElement  = document.querySelector(".PREHTML");
			let posthtmlElement = document.querySelector(".POSTHTML");
			// let humdrum = getTextFromEditor();

			let parameters = getHumdrumParameters(humdrum);
			let language = LANGUAGE;

			// parameters.PREHTML contains content of HTML code to display above score.
			let PREHTML  = parameters.PREHTML;

			// parameters.POSTHTML contains content of HTML code to display below score.
			let POSTHTML = parameters.POSTHTML;

			// parameters._REFS contains the Humdrum reference records in the file.
			let REFS     = parameters._REFS;

			if (PREHTML && !Array.isArray(PREHTML)) {
				PREHTML = [ PREHTML ];
			}
			if (POSTHTML && !Array.isArray(POSTHTML)) {
				POSTHTML = [ POSTHTML ];
			}

			if (PREHTML && Array.isArray(PREHTML)) {
				let pretext = "";
				for (let i=0; i<PREHTML.length; i++) {
					if (Object.keys(PREHTML[i]).length !== 0) {
						if (PREHTML[i].JAVASCRIPT) {
							let jelement = document.querySelector("script#script-prehtml");
							if (jelement) {
								jelement.textContent = PREHTML[i].JAVASCRIPT;
							}
						}
						let text; // output text of PREHTML content
						if (language) {
							text = PREHTML[i][`CONTENT-${language}`];
						}
						if (typeof text === "undefined") {
							text = PREHTML[i].CONTENT;
						}
						text = applyParameters(text, PREHTML[i], REFS, language);
						pretext += text;
					}
				}

				if (pretext && prehtmlElement) {
					prehtmlElement.innerHTML = pretext;
					prehtmlElement.style.display = "block";
					let prestyle = PREHTML[i].STYLE;
					if (prestyle) {
						prehtmlElement.style.cssText = prestyle;
					}
				} else if (prehtmlElement) {
					prehtmlElement.innerHTML = "";
					prehtmlElement.style.display = "none";
				}
			} else {
				if (prehtmlElement) {
					prehtmlElement.innerHTML = "";
					prehtmlElement.style.display = "none";
				}
			}

			if (POSTHTML && Array.isArray(POSTHTML)) {
				let posttext = "";
				for (let i=0; i<POSTHTML.length; i++) {
					if (Object.keys(POSTHTML[i]).length !== 0) {
						if (POSTHTML[i].JAVASCRIPT) {
							let jelement = document.querySelector("script#script-posthtml");
							if (jelement) {
								jelement.textContent = POSTHTML[i].JAVASCRIPT;
							}
						}
						let text; // output text of PREHTML content
						if (language) {
							text = POSTHTML[i][`CONTENT-${language}`];
						}
						if (typeof text === "undefined") {
							text = POSTHTML[i].CONTENT;
						}
						text = applyParameters(text, POSTHTML[i], REFS, language);
						posttext += text;
					}
				}

				if (posttext && posthtmlElement) {
					posthtmlElement.innerHTML = posttext;
					posthtmlElement.style.display = "block";
					let poststyle = PREHTML[i].STYLE;
					if (poststyle) {
						posthtmlElement.style.cssText = poststyle;
					}
				} else if (posthtmlElement) {
					posthtmlElement.innerHTML = "";
					posthtmlElement.style.display = "none";
				}
			} else {
				if (posthtmlElement) {
					posthtmlElement.innerHTML = "";
					posthtmlElement.style.display = "none";
				}
			}

		});
}



