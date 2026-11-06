import os, re, shutil, subprocess, time

SRC = os.path.expanduser('~/Projects/train-game/WebPrototype')
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projects', 'other', 'train-game', 'game')
BIG = 300_000

html = open(f'{SRC}/index.html').read()
block = re.search(r"const ART = \{(.*?)\};", html)
shutil.rmtree(DST, ignore_errors=True)
os.makedirs(f'{DST}/art')

art = []
for name, ext in re.findall(r"'?([\w-]+)'?: '(\w+)'", block.group(1)):
    src = f'{SRC}/art/{name}.{ext}'
    if os.path.getsize(src) > BIG:
        subprocess.run(['cwebp', '-quiet', '-q', '90', '-alpha_q', '100', src, '-o', f'{DST}/art/{name}.webp'], check=True)
        ext = 'webp'
    else:
        shutil.copy(src, f'{DST}/art/')
    art.append(f"'{name}': '{ext}'")
html = html.replace(block.group(0), 'const ART = { ' + ', '.join(art) + ' };')

stamp = time.strftime('%Y%m%d%H%M')
html = html.replace('${Date.now()}', stamp).replace("' + Date.now()", f"{stamp}'")
open(f'{DST}/index.html', 'w').write(html)

for f in os.listdir(SRC):
    if os.path.isfile(f'{SRC}/{f}') and f != 'index.html' and f in html:
        shutil.copy(f'{SRC}/{f}', DST)
if os.path.isdir(f'{SRC}/sfx'):
    shutil.copytree(f'{SRC}/sfx', f'{DST}/sfx')

total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(DST) for f in fs)
print(f'copied, {total / 1e6:.1f}MB')
