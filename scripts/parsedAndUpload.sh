#!/bin/bash

while true
do
	cd /home/pi/Desktop/Parsing
	python parsing.py
	echo "Fetched Parsed and Uploaded"
	sleep 30
done
