import requests
import io
import csv
import re
import json
import getopt
import sys
import argparse
from pprint import pprint
from bs4 import BeautifulSoup

# opts: minBedrooms, maxBedrooms, minPrice, maxPrice
# Assigning script options to variables
parser = argparse.ArgumentParser(
    description='Web scraper for www.rightmove.com')
parser.add_argument('minBedrooms', type=str, default='', nargs='?',
                    help='the minimum number of bedrooms a property must have')
parser.add_argument('maxBedrooms', type=str, default='', nargs='?',
                    help='the maximum number of bedrooms a property must have')
parser.add_argument('minPrice', type=str, nargs='?',
                    default='', help='the minimum rent pcm a property must have')
parser.add_argument('maxPrice', type=str, nargs='?',
                    default='', help='the maximum rent pcm a property must have')
args = parser.parse_args()
minBedrooms = args.minBedrooms
maxBedrooms = args.maxBedrooms
minPrice = args.minPrice
maxPrice = args.maxPrice
base_url = 'https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E787'
property_url = base_url + \
    '&minBedrooms={minBedrooms}&maxBedrooms={maxBedrooms}&minPrice={minPrice}&maxPrice={maxPrice}&propertyTypes=&includeLetAgreed=false&mustHave=&dontShow=houseShare%2Cstudent%2Cretirement&furnishTypes=&keywords='

page = requests.get(property_url)

# Get all property pages
index = 0
pages = []
for i in range(4):
    pages.append(page)
    index = i * 24
    URL = property_url + '&index={index}'
    page = requests.get(URL)

property_urls = []

# Getting individual property URLs from all pages
for page in pages:

    # Parsing the html
    soup = BeautifulSoup(page.content, 'html.parser')

    # Get list of properties
    results = soup.find(id='l-searchResults')
    property_elems = results.find_all(class_='l-searchResult is-list')

    # Collecting URLs for each property
    for property_elem in property_elems:
        id_elem = property_elem.find(class_='propertyCard-link', href=True)
        property_urls.append('https://www.rightmove.co.uk' + id_elem['href'])

# pprint(property_urls)

# Get the property URLs from the google sheets work book
# Remove the property URLs that are already in the google sheets

# For each property URL request the page content
property_details = []
for property_url in property_urls:
    page = requests.get(property_url)
    if page.status_code == 200:
        soup = BeautifulSoup(page.content, 'html.parser')
        results = soup.find(id='root')
        # Get the elements of the page that contain relevent data
        price_elem = results.find(class_='_1gfnqJ3Vtd1z40MlC0MzXu')
        info_elem = results.find_all(class_='_1fcftXUEbWfJOJzIUeIHKt')
        map_elem = results.find(class_='_1kck3jRw2PGQSOEy3Lihgp')
        # regex to find property lat long from the page script
        latptrn = re.compile(
            r'(?<=latitude=)[0-9]?[0-9][.][0-9][0-9][0-9][0-9][0-9]')
        longptrn = re.compile(
            r'(?<=longitude=)[-]?[0-9]?[0-9][.][0-9][0-9][0-9][0-9][0-9]')
        # apply regex to each script in the web page stop when lat long found
        for script in soup.findAll('script'):
            lat = re.search(latptrn, str(script))
            long = re.search(longptrn, str(script))
            if lat and long:
                lat = lat.group(0)
                long = long.group(0)
                break
        # Clean the data
        price = re.sub("[^0-9]", "", price_elem.find('span').text)
        bedrooms = re.sub("[^0-9]", "", info_elem[1].text)
        # Generate CSV row
        # property_detail.append(property_url)
        # property_detail.append(info_elem[0].text)
        # property_detail.append(bedrooms)
        # property_detail.append(price)
        # property_detail.append(lat)
        # property_detail.append(long)
        property_detail = {
            "url": property_url, "type": info_elem[0].text, "bedrooms": bedrooms, "price": price, "lat": lat, "long": long
        }
        # Write to CSV
        # property_writer.writerow(property_detail)
        property_details.append(property_detail)
print(json.dumps(property_details))

# parse the description for the presence of key words
# garden
# furnished
# unfurnished

# Get the images??

# Post data to a google sheets workbook or post to site front end??
