from iw_parse import get_interfaces
import requests

endpoint = "https://webhooks.mongodb-realm.com/api/client/v2.0/app/wifirobot-zpufi/service/entries/incoming_webhook/uploadEntry"

networks = get_interfaces(interface='wlan0')
for network in networks:
    print(network['Name'])
    #print(network)
    
    name = network['Name']
    address = network['Address']
    signalLevel = network['Signal Level']
    bitRates = network['Bit Rates']
    quality = network['Quality']
    channel = network['Channel']
    frequency = network['Frequency']
    encryption = network['Encryption']
    
    r = requests.post(endpoint, json={'name' : name, 'address': address, 'signalLevel': signalLevel, 'bitRates' : bitRates, 'quality' : quality, 'channel' : channel, 'frequency' : frequency, 'encryption' : encryption})
    print(r.status_code, r.reason)