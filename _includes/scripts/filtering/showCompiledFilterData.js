

//////////////////////////////
//
// showCompiledFilterData -- Run the Humdrum data through the vrvToolkit
//      to extract the output from tool filtering.  The is run from the
//      alt-c keyboard shortcut.  The filter toolbar calls this fromt
//

function showCompiledFilterData(deleteline) {
	let text = getTextFromEditorWithGlobalFilter();
	let options = humdrumToSvgOptions();
	vrvWorker.filterData(options, text, "humdrum")
	.then(function(newdata) {
		newdata = newdata.replace(/\s+$/m, "");
		deactivateFilterInToolbar();
		setTextInEditor(newdata);
		removeLastLineInTextEditorIfMatches(deleteline);
	});
}


