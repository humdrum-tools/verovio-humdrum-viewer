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

var LAST_CHECKSUM = -1;

function	displayPrePostHtml() {

	vrvWorker.getHumdrum()
		.then(humdrum => {

			let checksum = getChecksum(humdrum);
			if (checksum === LAST_CHECKSUM) {
				return;
			} else {
				LAST_CHECKSUM = checksum;
			}

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
					if (Object.keys(PREHTML[i]).length == 0) {
						continue;
					}
					if (PREHTML[i].SCRIPT) {
						// Currently only one script is allowed at a time.
						let jelement = document.querySelector("script#script-prehtml");
						if (jelement) {
							jelement.textContent = PREHTML[i].SCRIPT;
						}
					}
					let text = null;
					if (language) {
						text = PREHTML[i][`CONTENT-${language}`];
					}
					if (typeof text === "undefined") {
						text = PREHTML[i].CONTENT;
					}
					text = applyParameters(text, PREHTML[i], REFS, language);
					pretext += text;
				}
				if (prehtmlElement) {
					if (pretext) {
						prehtmlElement.innerHTML = pretext;
						prehtmlElement.style.display = "block";
					} else {
						prehtmlElement.innerHTML = "";
						prehtmlElement.style.display = "none";
					}
				}
			} else if (prehtmlElement) {
				prehtmlElement.innerHTML = "";
				prehtmlElement.style.display = "none";
			}

			if (POSTHTML && Array.isArray(POSTHTML)) {
				let posttext = "";
				for (let i=0; i<POSTHTML.length; i++) {
					if (Object.keys(POSTHTML[i]).length == 0) {
						continue;
					}
					if (POSTHTML[i].SCRIPT) {
						// Currently only one script is allowed at a time.
						let jelement = document.querySelector("script#script-posthtml");
						if (jelement) {
							jelement.textContent = POSTHTML[i].SCRIPT;
						}
					}
					let text; // output text of POSTHTML content
					if (language) {
						text = POSTHTML[i][`CONTENT-${language}`];
					}
					if (typeof text === "undefined") {
						text = POSTHTML[i].CONTENT;
					}
					text = applyParameters(text, POSTHTML[i], REFS, language);
					posttext += text;
				}
				if (posthtmlElement) {
					if (posttext) {
						posthtmlElement.innerHTML = posttext;
						posthtmlElement.style.display = "block";
					} else {
						posthtmlElement.innerHTML = "";
						posthtmlElement.style.display = "none";
					}
				} else {
					posthtmlElement.innerHTML = "";
					posthtmlElement.style.display = "none";
				}
			} else if (posthtmlElement) {
				posthtmlElement.innerHTML = "";
				posthtmlElement.style.display = "none";
			}

			prepareEmbeddedScores(prehtmlElement, parameters);
			prepareEmbeddedScores(posthtmlElement, parameters);
		});
}



//////////////////////////////
//
// prepareEmbeddedScores -- insert SCORE data (for prange) as SVG image.
//

function prepareEmbeddedScores(target, parameters) {
	if (!parameters.SCORE) {
		return;
	}
	let placeholders = target.querySelectorAll("[data-score]");
	if (placeholders.length == 0) {
		return;
	}
	for (let i=0; i<placeholders.length; i++) {
		let id = placeholders[i].dataset.score;
		let scoredata = getScoreData(parameters.SCORE, id);
		if (!scoredata) {
			continue;
		}
		createSvgForScore(placeholders[i], scoredata);
	}
	
}


//////////////////////////////
//
// createSvgForScore --
//

function createSvgForScore(target, scoredata) {
	if (!scoredata.CONTENTS && scoredata.CONTENT) {
		scoredata.CONTENTS = scoredata.CONTENT;
	}
	if (!scoredata.CONTENTS) {
		// nothing to do
		console.warn("Warning: Could not find CONTENTS in", scoredata);
		return;
	}
	let formData = new FormData();

	if (scoredata.ANNOTATE)     { formData.append("annotate", scoredata.ANNOTATE); }
	if (scoredata.ANTIALIAS)    { formData.append("antialias", scoredata.ANTIALIAS); }
	if (scoredata.CROP)         { formData.append("crop", scoredata.CROP); }
	if (scoredata.EMBEDPMX)     { formData.append("embedpmx", scoredata.EMBEDPMX); }
	if (scoredata.OUTPUTFORMAT) { formData.append("outputformat", scoredata.OUTPUTFORMAT); }
	if (scoredata.PADDING)      { formData.append("padding", scoredata.PADDING); }
	if (scoredata.SCALING)      { formData.append("scaling", scoredata.SCALING); }
	if (scoredata.SVGFORMAT)    { formData.append("svgformat", scoredata.SVGFORMAT); }
	if (scoredata.TRANSPARENT)  { formData.append("transparent", scoredata.TRANSPARENT); }

	formData.append("inputdata", scoredata.CONTENTS);
	// let blob = new Blob([scoredata.CONTENTS], { type: "text/plain" });
	// formData.append("inputdata", blob);

	let url = "https://score.sapp.org/cgi-bin/score";
	fetch(url, { method: "POST", body: formData })
	.then(function (response) {
		if (!response.ok) {
			throw new Error("Error: could not download SVG image for "+ scoredata.ID);
		}
		return response.blob();
	})
	.then(function (blob) {
		let objectURL = URL.createObjectURL(blob);
      return fetch(objectURL).then(response => response.text());
	})
	.then(function (svg) {
		// console.warn(">>>>>>>>>>>> SVG", svg);
		target.innerHTML = svg;
	})
	.catch(function (error) {
		console.error("Error submitting SCORE data:", error);
	});
}



//////////////////////////////
//
// getScoreData --
//

function getScoreData(scoreinfo, id) {
	if (!scoreinfo) {
		return null;
	}
	if (!Array.isArray(scoreinfo)) {
		scoreinfo = [ scoreinfo ];
	}
	
	if (!Array.isArray(scoreinfo)) {
		console.warn("WARNING: Score info is not an array:", scoreinfo);
		return;
	}
	for (let i=0; i<scoreinfo.length; i++) {
		if (scoreinfo[i].ID === id) {
			return scoreinfo[i];
		}
	}
	return null;
}



