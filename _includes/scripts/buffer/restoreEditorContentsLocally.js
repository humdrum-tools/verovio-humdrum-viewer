


//////////////////////////////
//
// restoreEditorContentsLocally -- Restore the editor contents from localStorage.
//

function restoreEditorContentsLocally() {
	// save current contents to 0th buffer
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("SAVE0", encodedcontents);
	// reset interval timer of buffer 0 autosave here...

	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var contents = localStorage.getItem(key);
	if (!contents) {
		return;
	}
	var decodedcontents = decodeURIComponent(localStorage.getItem(key));
	setTextInEditor(decodedcontents);
	InterfaceSingleNumber = 0;
}


