

//////////////////////////////
//
// prepareBufferStates --
//

function prepareBufferStates() {
	var saves = document.querySelectorAll("[id^=save-]");
	var loads = document.querySelectorAll("[id^=load-]");
	var i;
	var id;
	var num = 0;
	var value;
	var matches;
	var skey;
	var lkey;
	var tkey;

	for (i=0; i<saves.length; i++) {
		id = saves[i].id;
		matches = id.match(/save-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				saves[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						saves[i].title = title;
					}
				}
			}
		}
	}

	for (i=0; i<loads.length; i++) {
		id = loads[i].id;
		matches = id.match(/load-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				loads[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						loads[i].title = title;
					}
				}
			}
		}
	}
}


