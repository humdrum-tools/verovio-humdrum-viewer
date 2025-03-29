


function storeSpreadsheetDataInEditor(data, shiftkey) {
	// first check to see if the current contents has any double tabs,
	// and if not, collapse tabs in data.
	var contents = getTextFromEditor();
	if (!contents.match(/\t\t/)) {
		// collapse tabs
		if (shiftkey) {
			storeSpreadsheetDataInEditor2(data);
		} else {
			MENU.applyFilter("tabber -r", data, storeSpreadsheetDataInEditor2);
		}
	} else {
		// preserve presumed expanded tab data.
		setTextInEditor(data);
	}
}


