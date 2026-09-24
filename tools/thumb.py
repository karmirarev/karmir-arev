import os
import sys
from PIL import Image, ImageSequence

WIDTH = 560

for path in sys.argv[1:]:
    section = path.split('/')[0]
    rest = os.path.splitext(path.split('/', 1)[1])[0]
    sub = 'events/' if rest.startswith('events-markets-exhibits/') else ''
    out = os.path.join(section, 'thumbs', sub + os.path.basename(rest) + '.webp')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im = Image.open(path)
    if getattr(im, 'n_frames', 1) > 1:
        frames, durations = [], []
        for frame in ImageSequence.Iterator(im):
            f = frame.convert('RGBA')
            f.thumbnail((WIDTH, WIDTH * 3))
            frames.append(f)
            durations.append(frame.info.get('duration', 100))
        frames[0].save(out, save_all=True, append_images=frames[1:], duration=durations, loop=0, quality=70, method=6)
        size = frames[0].size
    else:
        f = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
        f.thumbnail((WIDTH, WIDTH * 3), Image.LANCZOS)
        f.save(out, quality=80, method=6)
        size = f.size
    src = path.split('/', 1)[1]
    print(f'<img src="./{os.path.relpath(out, section)}" data-full="./{src}" width="{size[0]}" height="{size[1]}" loading="lazy" alt="">')
