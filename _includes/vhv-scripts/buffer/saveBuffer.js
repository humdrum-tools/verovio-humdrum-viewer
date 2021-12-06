

//////////////////////////////
//
// saveBuffer -- save the text contents to a local buffer, but if the
//    shift key is pressed, delete the current contents of the buffer instead.
//

function saveBuffer(number, event) {
	if (number < 1 || number > 9) {
		return;
	}
	if (event && event.shiftKey) {
		// clear contents of given buffer.
		var key = "SAVE" + number;
		delete localStorage[key];
		var title = key + "-TITLE";
		delete localStorage[title];
		var selement = document.querySelector("#save-" + number);
		if (selement) {
			selement.classList.remove("filled");
		}
		var lelement = document.querySelector("#load-" + number);
		if (lelement) {
			lelement.classList.remove("filled");
		}
	} else {
		// store contents of text editor in given buffer.
		MENU.saveToBuffer(number);
	}
}

