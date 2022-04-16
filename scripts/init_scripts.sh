#!/bin/bash

#needs to be updated to current scripts
cd /home/pi/Desktop/Parsing &
python fetch_command.py &
python acknowledge.py &
python parsing.py &
echo "Ran Scripts"
