//
//	Functions for saving SVG images to a PDF file.
//	See demo at:
//		http://pdfkit.org/demo/browser.html
//
//	vim: ts=3:ft=javascript
//
//
//These external scripts are also needed to create PDF files (found
//in the _include/head/main.html file:
//
//<xscript src="/scripts/pdfkit/blobstream.js" type="text/javascript"></xscript>
//<xscript src="/scripts/pdfkit/pdfkit.js" type="text/javascript"></xscript>
//<xscript src="/scripts/pdfkit/source.js" type="text/javascript"></xscript>
//
//Verovio text font not needed anymore (loaded as a base-64 string):
//<xscript src="scripts/pdfkit/vrv-ttf.js" type="text/javascript"></xscript> 
//
//
//	The saving process also needs FileSaver.js:
//		https://github.com/eligrey/FileSaver.js
//	but this is already included for saving editor contents.
//

{% include vhv-scripts/pdf/cleanOptions2.js       %}
{% include vhv-scripts/pdf/generatePdfFull.js     %}
{% include vhv-scripts/pdf/generatePdfShapshot.js %}
{% include vhv-scripts/pdf/loadFontResource.js    %}
{% include vhv-scripts/pdf/loadPdfFonts.js        %}
{% include vhv-scripts/pdf/svgFontCallback.js     %}



