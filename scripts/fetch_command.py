import time
import requests
 
while True:
    epoch_time = int(time.time() * 1000) # get current time since epoch in milliseconds

    # fetcht the command and date from endpoint
    r = requests.get("https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/config/getComm")

    # store response
    res = r.json()

    # store command
    command = res[0]["command"]

    # store date (time command submitted in milliseconds)
    date = int(res[0]["date"]["$date"]["$numberLong"])


    # calculate difference in seconds
    seconds = (epoch_time - date)/1000

    # print statements
    # print(date)
    # print(epoch_time)
    # print(seconds)

    # if command was submitted 30s or less, write command to file
    if(seconds <= 10):
        f = open("COMM.txt", "w")
        f.write(command)
        f.close()

    # sleep for 5s
    time.sleep(5)
