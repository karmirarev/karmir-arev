import json
import re
import urllib.request
import xml.etree.ElementTree as ET

FEED = 'https://letterboxd.com/karmirarev/rss/'
NS = {'lb': 'https://letterboxd.com'}

req = urllib.request.Request(FEED, headers={'User-Agent': 'Mozilla/5.0 (karmirarev site)'})
root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())

for item in root.find('channel').findall('item'):
    title = item.find('lb:filmTitle', NS)
    if title is None:
        continue
    rating = item.find('lb:memberRating', NS)
    poster = re.search(r'<img src="([^"]+)"', item.findtext('description') or '')
    film = {
        'title': title.text,
        'year': item.findtext('lb:filmYear', '', NS),
        'rating': float(rating.text) if rating is not None else None,
        'liked': item.findtext('lb:memberLike', 'No', NS) == 'Yes',
        'rewatch': item.findtext('lb:rewatch', 'No', NS) == 'Yes',
        'watched': item.findtext('lb:watchedDate', '', NS),
        'link': item.findtext('link'),
        'poster': poster.group(1).replace('-0-600-0-900-', '-0-230-0-345-') if poster else None,
    }
    break

with open('letterboxd.json', 'w') as f:
    json.dump(film, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(film['title'], film['watched'])
