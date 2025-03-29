

//////////////////////////////
//
// matchToolbarVisibilityIconToState -- Needed as a separate function
//     since the menu is created after the k=y URL parameter is set.
//

function matchToolbarVisibilityIconToState() {
	var velement = document.querySelector("#text-visibility-icon");
	var output;
	if (velement) {
		if (InputVisible) {
			output = "<div title='Hide text editor (alt-y)' class='nav-icon fas fa-eye'></div>";
		} else {
			output = "<div title='Show text editor (alt-y)' class='nav-icon fas fa-eye-slash'></div>";
		}
		velement.innerHTML = output;
	}

	var texticons = document.querySelectorAll(".text-only");
	var i;
	if (InputVisible) {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "inline-block";
		}
	} else {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "none";
		}
	}
}


