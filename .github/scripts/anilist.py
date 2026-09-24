import json
import urllib.request

QUERY = '''
{ Page(perPage: 1) { mediaList(userName: "karmirarev", type: ANIME, status: COMPLETED, sort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]) {
  score(format: POINT_10_DECIMAL)
  completedAt { year month day }
  media { siteUrl seasonYear title { english romaji } coverImage { extraLarge } }
} } }
'''

req = urllib.request.Request(
    'https://graphql.anilist.co',
    data=json.dumps({'query': QUERY}).encode(),
    headers={'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'karmirarev site'},
)
entry = json.load(urllib.request.urlopen(req, timeout=30))['data']['Page']['mediaList'][0]
media, done = entry['media'], entry['completedAt']
anime = {
    'title': media['title']['english'] or media['title']['romaji'],
    'year': media['seasonYear'],
    'score': entry['score'] or None,
    'finished': f"{done['year']}-{done['month']:02d}-{done['day']:02d}" if done['year'] else '',
    'link': media['siteUrl'],
    'poster': media['coverImage']['extraLarge'],
}

with open('anilist.json', 'w') as f:
    json.dump(anime, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(anime['title'], anime['finished'])
