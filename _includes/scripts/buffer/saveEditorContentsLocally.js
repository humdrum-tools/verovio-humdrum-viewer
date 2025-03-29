

//////////////////////////////
//
// saveEditorContentsLocally -- Save the editor contents to localStorage.
//

function saveEditorContentsLocally() {
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var value = getTextFromEditorRaw();
	var filled = false;
	var encodedcontents = "";
	if (value.match(/^\s*$/)) {
		encodedcontents = "";
		filled = false;
	} else {
		encodedcontents = encodeURIComponent(value);
		filled = true;
	}
	localStorage.setItem(key, encodedcontents);
	var telement = document.querySelector("#title-info");
	var title = "";
	if (telement) {
		title = telement.textContent.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	localStorage.setItem(key + "-TITLE", title);

	var selement = document.querySelector("#save-" + target);
	if (selement) {
		selement.title = title;
		if (filled) {
			selement.classList.add("filled");
		} else {
			selement.classList.remove("filled");
		}
	}

	var lelement = document.querySelector("#load-" + target);
	if (lelement) {
		lelement.title = title;
		if (filled) {
			lelement.classList.add("filled");
		} else {
			lelement.classList.remove("filled");
		}
	}

	InterfaceSingleNumber = 0;
}


