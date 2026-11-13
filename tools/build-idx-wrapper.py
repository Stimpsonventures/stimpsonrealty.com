#!/usr/bin/env python3
"""Regenerates site/idx-wrapper.html from site/homes.html.

IDX Broker fetches the wrapper from its public URL and serves its own pages
(search results, map, listing details) between the idxStart/idxStop markers.
Because the result is served from IDX Broker's domain, every URL in the wrapper
must be absolute, and the page should stay light (no base64 images).

Run after changing the shared header/footer, or when the site's public address
changes:  python3 tools/build-idx-wrapper.py [https://stimpsonrealty.com]
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://stimpsonrealty.netlify.app").rstrip("/")
src = (ROOT / "site/homes.html").read_text()

styles = "".join(re.findall(r"<style[^>]*>.*?</style>", src, re.S))
header = re.search(r"<header class=\"nav\">.*?</header>", src, re.S).group(0)
footer = re.search(r"<footer>.*?</footer>", src, re.S).group(0)
mobile = re.search(r"<div class=\"mobile-actions\">.*?</div>", src, re.S).group(0)

chrome = header + "\n@@IDX@@\n" + footer + mobile
# Embedded base64 logos -> hosted files (header and footer artwork differ).
import base64, hashlib
def extract(m):
    ext = {"jpeg": "jpg", "svg+xml": "svg"}.get(m.group(1), m.group(1))
    data = base64.b64decode(m.group(2))
    name = "logo-%s.%s" % (hashlib.sha1(data).hexdigest()[:8], ext)  # same artwork -> one file
    (ROOT / "site/assets" / name).write_bytes(data)
    return 'src="%s/assets/%s"' % (BASE, name)
chrome, n = re.subn(r'src="data:image/([a-z+]+);base64,([^"]+)"', extract, chrome)
assert n == 2, "expected nav + footer logo, found %d" % n
# Relative links and assets -> absolute.
chrome = re.sub(r'(href|src)="(?!https?:|//|#|mailto:|tel:|data:)([^"]*)"', lambda m: '%s="%s/%s"' % (m.group(1), BASE, m.group(2)), chrome)
styles = re.sub(r"url\((['\"]?)(assets/)", lambda m: "url(%s%s/%s" % (m.group(1), BASE, m.group(2)), styles)
chrome = chrome.replace(' class="active" href', " href")

idx_css = """<style id="idx-wrapper-scope">
/* Keeps the site's display typography from blowing up IDX Broker's own markup. */
.idx-shell{background:#fff;color:#171717;padding:36px 4.5vw 70px;min-height:60vh}
.idx-shell h1,.idx-shell h2,.idx-shell h3,.idx-shell h4{font-size:revert;line-height:1.25;letter-spacing:normal;margin:revert}
.idx-shell h1::after{content:none}
.idx-shell a{color:#8a6410;text-decoration:underline;text-underline-offset:3px}
.idx-shell img{transition:none}
.idx-shell button,.idx-shell .btn{box-shadow:none;transform:none}
@media(max-width:760px){.idx-shell{padding:24px 16px 56px}}
</style>"""

body = chrome.replace("@@IDX@@", '<main class="idx-shell">\n<div id="idxStart"></div>\n<div id="idxStop"></div>\n</main>')
menu_js = "<script>document.querySelectorAll('.menu').forEach(m=>m.addEventListener('click',()=>m.parentElement.querySelector('nav').classList.toggle('open')));</script>"

out = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/>
<title>Property Search | Stimpson Realty</title>
<meta name="robots" content="noindex"/>
<link rel="icon" type="image/png" href="{BASE}/assets/favicon.png"/>
{styles}
{idx_css}
</head><body>
{body}
{menu_js}
</body></html>
"""
assert "base64," not in out and 'href="homes.html' not in out
(ROOT / "site/idx-wrapper.html").write_text(out)
print("wrote site/idx-wrapper.html (%d KB), base %s" % (len(out) // 1024, BASE))
