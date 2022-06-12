

///////////////////////////////////////////////////////////////////////////
//
// Split window interface:
//

function SPLITTER() {
	this.mouseState    = 0;
	this.positionX     = null;
	this.leftContent   = null;
	this.splitContent  = null;
	this.splitWidth    = 5;
	this.minXPos       = 100;
	this.maxXPos       = 2000;
	this.rightPadding  = 10;
	this.defaultPos    = 400;
	this.snapTolerance = 30;
	return this;
}


SPLITTER.prototype.setPositionX = function(xPosition) {
	if ((xPosition < this.defaultPos + this.snapTolerance) &&
			(xPosition > this.defaultPos - this.snapTolerance)){
		xPosition = this.defaultPos;
	}

	if (xPosition < 0) {
		xPosition = 0;
	}
	if (xPosition > this.maxXPos) {
		xPosition = this.maxXPos;
	}
	this.positionX = xPosition;

	if (!this.leftContent) {
		this.leftContent = document.querySelector('#input');
	}
	if (!this.splitContent) {
		this.splitContent = document.querySelector('#splitter');
	}
	if (!this.rightContent) {
		this.rightContent = document.querySelector('#output-container');
	}

	if (this.leftContent) {
		this.leftContent.style.left = 0;
		this.leftContent.style.width = xPosition + 'px';
	}
	if (this.splitContent) {
		this.splitContent.style.left = xPosition + 'px';
	}
	if (this.rightContent) {
		this.rightContent.style.left = (xPosition
			+ this.splitWidth + this.rightPadding)
			+ 'px';
	}

};

var Splitter = new SPLITTER();
