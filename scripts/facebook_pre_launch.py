"""
trace.memorial — Pre-launch posts
==================================
Fills the gap from tomorrow (24 May) through 1 June, plus retries 22 June.
Existing posts from 2 June onwards are already scheduled — do not touch them.

Run today (23 May).  All dates are within the 30-day window.
June 22 is at the boundary; if it fails, re-run tomorrow and it will go through.
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
    scheduled_dt = datetime.fromtimestamp(scheduled_unix, tz=timezone.utc).strftime(
        "%Y-%m-%d %H:%M UTC"
    )
    print(f"  Scheduled: {scheduled_dt} [{post_id}]")
    return True


POSTS = [
    # Sun 24 May — hero, launch day
    {
        "image": "trace-memorial-post-hero.png",
        "message": (
            "Every pet leaves behind a story worth keeping.\n\n"
            "trace.memorial builds permanent memorial pages for the animals we lose. "
            "A page shaped around who they were — their name, their story, the "
            "photographs you treasure most, the things that made them themselves.\n\n"
            "It lives at a simple address, forever. Share it with anyone who loved them.\n\n"
            "The first 100 pages are completely free — a $99 value, at no charge.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-24 09:00",
    },
    # Mon 25 May — Bank Holiday — Pepper announce
    {
        "image": "Announce _ Pepper.png",
        "message": (
            "This is Pepper's page.\n\n"
            "His family chose the Sky palette. They told his story, chose the "
            "photographs that suited him, and described what he was to them.\n\n"
            "A page like this lives permanently at trace.memorial, at a simple "
            "address, kept forever.\n\n"
            "If you have lost a pet, the first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-25 09:00",
    },
    # Tue 26 May — Quote Rosie
    {
        "image": "Quote _ Rosie.png",
        "message": (
            "She was the one who knew when you needed her.\n\n"
            "She did not wait to be asked. She simply arrived and sat with you.\n\n"
            "Rosie's page holds that, permanently, at trace.memorial.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-26 09:00",
    },
    # Wed 27 May — Shadow announce
    {
        "image": "Announce _ Shadow.png",
        "message": (
            "This is Shadow's page.\n\n"
            "His family chose the Monochrome palette, because it suited him. "
            "Steady and quiet, like he was. They told his story, and it is held "
            "permanently at trace.memorial.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-27 09:00",
    },
    # Thu 28 May — Excerpt Honey bond
    {
        "image": "Excerpt _ Honey _ bond.png",
        "message": (
            "This is from Honey's page.\n\n"
            "The words her family wrote about the bond they had with her. The things "
            "that were hard to say anywhere else but easy to say on a page built "
            "entirely for her.\n\n"
            "Every trace.memorial page holds something like this. Permanently.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-28 09:00",
    },
    # Fri 29 May — Quote Marmalade
    {
        "image": "Quote _ Marmalade.png",
        "message": (
            "Some cats are a whole household in one animal.\n\n"
            "They fill every corner, occupy every chair, and make themselves known "
            "in every room they choose to enter.\n\n"
            "The quiet they leave behind is not small.\n\n"
            "trace.memorial holds the story of that life.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-29 09:00",
    },
    # Sat 30 May — Sky Pepper palette
    {
        "image": "Sky _ Pepper.png",
        "message": (
            "The Sky palette.\n\n"
            "Cool, calm, and open. This is Pepper's page, in the colour his "
            "family felt was right for him.\n\n"
            "Nine palettes. You choose the one that fits. We build the rest.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-30 09:00",
    },
    # Sun 31 May — Rose Rosie palette
    {
        "image": "Rose _ Rosie.png",
        "message": (
            "The Rose palette.\n\n"
            "Soft pinks and warm tones, chosen by Rosie's family because it was her.\n\n"
            "Each trace.memorial page is built around the pet it belongs to. "
            "The palette is part of that.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-05-31 09:00",
    },
    # Mon 1 June — Excerpt Shadow legacy
    {
        "image": "Excerpt _ Shadow _ legacy.png",
        "message": (
            "This is from Shadow's page.\n\n"
            "The words his family wrote about what he left behind. What it meant "
            "to have had him. How much of his life shaped theirs.\n\n"
            "A trace.memorial page holds this permanently.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-01 09:00",
    },
    # Mon 22 June — Quote Captain (retry from phase 1 boundary failure)
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
    now = time.time()
    print(f"\ntrace.memorial — Pre-launch posts ({len(POSTS)} posts)\n")

    page_token = get_page_token(USER_ACCESS_TOKEN, PAGE_ID)
    print(f"Got page token.\n")

    ok = 0
    skip = 0
    for post in POSTS:
        image_path = VISUALS_DIR / post["image"]
        scheduled_unix = ts(post["scheduled_time"])

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
            print(f"  SKIP: outside 30-day window — re-run tomorrow\n")
            skip += 1
            continue

        success = schedule_post_with_image(
            PAGE_ID, page_token, image_path, post["message"], scheduled_unix
        )
        if success:
            ok += 1
        time.sleep(2)
        print()

    print(f"\nDone.  Scheduled: {ok}  Skipped: {skip}")
    if skip > 0:
        print("Re-run tomorrow to pick up any skipped posts (June 22 boundary).")


if __name__ == "__main__":
    main()
