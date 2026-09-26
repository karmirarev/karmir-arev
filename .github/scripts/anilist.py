import json
import urllib.request

QUERY = '''
{ Page(perPage: 1) { mediaList(userName: "karmirarev", type: TYPE, status: COMPLETED, sort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]) {
  score(format: POINT_10_DECIMAL)
  completedAt { year month day }
  media { siteUrl seasonYear startDate { year } title { english romaji } coverImage { extraLarge } }
} } }
'''


def latest(kind, out):
    req = urllib.request.Request(
        'https://graphql.anilist.co',
        data=json.dumps({'query': QUERY.replace('TYPE', kind)}).encode(),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'karmirarev site'},
    )
    found = json.load(urllib.request.urlopen(req, timeout=30))['data']['Page']['mediaList']
    if not found:
        print('anilist: no completed', kind.lower())
        return
    entry = found[0]
    media, done = entry['media'], entry['completedAt']
    item = {
        'title': media['title']['english'] or media['title']['romaji'],
        'year': media['seasonYear'] or media['startDate']['year'],
        'score': entry['score'] or None,
        'finished': f"{done['year']}-{done['month']:02d}-{done['day']:02d}" if done['year'] else '',
        'link': media['siteUrl'],
        'poster': media['coverImage']['extraLarge'],
    }
    with open(out, 'w') as f:
        json.dump(item, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(item['title'], item['finished'])


latest('ANIME', 'anilist.json')
latest('MANGA', 'anilist-manga.json')
