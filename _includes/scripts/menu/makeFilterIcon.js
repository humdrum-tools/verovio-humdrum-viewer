

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

	let letter = title.charAt(0).toUpperCase();

	title = title.replace(/"/g, "'");

	let output = "";

	// Highlight any .filter-button that matches the contents
	// of #filter.
	let filterElement = document.querySelector("#filter");
	let filterText = filterElement.value || "";
	if (!filterText) {
		filterText = "";
	} else {
		filterText = encodeURIComponent(filterText);
	}

	let highlight = "";
	if ((filterText !== "") && (filterText === string)) {
		highlight = "highlight-filter-button";
	}

	output += `<span title="${title}" `;
	output += `data-filter="${string}" `;
	output += `style="margin-left:0px !important; margin-right:0px !important; font-size:70%" `;
	output += `onclick="loadFilter(this)" `;
	output += `class="nav-icon fa-stack">`;
	output += `<span class="${highlight} filter-button fa fa-square fa-stack-2x"></span>`;
	output += `<strong style="font-size:140%; color:#01313f;" class="fa-stack-1x">${letter}</strong>`;
	output += `</span>`;

	return output;
}


