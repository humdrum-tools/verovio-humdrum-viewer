
//////////////////////////////
//
// TurnOffAllNotes --
//

function TurnOffAllNotes() {
	var list = document.querySelectorAll("svg g[id^='note-']");
	for (var i=0; i<list.length; i++) {
		list[i].style.fill = "";
	}
}


