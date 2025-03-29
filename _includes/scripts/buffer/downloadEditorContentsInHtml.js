

//////////////////////////////
//
// downloadEditorContentsInHtml --
//

function downloadEditorContentsInHtml() {
	var filebase = getFilenameBase();
	var ext = "html";
	var filename = filebase + "." + ext;
	var text = "";
	if (EditorMode === "esac") {
		text = getCurrentEsacMelody();
  		text = text.replace(/\r/g, '');
	} else {
		text = getTextFromEditor();
	}
	if (!text.endsWith('\n')) {
		text += '\n';
   }
	var humdrum = dataIsHumdrum(text);

	var output = '<html>\n';
	output += '<head>\n';
	output += '<title>My Score</title>\n';
	output += '<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js">\n';
	output += `</sc` + `ript>\n`;
	output += `</head>\n`;
	output += `<body>\n`;
	output += `<script>\n`;
	output += `   displayHumdrum({\n`;
	output += `      source: "my-score",\n`;
	output += `      autoResize: "true",\n`;
	if (BREAKS) {
	   output += `      breaks: "encoded",\n`;
	}
	if ((EditorMode === "humdrum") && GLOBALFILTER) {
		let filter = GLOBALFILTER.replace(/"/g, '\\"');
	   output += `      filter: "${filter}",\n`;
	}
	output += '      header: "true"\n';
	output += '   });\n';
	output += '<!-- See https://plugin.humdrum.org/options/#list for more display options -->\n';
	output += '</script>\n';
	output += '\n';
	output += '<script type="text/x-humdrum" id="my-score">\n';
	output += text;
	
	output += '</script>\n';
	output += '\n';
	output += '</body>\n';
	output += '</html>\n';
	// var blob = new Blob([output], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([output], {type: 'text/plain'});
	saveAs(blob, filename);
}

