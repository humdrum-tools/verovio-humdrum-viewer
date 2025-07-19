---
layout: toolbar
permalink: /toolbar-popout.html
vim: ts=3:nowrap
---

<style>

body {
	background: #01313f;
	color: white;
}

[id^="toolbar-"] {
	display: inline-block !important;
}

.fa-external-link-alt, .fa-superpowers {
	display: none;
}

.nav-icon-group {
	width: 100%;
	max-width: 380px;
	text-align: right;
	padding-bottom: 10px;
}

</style>


{% include toolbar/main.html %}


<script>


//////////////////////////////
//
// DOMContentLoaded event listener -- Setup the popout window.
//

let Interval;
document.addEventListener("DOMContentLoaded", function () {
	addOpenerToClickCode();
	addEyeballs();
	updateSaveLoadButtons();
	// need to poll the load/save buttons in the main window to sync states:
	Interval = setInterval(() => { updateSaveLoadButtons(); }, 1000);
});



//////////////////////////////
//
// delegate click event listener -- Keep track of the filled states for
//    the save (and load) buttons, matching them in the main window.
//

document.addEventListener("click", function(event) {
	const el = event.target.closest('[id^="save-"], [id^="load-"]');
	if (el && (/^save-\d+$/.test(el.id) || /^load-\d+$/.test(el.id))) {
		setTimeout(() => { updateSaveLoadButtons(); }, 60);
	}
});



//////////////////////////////
//
// addOpenerToClickCode --
//

function addOpenerToClickCode() {
	let list = document.querySelectorAll("[onclick]");
	for (let i=0; i<list.length; i++) {
		code = list[i].getAttribute("onclick");
		if (!code.trim()) {
			continue;
		}
		if (code && !code.trim().startsWith("window.opener?.")) {
			list[i].setAttribute("onclick", "window.opener?." + code.trim());
		}
	}
}


//////////////////////////////
//
// addToolbarSelectors -- Add icons to each toolbar that when clicked on, it will
//   show that toolbar in the main window.
//

function addToolbarSelectors() {

<i class="fas fa-arrow-left"></i>


}



//////////////////////////////
//
// updateSaveLoadButtons --
//

function updateSaveLoadButtons() {
	let saves = document.querySelectorAll("[id^='save-']");
	let loads = document.querySelectorAll("[id^='load-']");
	let localKeys = Object.keys(localStorage);

	for (let i=0; i<saves.length; i++) {
		let key = saves[i].id.replace("-", "").toUpperCase();
		if (localKeys.includes(key)) {
			let title = localStorage[key + "-TITLE"]
			saves[i].title = title;
			saves[i].classList.add("filled");
		} else {
			saves[i].title = "";
			saves[i].classList.remove("filled");
		}
	}

	for (let i=0; i<loads.length; i++) {
		let key = loads[i].id.replace("load-", "save").toUpperCase();
		if (localKeys.includes(key)) {
			let title = localStorage[key + "-TITLE"]
			loads[i].title = title;
			loads[i].classList.add("filled");
		} else {
			loads[i].title = "";
			loads[i].classList.remove("filled");
		}
	}
}


</script>



