"""Retry the remaining 4 scheduled posts (7-10) for trace.memorial."""

import json
import time
import requests
from pathlib import Path
from datetime import datetime, timezone

USER_ACCESS_TOKEN = "EAAWSo5Gt8zoBRgNjqZCBmtMinv0HSRbPAS78i0Tl5NMZCOeHV6kCepDUhmP3bI1ikZB0WUZBVd60gpQpAX7ksU5yrTah3QncmKf8qOZCS41QA4PZB9ri7WEyHNvoZBbYigsTfOPc6ZC5zXG5ainkrDJ8AAklZCWZAb3cUiZCBwrCVBinRZASiJ4MIRb9xZCJ7KwZDZD"
PAGE_ID = "1104616522737038"
VISUALS_DIR = Path(__file__).parent.parent / "visuals"

def ts(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
    return int(dt.timestamp())

def get_page_token(user_token, page_id):
    resp = requests.get(
        "https://graph.facebook.com/v21.0/me/accounts",
        params={"access_token": user_token, "limit": 50},
    )
    resp.raise_for_status()
    for page in resp.json().get("data", []):
        if page["id"] == page_id:
            return page["access_token"]
    raise ValueError("Page not found")

def schedule_post_with_image(page_id, page_token, image_path, message, scheduled_unix):
    print(f"  Uploading image: {image_path.name} ({image_path.stat().st_size // 1024}KB)")
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "false"},
            files={"source": f},
        )
    if not resp.ok:
        print(f"  ERROR uploading image: {resp.text}")
        return
    photo_id = resp.json()["id"]

    time.sleep(3)

    resp2 = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}/feed",
        params={"access_token": page_token},
        data={
            "message": message,
            "attached_media": json.dumps([{"media_fbid": photo_id}]),
            "scheduled_publish_time": str(scheduled_unix),
            "published": "false",
        },
    )
    if not resp2.ok:
        print(f"  ERROR scheduling post: {resp2.text}")
        return
    post_id = resp2.json().get("id")
    scheduled_dt = datetime.fromtimestamp(scheduled_unix, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"  Scheduled: {scheduled_dt} [{post_id}]")

POSTS = [
    {
        "image": "Announce _ Rosie.png",   # swapping montage for lighter image
        "message": (
            "Four memorial pages. Four different pets. Four different stories — "
            "but the same truth in each of them.\n\n"
            "The bond between a person and their animal companion is one of the "
            "most complete bonds there is. trace.memorial was built to honour it.\n\n"
            "If you have lost a pet, or know someone who has, their story deserves "
            "a permanent home.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-23 09:00",
    },
    {
        "image": "Quote _ Willow.png",
        "message": (
            "This is Rosie's page.\n\n"
            "Her family chose the Rose palette for her, because it suited her. "
            "They told her story, and we built a page that holds it — permanently, "
            "at a simple address they can share with anyone who loved her.\n\n"
            "If you would like to build a page like this for your pet, the first "
            "100 are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-26 09:00",
    },
    {
        "image": "Quote _ Bella.png",
        "message": (
            "Some pets fill a space in a way that makes the silence, when it comes, "
            "feel impossible.\n\n"
            "That is what trace.memorial is for. Not to hold grief, but to hold them.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-30 09:00",
    },
    {
        "image": "Portrait _ Pepper.png",
        "message": (
            "Pepper's page.\n\n"
            "Sky blue palette, because that is what suited him. His story, the "
            "photographs his family chose, and the words that capture what he was "
            "— kept permanently at trace.memorial.\n\n"
            "A page like this takes a few days to build. It stays for years.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-07-03 09:00",
    },
]

page_token = get_page_token(USER_ACCESS_TOKEN, PAGE_ID)
print(f"Got page token.\n")

for post in POSTS:
    image_path = VISUALS_DIR / post["image"]
    if not image_path.exists():
        print(f"  Skipping (not found): {post['image']}")
        continue
    scheduled_unix = ts(post["scheduled_time"])
    print(f"  -> {post['image']} / {post['scheduled_time']}")
    schedule_post_with_image(PAGE_ID, page_token, image_path, post["message"], scheduled_unix)
    time.sleep(2)

print("\nDone.")
