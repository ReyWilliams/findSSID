from scripts.gps import GPS
import time

gps = GSP(port = '/dev/ttyUSB0', baud_rate=9600)

while True:
    print(gps.get_lat_long())
    time.sleep(2)
