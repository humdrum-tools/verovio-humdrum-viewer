{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:53:50 PDT 2025
// Filename:      _includes/scripts/drop/handleDrop.js
// Included in:   _includes/scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Only reading the first file if more than one.
//                Maybe allow multiple files, but then the order
//                might be undefined.  Alternatively allow a method
//                of appending a data file to the end of the text
//                (such as if the control key is held down when
//                drag-and-dropping.
//
{% endcomment %}


function handleDrop(event) {
	event.preventDefault();
	$('html').css('cursor', 'wait');
	hideDropArea();
	
	var file;
	var files = event.dataTransfer.files;
	
	for (var i = 0; i < files.length; i++) {
		file = files[i];
		// console.log("NAME", escape(file.name));
		// console.log("SIZE", file.size);
		// console.log("DATE", file.lastModifiedDate.toLocaleDateString());
		
		var reader = new FileReader();
		var myevent = event;
		
		// Read first few bytes to check for ZIP signature (PK\x03\x04)
		var blob = file.slice(0, 4);
		blob.arrayBuffer().then(buffer => {
			var signature = new Uint8Array(buffer);
			var isZip = signature[0] === 0x50 && signature[1] === 0x4B && 
						signature[2] === 0x03 && signature[3] === 0x04;
			
			if (isZip) {
				// Process ZIP file
				processZipFile(file, myevent);
			} else {
				// Process as a regular text file
				reader.readAsText(file, 'UTF-8');
				reader.onload = function () {
					var contents = reader.result;
					if (myevent.shiftKey) {
						replaceEditorContentWithHumdrumFile(contents);
					} else {
						EDITOR.setValue(contents, -1);
					}
					$('html').css('cursor', 'auto');
				};
			}
		});
		
		break; // Only processing the first file
	}
}



