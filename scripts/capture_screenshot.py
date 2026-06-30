from playwright.sync_api import sync_playwright
import os

SCREENSHOTS_DIR = "/Users/senko/business/apps/eati/landing/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

URL = "https://eatiapp.com/"

VIEWPORTS = [
    {"name": "desktop", "width": 1920, "height": 1080},
    {"name": "laptop",  "width": 1366, "height": 768},
    {"name": "tablet",  "width": 768,  "height": 1024},
    {"name": "mobile",  "width": 375,  "height": 812},
]

def capture(url, output_path, viewport_width=1920, viewport_height=1080):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=output_path, full_page=False)
        browser.close()
        print(f"Saved: {output_path}")

if __name__ == "__main__":
    for vp in VIEWPORTS:
        out = os.path.join(SCREENSHOTS_DIR, f"{vp['name']}_{vp['width']}x{vp['height']}.png")
        print(f"Capturing {vp['name']} ({vp['width']}x{vp['height']})...")
        capture(URL, out, vp["width"], vp["height"])
    print("All screenshots captured.")
