{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:53:50 PDT 2025
// Filename:      _includes/vhv-scripts/drop/processZipFile.js
// Included in:   _includes/vhv-scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Uncompress a compressed MusicXML file (file extension
//                is .mxl (or MuseScore file, but that data type is not
//                processed by VHV).
//
{% endcomment %}

function processZipFile(file, event) {
	var reader = new FileReader();
	reader.readAsArrayBuffer(file);
	
	reader.onload = async function () {
		var zip = new JSZip();
		var zipData = await zip.loadAsync(reader.result);
		
		const containerPath = "META-INF/container.xml";
		if (!zipData.files[containerPath]) {
			$('html').css('cursor', 'auto');
			alert("META-INF/container.xml not found in ZIP");
			return;
		}
		
		var containerXmlText = await zipData.files[containerPath].async("text");
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(containerXmlText, "application/xml");
		var rootfiles = xmlDoc.querySelectorAll("rootfile");
		
		if (!rootfiles.length) {
			$('html').css('cursor', 'auto');
			alert("No <rootfile> elements found in container.xml");
			return;
		}
		
		var selectedFile = null;
		for (const rootfile of rootfiles) {
			var filePath = rootfile.getAttribute("full-path");
			if (filePath && filePath.endsWith(".mscx")) {
				selectedFile = filePath;
				break;
			}
		}
		
		if (!selectedFile) {
			for (const rootfile of rootfiles) {
				var filePath = rootfile.getAttribute("full-path");
				if (filePath === "score.xml") {
					selectedFile = filePath;
					break;
				}
			}
		}
		
		if (!selectedFile || !zipData.files[selectedFile]) {
			$('html').css('cursor', 'auto');
			alert("No valid .mscx or score.xml file found in ZIP");
			return;
		}
		
		var extractedContent = await zipData.files[selectedFile].async("text");
		
		if (event.shiftKey) {
			replaceEditorContentWithHumdrumFile(extractedContent);
		} else {
			EDITOR.setValue(extractedContent, -1);
		}
		
		$('html').css('cursor', 'auto');
	};
}



