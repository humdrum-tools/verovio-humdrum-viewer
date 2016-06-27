// vim: ts=3

var vrvToolkit;
var InputVisible = "true";


//////////////////////////////
//
// displayNotation -- Convert Humdum data in textarea to notation.
//
// Verovio options:
// # = number
// B = boolean (1, or 0)
// S = string
//
// border #           == border around SVG image (default 50)
// format S           == input format (darms, mei, pae, xml)
// pageHeight #       == height of page (default 2970)
// pageWidth #        == width of page (default 2100)
// scale #            == scaling percent for image
// adjustPageHeight B == crop the page height to content
// evenNoteSpacing B  == space notes evenly and close regardless of durations
// font S             == Bravura, Gootville, (default Leipzig)
// ignoreLayout       == ignore any encoded layout and recalulate
// noLayout B         == ignore any encoded layout and display single system
// page #             == select page to engrave
// appXpathQuery S    == xpath query for selecting app
// spacingLinear #    == linear spacing factor (default 0.25)
// spacingNonLinear # == non-linear spacing factor (default 0.6)
// spacingStaff #     == spacing above each staff (MEI vu)
// spacigSystem #     == spacing above each system (MEI vu)
//

function displayNotation() {
	var inputarea = document.querySelector("#input");
	var data = inputarea.value;
	var options = {
		inputFormat       : "humdrum",
 		adjustPageHeight  : 1,
		pageHeight        : 8000,
 		border            : 20,
		pageWidth         : 2500,
		scale             : 40,
		font              : "Leipzig"
	};
	document.querySelector("#output").innerHTML = 
		vrvToolkit.renderData(data, JSON.stringify(options)
	);
	displayFileTitle(inputarea.value);
}



//////////////////////////////
//
// allowTabs -- Allow tab characters in textarea content.
//

function allowTabs() {
	var textareas = document.getElementsByTagName('textarea');
	var count = textareas.length;
	for (var i=0; i<count; i++) {
		textareas[i].onkeydown = function(e) {
			if (e.keyCode==9 || e.which==9) {
				e.preventDefault();
				var s = this.selectionStart;
				this.value = this.value.substring(0,this.selectionStart)
					+ "\t" + this.value.substring(this.selectionEnd);
				this.selectionEnd = s+1; 
        	}
    	}
	}
}



//////////////////////////////
//
// ToggleInputArea --
//

function toggleInputArea() {
	InputVisible = !InputVisible;
	var area = document.querySelector("#input");
	if (InputVisible) {
		area.style.visibility = "visible";
	} else {
		area.style.visibility = "hidden";
	}
}



//////////////////////////////
//
// displayFileTitle --
//

function displayFileTitle(contents) {
	var lines = contents.split(/\r?\n/);
	var title = "";
	var number = "";
	var sct = "";
	var matches;
   for (i=0; i<lines.length; i++) {
		if (matches = lines[i].match(/^!!!OTL[^:]*:\s*(.*)\s*/)) {
			if (title.match(/^\s*$/)) {
				title = matches[1];
			}
		}
		if (matches = lines[i].match(/^!!!PC#:\s*(.*)\s*/)) {
			if (number.match(/^\s*$/)) {
				number = matches[1];
			}
		}
		if (matches = lines[i].match(/^!!!SCT:\s*(.*)\s*/)) {
			if (sct.match(/^\s*$/)) {
				sct = matches[1];
			}
		}
	}

	if (!number.match(/^\s*$/)) {
		title = number + ".&nbsp;&nbsp;" + title;
	}

	var tarea;
	tarea = document.querySelector("#title");
	if (tarea) {
		tarea.innerHTML = title;
	}

	tarea = document.querySelector("#subtitle");
	if (tarea) {
		tarea.innerHTML = sct;
	}

}



