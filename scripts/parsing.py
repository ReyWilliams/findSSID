from iw_parse import get_interfaces
import requests, re

def getBitRatesVals(bitRateString): #splits bit rate string into array of numbers
    bitRateString = bitRateString.replace('Mb/s', '')
    pattern = re.compile(r'\s+')
    bitRateString = re.sub(pattern, '', bitRateString)
    bitRateString = bitRateString.split(';')
    for strNum in bitRateString:
        strNum = int(strNum)
    return bitRateString

endpoint = 'https://data.mongodb-api.com/app/wifirobot-zpufi/endpoint/entries/uploadEntry'

networks = get_interfaces(interface='wlan0')
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
    encryption = 1 if encryption is "Open" else 0

    
    r = requests.post(endpoint, json={'name' : name, 'address': address, 'signalLevel': signalLevel, 'bitRates' : bitRates, 'quality' : quality, 'channel' : channel, 'frequency' : frequency, 'encryption' : encryption})
    print(r.status_code, r.reason)