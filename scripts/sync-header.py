"""Render the shared header into all static pages, without a runtime fetch."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
START = '<!-- shared-header:start -->'
END = '<!-- shared-header:end -->'
header = (ROOT / 'components/site-header.html').read_text().strip()

for path in ROOT.glob('*.html'):
    source = path.read_text()
    if START not in source:
        raise ValueError(f'Missing shared header marker in {path.name}')
    start = source.index(START)
    end = source.index(END, start) + len(END)
    path.write_text(source[:start] + header + source[end:])
    print(f'Header synchronized: {path.name}')
