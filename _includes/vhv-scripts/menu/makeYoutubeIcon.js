

//////////////////////////////
//
// makeYoutubeIcon --
//	output += "class='nav-icon fas fa-file-video-o'></div>";
//

function makeYoutubeIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = "<div title=\"" + title + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick=\"window.open('" + url + "', '_youtube')\" ";
	output += "class='nav-icon fab fa-youtube'></div>";
	return output;
}




