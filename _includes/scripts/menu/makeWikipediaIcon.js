

//////////////////////////////
//
// makeWikipediaIcon --
//	output += "class='nav-icon fas fa-file-video-o'></div>";
//

function makeWikipediaIcon(url, title) {
	title = title.replace(/"/g, "'");
	if (!title || title === "View PDF of score") {
		title = "Wikipedia entry for work";
	}
	var output = "<div title=\"" + title + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:60%' ";
	output += `onclick="openOrReplaceWikipedia('${url}')" `;

	output += `<span style="opacity:0.6; margin:0 !important" class="nav-icon fa-stack fa-1x">`;
	output += `<i style="margin:0 !important; color:white;" class="fas fa-square fa-stack-2x"></i>`;
	output += `<i style="margin:0 !important; color:#01313f;" class="fab fa-wikipedia-w fa-stack-1x fa-inverse"></i>`;
	output += `</span>`;

	output += "</div>";
	return output;
}





