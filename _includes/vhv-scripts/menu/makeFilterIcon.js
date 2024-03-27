

//////////////////////////////
//
// makeFilterIcon --
//

function makeFilterIcon(filterList, title) {
	let string = "";
	for (let i=0; i<filterList.length; i++) {
		if (i > 0) {
			string += " | ";
		}
		string += filterList[i];
	}
	string = encodeURIComponent(string);

	title = title.replace(/"/g, "'");
	var output = "<div title=\"" + title + "\" ";
	output += `data-filter="${string}"`;
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick='loadFilter(this)' ";
	output += "class='nav-icon fas fa-filter'></div>";
	return output;
}


