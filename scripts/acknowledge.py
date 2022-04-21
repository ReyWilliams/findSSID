#! /usr/bin/python
import requests
import time

while True:
    try:
        # open file to read last acknowledged command
        f = open("/home/pi/Desktop/Parsing/ACKNOWLEDGE.txt", "r")

        # split the string by space
        commAndDate = f.read().split(' ')

        if(len(commAndDate) >= 2):
            # the command is the first piece of text
            comm = commAndDate[0]

            # the date is the next
            date = commAndDate[1]

            print("command is: " + str(comm))
            print("date is: " + str(date))

            postReqString = "https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/config/ackRobotComm?name=" + comm + "&date=" + date

            r = requests.post(postReqString)
            print(r.status_code, r.reason)
    finally:
        f.close()
    time.sleep(5)
