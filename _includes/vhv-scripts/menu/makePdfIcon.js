

//////////////////////////////
//
// makePdfIcon --
//

function makePdfIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = "<div title=\"" + title + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick='openPdfAtBottomThirdOfScreen(\"" + url + "\")' ";
	output += "class='nav-icon fas fa-file-pdf-o'></div>";
	return output;
}


