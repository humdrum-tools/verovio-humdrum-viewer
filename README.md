# Verovio Humdrum Viewer (VRV)

[VRV](http://verovio.humdrum.org) is an online
[Humdrum](http://www.humdrum.org) file notation renderer that uses
[verovio](http://verovio.org).

In the text box on the VRV homepage type some Humdrum data, and
it will be converted immediately into music notation on the right.
The homepage includes some sample data you can play with:

![](images/figure1.png?raw=true)

Try editing (or copy/paste) the following text into the text box
on the [homepage](http://verovio.humdrum.org) to match:


```
**kern
*M4/4
*clefG2
=1-
8cL
8dJ
2e;
4c
==
*-
```

## Loading files from your Desktop

You can drag and drop Humdrum files from your desktop onto the page
and the data content will be loaded into the text box and rendered
into notation automatically.  

Files cannot be saved from the webpage yet, but you can copy/paste
the text box content into a plain-text editor (with line-wrap turned
off).

## Loading online content

The VRV website can access data from [kernScores](https://kern.humdrum.org),
so you can also view online content.  For example, here is a Bach chorale:

http://verovio.humdrum.org/?file=chorales/chor001.krn

![](images/figure2.png?raw=true)

Notice that you can pull the bottom right corner of the text box
to see more columns of the Humdrum data.


* Try typing "o" (lower-case letter "O"), or "alt-o" when editing in the text box to toggle display of the original clefs.

* Also notice the "Play" button in the top right corner of the page that can be used to listing to the music notation.

* The Humdrum text box can be shown/hidden by typing "h", or "alt-h" when text box has focus.

* The music dynamically scales to the page dimensions.  You can also zoom in or out to see more music using the browser buttons for page zooming (control/command plus/minus):

![](images/figure3.png?raw=true)

* When the music does not fit onto a single page, use the &larr;/&rarr; keys to move to the next page of music (or alt+&larr;/&rarr; keys when editing in the text box.

* Notice the white triangles in the title bar.  When there are a group of scores forming a repertory, these triangles will appear.  You can click on the left/right triangles to move to the next/previous work/movement in the repertory.

* The upwards pointing arrow is used to go to a listing of works in the repertory, such as for the chorales:

![](images/figure4.png?raw=true)

Also, if you view a repertory directly, it will show this listing:

   http://verovio.humdrum.org/?file=chorales

Here is a listing of Mozart piano sonatas:

   http://verovio.humdrum.org/?file=mozart/sonatas

When a Humdrum file has an associated source edition scan, pressing
the "p" key (or alt-p when editing in the text box) will open up a
window containing a PDF scan of the original notation used to encode
the Humdrum data:

![](images/figure5.png?raw=true)

Pressing the "s" key (or "alt-s" when editing in the text box) will
open up a window with the contents of the SVG image for the notation
page currently being displayed (which you can then copy and save
to a file for use on the web or a modern word processor):

![](images/figure6.png?raw=true)


Here is a listing of Beethoven piano sonatas:

   http://verovio.humdrum.org/?file=beethoven/sonatas

And here is a view of the entire first movement of the moonlight sonata (created by zooming-out in the web browser):

![](images/figure7.png?raw=true)

## Extracting examples from online data

You can also select a ranges of measures from a complete work, such
as the start of the second theme in the recapitulation section of
the first movement of the appassionata (mm 190-197):

![](images/figure8.png?raw=true)

A few URL-embedded options can be passed to the viewer, such as "`k=h`" which will hide the Humdrum text box initially:
   http://verovio.humdrum.org/?file=beethoven/sonatas/sonata26-3.krn&k=h

![](images/figure9.png?raw=true)

You can submit feature requests for the Verovio Humdrum Viewer (VHV)
on this page:

     https://github.com/humdrum-tools/verovio-humdrum-viewer/issues

The Bach chorale repertory should be behaving nicely without bugs, but
occasional problems in Mozart and Beethoven sonatas that need to
be fixed).  Most notation rendering bugs should be reported directly
to verovio:

    https://github.com/rism-ch/verovio/issues

## Build your own HVH website:

The [VHV Demos](http://www.humdrum.org/vhv-demos) website provides
example implementations of the Humdrum-enabled Verovio Toolkit for
you to build your own pages or websites using similar functionality
to VHV.  Here are a few simple examples to get started.  You can
also look at the source code for VHV:
https://github.com/humdrum-tools/verovio-humdrum-viewer/tree/gh-pages

### Minimal editor

Here is a minimal webpage which demonstrates embedding a verovio-humdrum editor into your own webpage:

```html
<html>
<head>
<title>MyViewer</title>
<script src="http://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
</head>
<body>

<table>
<tr>
<td>
<textarea id="input">
**kern
*clefG2
*M4/4
=1-
1c;
==
*-
</textarea>
</td>
<td>
<div id="output"></div>
</td>
</tr>
</table>

<script>
   var vrvToolkit = new verovio.toolkit();
   var Input = document.querySelector("#input");
   var Output = document.querySelector("#output");
   var Page = 1; 
   Input.addEventListener("keyup", displayNotation);
   document.addEventListener("DOMContentLoaded", displayNotation);

   function displayNotation() {
      var data = Input.value;
      var options = {
         inputFormat: "auto",
         adjustPageHeight: 1,
         pageHeight: 60000,
         pageWidth:  2500,
         scale:  40,    
         font: "Leipzig"
      };        

      var svg = vrvToolkit.renderData(data, JSON.stringify(options));
      Output.innerHTML = svg;
   }    

</script>

<style>
textarea {
   width: 200px;
   height: 400px;
}
<style>

</body>
</html>
```

Example view of the webpage:

![](images/figure10.png?raw=true)

### Static image created in the browser.

Or even easier, here is an example of a static image created from
Humdrum content embedded inside of the webpage:

```html
<html>
<head>
<title>MyViewer</title>
<script src="http://verovio-script.humdrum.org/scripts/verovio-toolkit.js"></script>
</head>
<body>

<script id="input" type="text/humdrum"> 
**kern
*clefF4
*k[f#]
*M4/4
8GL
8AJ
16BLL
16A
16G
16F#JJ
2G;
==
*-
</script>

<div id="output"></div>

<script>
        var vrvToolkit = new verovio.toolkit();
        var Input = document.querySelector("#input");
        var Output = document.querySelector("#output");
        var Page = 1;
        document.addEventListener("DOMContentLoaded", displayNotation);

        function displayNotation() {
                var data = Input.textContent.replace(/^\s+/, "");
                var options = {
                        inputFormat: "auto",
                        adjustPageHeight: 1,
                        pageHeight: 1000,
                        pageWidth:  1000,
                        scale:  40,
                        font: "Leipzig"
                };

                var svg = vrvToolkit.renderData(data, JSON.stringify(options));
                Output.innerHTML = svg;
        }

</script>

</body>
</html>
```

View of the static notation example page:

![](images/figure11.png?raw=true)




