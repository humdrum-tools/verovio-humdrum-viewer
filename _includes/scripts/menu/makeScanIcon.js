

//////////////////////////////
//
// makeScanIcon --
//

function makeScanIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = `<div title="${title}" `;
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += `onclick="window.open('${url}')" `;
	output += "class='nav-icon fas fa-picture-o'></div>";
	return output;
}



