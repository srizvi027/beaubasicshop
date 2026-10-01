"""
Generates stylised SVG packshots for DEMO products (public/images/demo/*.svg).
These are placeholders only — replace them with real product photography
by changing the `images` array of each product in data/products.ts.
"""
import os
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "demo")
os.makedirs(OUT, exist_ok=True)

def esc(s): return s.replace("&", "&amp;")

def label(x, y, w, brand, name, ink, size=1.0):
    return f'''<text x="{x+w/2}" y="{y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="{30*size}" fill="{ink}">{esc(brand)}</text>
<text x="{x+w/2}" y="{y+42*size}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="2" font-size="{22*size}" fill="{ink}">{esc(name.upper())}</text>'''

def shape(kind, body, accent, ink, brand, name):
    g = ""
    if kind == "jar":
        g = f'''<rect x="250" y="250" width="300" height="70" rx="14" fill="{accent}"/>
<rect x="230" y="315" width="340" height="300" rx="40" fill="{body}"/>
<rect x="230" y="315" width="40" height="300" rx="20" fill="#fff" opacity=".18"/>
{label(230, 445, 340, brand, name, ink)}'''
    elif kind == "tube":
        g = f'''<path d="M285 180 h230 l-18 420 h-194 z" fill="{body}"/>
<rect x="290" y="168" width="220" height="24" rx="6" fill="{accent}"/>
<rect x="335" y="600" width="130" height="70" rx="12" fill="{accent}"/>
<path d="M300 200 h26 l-12 390 h-20 z" fill="#fff" opacity=".2"/>
{label(285, 360, 230, brand, name, ink, .85)}'''
    elif kind == "bottle":
        g = f'''<rect x="352" y="150" width="96" height="90" rx="10" fill="{accent}"/>
<rect x="370" y="235" width="60" height="40" fill="{accent}" opacity=".85"/>
<rect x="270" y="270" width="260" height="400" rx="60" fill="{body}"/>
<rect x="290" y="300" width="30" height="340" rx="15" fill="#fff" opacity=".2"/>
{label(270, 450, 260, brand, name, ink, .9)}'''
    elif kind == "box":
        g = f'''<path d="M240 260 l60 -50 h260 l-60 50 z" fill="{accent}"/>
<path d="M500 260 l60 -50 v380 l-60 50 z" fill="{accent}" opacity=".75"/>
<rect x="240" y="260" width="260" height="380" fill="{body}"/>
{label(240, 420, 260, brand, name, ink, .9)}'''
    elif kind == "pouch":
        g = f'''<path d="M250 230 q150 -30 300 0 l20 400 q-170 40 -340 0 z" fill="{body}"/>
<rect x="250" y="226" width="300" height="34" rx="6" fill="{accent}"/>
<circle cx="400" cy="560" r="44" fill="{accent}" opacity=".9"/>
{label(250, 380, 300, brand, name, ink)}'''
    elif kind == "bar":
        g = f'''<rect x="200" y="330" width="400" height="230" rx="80" fill="{body}"/>
<rect x="230" y="350" width="340" height="40" rx="20" fill="#fff" opacity=".22"/>
{label(200, 450, 400, brand, name, ink)}'''
    elif kind == "lip":
        g = f'''<rect x="335" y="200" width="130" height="200" rx="18" fill="{accent}"/>
<rect x="320" y="390" width="160" height="290" rx="20" fill="{body}"/>
<rect x="335" y="410" width="22" height="250" rx="11" fill="#fff" opacity=".2"/>
<text x="400" y="560" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="{ink}" transform="rotate(-90 400 540)">{esc(brand)}</text>'''
    elif kind == "tin":
        g = f'''<ellipse cx="400" cy="300" rx="190" ry="50" fill="{accent}"/>
<rect x="210" y="300" width="380" height="300" fill="{body}"/>
<ellipse cx="400" cy="600" rx="190" ry="50" fill="{body}"/>
{label(210, 440, 380, brand, name, ink)}'''
    return g

def svg(slug, kind, body, accent, ink, brand, name, backdrop=None):
    bd = f'<circle cx="400" cy="420" r="300" fill="{backdrop}"/>' if backdrop else ""
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
{bd}<ellipse cx="400" cy="700" rx="210" ry="22" fill="#000" opacity=".08"/>
{shape(kind, body, accent, ink, brand, name)}
</svg>'''
    return s

PRODUCTS = [
  ("silka-papaya-soap", "bar", "#F7A25B", "#E8873A", "#5A2A00", "Silka", "Papaya Soap"),
  ("belo-sunexpert-spf50", "tube", "#FFFFFF", "#F2C230", "#281A39", "Belo", "Sunexpert SPF50"),
  ("creamsilk-hair-reborn", "jar", "#E9D7F5", "#B79AD6", "#281A39", "Cream Silk", "Hair Reborn"),
  ("human-nature-sunflower-oil", "bottle", "#F4C542", "#3E7B3A", "#2B2B00", "Human Nature", "Sunflower Oil"),
  ("human-nature-shampoo", "bottle", "#CFE7D2", "#3E7B3A", "#123B16", "Human Nature", "Shampoo"),
  ("salabat-ginger-tea", "box", "#F3E2B3", "#C08A2B", "#4A2F00", "Salabat", "Ginger Tea"),
  ("malunggay-capsules", "jar", "#D7EBC9", "#5B8E3E", "#173A0B", "Moringa", "Capsules 60s"),
  ("choc-nut-24", "box", "#F2E2C4", "#7A4A23", "#3D2410", "Choc Nut", "24 Pieces"),
  ("boy-bawang-garlic", "pouch", "#F7D43B", "#D7262E", "#5A0E0E", "Boy Bawang", "Garlic Cornick"),
  ("7d-dried-mangoes", "pouch", "#FFB938", "#2C7A3D", "#3D1F00", "7D", "Dried Mangoes"),
  ("ube-halaya", "jar", "#7B4FA6", "#EFEBE0", "#FFFFFF", "Lola's Kusina", "Ube Halaya"),
  ("skyflakes-crackers", "box", "#2C6BD9", "#F6F6F6", "#FFFFFF", "SkyFlakes", "Crackers"),
  ("tiny-buds-baby-powder", "bottle", "#FFFFFF", "#9ED3F2", "#1F2BF3", "Tiny Buds", "Baby Powder"),
  ("baby-cologne", "bottle", "#FFE4EC", "#FB6B90", "#281A39", "Baby", "Cologne"),
  ("ever-bilena-lip-cream", "lip", "#B4384F", "#1A1A1A", "#FFFFFF", "Ever Bilena", ""),
  ("calamansi-body-wash", "tube", "#E3F1B5", "#7EA524", "#22340A", "Kalamansi", "Body Wash"),
]
backdrops = ["#FFE4EC", "#EFEBE0", "#E8EEFF"]
for slug, *rest in PRODUCTS:
    open(os.path.join(OUT, f"{slug}-1.svg"), "w").write(svg(slug, *rest))
    for i, bd in enumerate(backdrops[:2]):
        open(os.path.join(OUT, f"{slug}-{i+2}.svg"), "w").write(svg(slug, *rest, backdrop=bd))
print("ok", len(PRODUCTS))
