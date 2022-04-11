from iw_parse import get_interfaces
import requests, re

def getBitRatesVals(bitRateString): #splits bit rate string into array of numbers
    bitRateString = bitRateString.replace('Mb/s', '')
    pattern = re.compile(r'\s+')
    bitRateString = re.sub(pattern, '', bitRateString)
    bitRateString = bitRateString.split(';')
    changedVals = [float(numeric_string) for numeric_string in bitRateString]
    return changedVals

endpoint = 'https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/entries/uploadEntry'
POSendpoint = 'https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/entries/uploadPOSEntry'

networks = get_interfaces(interface='wlan0')

try:
    # open file to read last DATA recieved 
    f = open("DATA.txt", "r")
    gridAndPos = f.read().split(' ')

    gridX = gridAndPos[0]
    gridY = gridAndPos[1]
    posX = gridAndPos[2]
    posY = gridAndPos[3]

    #printing to confirm
    print(gridX)
    print(gridY)
    print(posX)
    print(posY)

    #upload netowrks
    for network in networks:
        print(network['Name'])    
        name = network['Name']
        address = network['Address']

        signalLevel = network['Signal Level']
        signalLevel = int(signalLevel) #get numeric value

        bitRates = network['Bit Rates']

        #changes bit rate string to array of values
        bitRates = getBitRatesVals(bitRates) 

        quality = network['Quality']
        quality = int(quality)  #get numeric value

        channel = network['Channel']
        channel = int(channel)  #get numeric value

        frequency = network['Frequency']
        frequency = float(frequency) #get numeric value

        encryption = network['Encryption']

       

        r = requests.post(endpoint, json={'name' : name, 'address': address, 'signalLevel': signalLevel, 'bitRates' : bitRates, 'quality' : quality, 'channel' : channel, 'frequency' : frequency, 'encryption' : encryption})
        r = requests.post(POSendpoint, json={'name' : name, 'address': address, 'signalLevel': signalLevel, 'bitRates' : bitRates, 'quality' : quality, 'channel' : channel, 'frequency' : frequency, 'encryption' : encryption, 'gridX' : gridX, 'gridY' : gridY, 'posX' : posX, 'posY' : posY})
        print(r.status_code, r.reason)
finally:
    f.close()
time.sleep(10)
