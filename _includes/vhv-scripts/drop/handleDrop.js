{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:53:50 PDT 2025
// Filename:      _includes/vhv-scripts/drop/handleDrop.js
// Included in:   _includes/vhv-scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   
//
{% endcomment %}

function handleDrop(event) {
	event.preventDefault();
	$('html').css('cursor', 'wait');
	hideDropArea();
	var file;
	var files = event.dataTransfer.files;
	for (var i=0; i<files.length; i++) {
		file = files[i];
		// console.log("NAME", escape(file.name));
		// console.log("SIZE", file.size);
		// console.log("DATE", file.lastModifiedDate.toLocaleDateString());

		var reader = new FileReader();

		// reader.readAsDataURL(file); // loads MIME64 version of file
		// reader.readAsBinaryString(file);
		// file has to be read as Text with UTF-8 encoding
		// in order that files with UTF-8 characters are read
		// properly:
		reader.readAsText(file, 'UTF-8');

		var myevent = event;

		reader.onload = function (event) {
			var contents = reader.result;
			if (myevent.shiftKey) {
				replaceEditorContentWithHumdrumFile(contents);
			} else {
				EDITOR.setValue(contents, -1);
			}

			$('html').css('cursor', 'auto');
		};

		// Only reading the first file if more than one.
		// Maybe allow multiple files, but then the order
		// might be undefined.  Alternatively allow a method
		// of appending a data file to the end of the text (such
		// as if the control key is held down when drag-and-dropping.
		break;
	}
}



