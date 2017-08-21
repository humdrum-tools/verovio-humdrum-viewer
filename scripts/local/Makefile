
WGET = `which wget`
CURL = `which curl`
SRC = http://verovio-script.humdrum.org/scripts/verovio-toolkit.js
BASE = verovio-toolkit.js


all:
ifneq (,$(WGET))
	$(WGET) $(SRC) -O $(BASE)
else
	$(CURL) -LO $(SRC) -o $(BASE)
endif


clean:
	@rm $(BASE)
