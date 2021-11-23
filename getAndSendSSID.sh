#!/bin/bash

while true
do
	cd /home/pi/Desktop/SSIDOutputFiles
	python findSSID.py > output.txt
	echo "Fetched Output"
	python uploadToDropbox.py
	echo "Uploaded file"
	sleep 15
done
