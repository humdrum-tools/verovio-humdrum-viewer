

list:
	# Create a list of valid filters which are found in files in the 
	# form tool-{filter}.h in the humlib/include directory:
	echo "[" > filters.json
	ls ../../../humlib/include/tool-*.h | sed 's/\.h$$/",/; s/.*tool-/"/' >> filters.json
	echo '""' >> filters.json
	echo "]" >> filters.json
