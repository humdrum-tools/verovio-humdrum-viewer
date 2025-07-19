
function openPopupControls() {
   const popout = window.open(
      "toolbar-popout.html",
      "Controller",
      [
         "width=425",
         "height=250",
         "left=100",
         "top=100",
         "resizable=no",
         "scrollbars=no",
         "menubar=no",
         "toolbar=no",
         "location=no",
         "status=no"
      ].join(",")
   );
}



