

function setupToolbar() {
	let toolbarelement = document.querySelector("#toolbar");

	if (toolbarelement) {
		prepareBufferStates();
		if (HIDEINITIALTOOLBAR) {
			toggleNavigationToolbar();
		}
		if (HIDEMENUANDTOOLBAR) {
			toggleMenuAndToolbarDisplay();
		}
		if (PAGED) {
			MENU.multiPageView();
		}
		fillSearchFieldsFromCgi();
		fillFilterFieldFromCgi();
		if (HIDEMENU) {
			toggleMenuDisplay();
		}
		if (!InputVisible) {
			// Or do it all of the time.
			matchToolbarVisibilityIconToState();
		}
	}

	if (TOOLBAR) {
		if (TOOLBAR.match(/save/i)) {
			chooseToolbarMenu("save");
		} else if (TOOLBAR.match(/load/i)) {
			chooseToolbarMenu("load");
		} else if (TOOLBAR.match(/search/i)) {
			chooseToolbarMenu("search");
		} else if (TOOLBAR.match(/filter/i)) {
			chooseToolbarMenu("filter");
		} else if (TOOLBAR.match(/spreadsheet/i)) {
			chooseToolbarMenu("spreadsheet");
		} else {
			// toolbar menu 1 is otherwise the default
			chooseToolbarMenu(1);
		}
	} else if (LASTTOOLBAR) {
			// load toolbar from last visit
			chooseToolbarMenu(LASTTOOLBAR);
	}

	fillSpreadsheetId();
}



