"""
trace.memorial — Daily launch posts, Phase 1
=============================================
Fill-in posts for 3–22 June 2026 (15 posts).
Slots already covered by facebook_setup_trace.py are skipped here:
  5 Jun, 9 Jun, 12 Jun, 16 Jun, 19 Jun (posts 4, 8, 11, 15, 18).

Run now — all dates fall within the 30-day scheduling window.
"""

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
    print(f"  Uploading: {image_path.name} ({image_path.stat().st_size // 1024} KB)")
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "false"},
            files={"source": f},
        )
    if not resp.ok:
        print(f"  ERROR uploading image: {resp.text}")
        return False
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
        return False
    post_id = resp2.json().get("id")
    scheduled_dt = datetime.fromtimestamp(scheduled_unix, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"  Scheduled: {scheduled_dt} [{post_id}]")
    return True


POSTS = [
    # Post 2 — Wed 3 June — Willow announce
    {
        "image": "Announce _ Willow.png",
        "message": (
            "This is Willow's page.\n\n"
            "She was the kind of presence that changed the feel of a room. Her family "
            "chose the Lavender palette, and when they saw it they said it was exactly right.\n\n"
            "Her story is held permanently at trace.memorial, at a simple address they "
            "can carry with them and share with anyone who loved her.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-03 09:00",
    },
    # Post 3 — Thu 4 June — Quote Willow
    {
        "image": "Quote _ Willow.png",
        "message": (
            "They stay with you.\n\n"
            "Not in the way people expect. Not as sadness, but as a presence that "
            "shaped who you are and how you see things.\n\n"
            "trace.memorial is a place to keep that. Not to hold grief, but to hold them.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-04 09:00",
    },
    # Post 5 — Sat 6 June — Excerpt Bella bond
    {
        "image": "Excerpt _ Bella _ bond.png",
        "message": (
            "This is from Bella's page.\n\n"
            "The words her family wrote about her. The bond they described. The things "
            "they wanted to make sure were not forgotten.\n\n"
            "Every trace.memorial page holds writing like this, permanently, at a simple address.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-06 09:00",
    },
    # Post 6 — Sun 7 June — Meadow Bella
    {
        "image": "Meadow _ Bella.png",
        "message": (
            "The Meadow palette.\n\n"
            "Soft greens and warm earth tones, for a pet who was part of the landscape of a life.\n\n"
            "Nine palettes to choose from. Each one exists because some pets suit certain colours.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-07 09:00",
    },
    # Post 7 — Mon 8 June — Portrait Bella
    {
        "image": "Portrait _ Bella.png",
        "message": (
            "This is Bella's full page.\n\n"
            "Her name, her dates, her story, and the things she was known for. "
            "The photographs her family chose, and the words they wrote.\n\n"
            "Kept permanently at trace.memorial.\n\n"
            "The first 100 pages are free — a $99 value, at no charge.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-08 09:00",
    },
    # Post 9 — Wed 10 June — Quote Shadow
    {
        "image": "Quote _ Shadow.png",
        "message": (
            "Some pets stay very quiet.\n\n"
            "They do not ask for much. But they are always there, in the same spot, "
            "at the same time, making the day make sense.\n\n"
            "The silence they leave behind is enormous.\n\n"
            "trace.memorial was built for that silence.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-10 09:00",
    },
    # Post 10 — Thu 11 June — Monochrome Shadow
    {
        "image": "Monochrome _ Shadow.png",
        "message": (
            "The Monochrome palette.\n\n"
            "For a pet whose presence was steady and constant. Clean and lasting.\n\n"
            "Each of the nine palettes can be applied to any memorial. "
            "You choose the one that fits.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-11 09:00",
    },
    # Post 12 — Sat 13 June — Golden Honey
    {
        "image": "Golden _ Honey.png",
        "message": (
            "The Golden palette.\n\n"
            "Warm amber tones, for a warm presence. This is Honey's page, "
            "in the colour that suited her.\n\n"
            "trace.memorial builds each page around the pet. The palette is part of that.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-13 09:00",
    },
    # Post 13 — Sun 14 June — Announce Honey
    {
        "image": "Announce _ Honey.png",
        "message": (
            "This is Honey's page.\n\n"
            "She was golden in more ways than one. Her family chose the Golden palette "
            "because it was right for her. They told her story, and it is held "
            "permanently at trace.memorial.\n\n"
            "If you have lost a pet, the first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-14 09:00",
    },
    # Post 14 — Mon 15 June — Ocean Captain
    {
        "image": "Ocean _ Captain.png",
        "message": (
            "The Ocean palette.\n\n"
            "Cool blues for a cool cat. This is Captain's page, in the colour that matched him.\n\n"
            "Every trace.memorial page is built around who the pet actually was.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-15 09:00",
    },
    # Post 16 — Wed 17 June — Lavender Willow
    {
        "image": "Lavender _ Willow.png",
        "message": (
            "The Lavender palette.\n\n"
            "Soft and settled. For a pet who made the home feel calm.\n\n"
            "This is Willow's page, in the colour her family chose for her.\n\n"
            "Nine palettes available. The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-17 09:00",
    },
    # Post 17 — Thu 18 June — Excerpt Willow miss
    {
        "image": "Excerpt _ Willow _ miss.png",
        "message": (
            "This is from Willow's page.\n\n"
            "The words her family wrote. What they miss. What she meant.\n\n"
            "Kept permanently at a simple address, for anyone who loved her.\n\n"
            "That is what a trace.memorial page holds.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-18 09:00",
    },
    # Post 19 — Sat 20 June — All six cream
    {
        "image": "All six _ cream.png",
        "message": (
            "Six pages, six palettes, six different pets.\n\n"
            "Meadow. Lavender. Sky. Ocean. Golden. Rose.\n\n"
            "Each one built around the pet it was made for. Different stories, "
            "different colours, the same permanence.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-20 09:00",
    },
    # Post 20 — Sun 21 June — Montage cool
    {
        "image": "Montage _ 4 memorials _cool_.png",
        "message": (
            "Different palettes. Different pets. Different families.\n\n"
            "The same thing in each of them: a story that deserved to be kept properly.\n\n"
            "trace.memorial builds a permanent page for the pet you have lost. "
            "Simple to share, kept forever.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-21 09:00",
    },
    # Post 21 — Mon 22 June — Quote Captain
    {
        "image": "Quote _ Captain.png",
        "message": (
            "Some cats choose you.\n\n"
            "They do not need you to understand them. They simply decide you are "
            "theirs, and that is the whole arrangement.\n\n"
            "When they go, the absence is its own kind of answer.\n\n"
            "trace.memorial holds that.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-22 09:00",
    },
]


def main():
    print(f"\ntrace.memorial — Daily Phase 1 ({len(POSTS)} posts, 3–22 June)\n")
    page_token = get_page_token(USER_ACCESS_TOKEN, PAGE_ID)
    print(f"Got page token.\n")

    ok = 0
    skip = 0
    for post in POSTS:
        image_path = VISUALS_DIR / post["image"]
        scheduled_unix = ts(post["scheduled_time"])
        now = __import__("time").time()

        print(f"-> {post['scheduled_time']}  {post['image']}")

        if not image_path.exists():
            print(f"  SKIP: image not found\n")
            skip += 1
            continue

        if scheduled_unix < now + 600:
            print(f"  SKIP: date is in the past or too soon\n")
            skip += 1
            continue

        if scheduled_unix > now + 30 * 86400:
            print(f"  SKIP: date is more than 30 days out — run phase2 script on 15 June\n")
            skip += 1
            continue

        success = schedule_post_with_image(
            PAGE_ID, page_token, image_path, post["message"], scheduled_unix
        )
        if success:
            ok += 1
        time.sleep(2)
        print()

    print(f"\nDone. Scheduled: {ok}  Skipped: {skip}")


if __name__ == "__main__":
    main()
