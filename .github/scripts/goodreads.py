import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

USER_ID = '156882035'

if not USER_ID:
    print('goodreads: no user id yet')
    sys.exit(0)

FEED = 'https://www.goodreads.com/review/list_rss/' + USER_ID + '?shelf=read'
req = urllib.request.Request(FEED, headers={'User-Agent': 'Mozilla/5.0 (karmirarev site)'})
root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())


def date(item, tag):
    raw = (item.findtext(tag) or '').strip()
    return parsedate_to_datetime(raw) if raw else None


def when(item):
    return date(item, 'user_read_at') or date(item, 'user_date_added')


items = [i for i in root.find('channel').findall('item') if when(i)]
item = max(items, key=lambda i: (when(i).date(), date(i, 'user_date_added')))
rating = int(item.findtext('user_rating') or 0)
book = {
    'title': item.findtext('title'),
    'author': item.findtext('author_name'),
    'year': item.findtext('book_published') or '',
    'rating': rating or None,
    'read': when(item).strftime('%Y-%m-%d'),
    'link': item.findtext('link').split('?')[0],
    'poster': item.findtext('book_large_image_url') or item.findtext('book_medium_image_url'),
}

with open('goodreads.json', 'w') as f:
    json.dump(book, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(book['title'], book['read'])
