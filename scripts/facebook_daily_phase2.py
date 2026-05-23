"""
trace.memorial — Daily launch posts, Phase 2
=============================================
All posts for 23 June – 3 July 2026 (11 posts).

RUN THIS ON OR AFTER 15 JUNE 2026.
The dates from 23 June onwards are outside the 30-day scheduling window
until mid-June. The script will warn and skip any post that is still out of range.

Posts 22, 25, 29, 32 (from the original plan) are included here because they
were never scheduled. All 11 posts in this file cover the full June 23–July 3 window.
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
    # Post 22 — Tue 23 June — Montage warm
    {
        "image": "Montage _ 4 memorials _warm_.png",
        "message": (
            "Four memorial pages. Four different pets. Four different stories, but the "
            "same truth in each of them.\n\n"
            "The bond between a person and their animal companion is one of the most "
            "complete bonds there is. trace.memorial was built to honour it.\n\n"
            "If you have lost a pet, or know someone who has, their story deserves "
            "a permanent home.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-23 09:00",
    },
    # Post 23 — Wed 24 June — Quote Rosie
    {
        "image": "Quote _ Rosie.png",
        "message": (
            "She was the one who knew when you needed her.\n\n"
            "She did not wait to be asked. She simply came and sat with you "
            "until it was better.\n\n"
            "Rosie's page holds that. Permanently, at trace.memorial.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-24 09:00",
    },
    # Post 24 — Thu 25 June — Rose Rosie
    {
        "image": "Rose _ Rosie.png",
        "message": (
            "The Rose palette.\n\n"
            "Soft and warm, chosen by Rosie's family because it suited who she was.\n\n"
            "Each trace.memorial page is built in a palette that fits the pet. "
            "Not just a template, but a choice.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-25 09:00",
    },
    # Post 25 — Fri 26 June — Announce Rosie
    {
        "image": "Announce _ Rosie.png",
        "message": (
            "This is Rosie's page.\n\n"
            "Her family chose the Rose palette for her, because it suited her. "
            "They told her story, and we built a page that holds it, permanently, "
            "at a simple address they can share with anyone who loved her.\n\n"
            "If you would like to build a page like this for your pet, the first "
            "100 are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-26 09:00",
    },
    # Post 26 — Sat 27 June — Excerpt Rosie miss
    {
        "image": "Excerpt _ Rosie _ miss.png",
        "message": (
            "This is from Rosie's page.\n\n"
            "The words her family wrote. What they miss. What she meant.\n\n"
            "Every trace.memorial page holds words like these, permanently, at a simple "
            "address, for as long as the page lives.\n\n"
            "A few spaces left. Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-27 09:00",
    },
    # Post 27 — Sun 28 June — Sky Pepper
    {
        "image": "Sky _ Pepper.png",
        "message": (
            "The Sky palette.\n\n"
            "Cool and open. This is Pepper's page, in the colour his family chose for him.\n\n"
            "trace.memorial builds each page around the pet. "
            "You choose the palette. We build the rest.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-28 09:00",
    },
    # Post 28 — Mon 29 June — Quote Pepper
    {
        "image": "Quote _ Pepper.png",
        "message": (
            "Some dogs are enormous company.\n\n"
            "Not in a noisy way. Just in the way they are always there, always "
            "interested, always certain that wherever you are is the right place to be.\n\n"
            "Pepper's page holds that certainty.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-29 09:00",
    },
    # Post 29 — Tue 30 June — Quote Bella
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
    # Post 30 — Wed 1 July — Announce Pepper
    {
        "image": "Announce _ Pepper.png",
        "message": (
            "This is Pepper's page.\n\n"
            "His family chose the Sky palette. They told his story, chose the "
            "photographs, and described what he was in the best way they could.\n\n"
            "It is kept permanently at trace.memorial.\n\n"
            "The first 100 pages are free. A few spaces remain.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-07-01 09:00",
    },
    # Post 31 — Thu 2 July — Excerpt Pepper legacy
    {
        "image": "Excerpt _ Pepper _ legacy.png",
        "message": (
            "This is from Pepper's page.\n\n"
            "What his family wrote about what he left behind.\n\n"
            "A trace.memorial page holds this kind of writing permanently, at a simple "
            "address anyone who loved him can visit.\n\n"
            "Last few spaces. Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-07-02 09:00",
    },
    # Post 32 — Fri 3 July — Portrait Pepper
    {
        "image": "Portrait _ Pepper.png",
        "message": (
            "Pepper's page.\n\n"
            "Sky blue palette, because that is what suited him. His story, the "
            "photographs his family chose, and the words that capture what he was, "
            "kept permanently at trace.memorial.\n\n"
            "A page like this takes a few days to build. It stays for years.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-07-03 09:00",
    },
]


def main():
    now = __import__("time").time()
    earliest = ts(POSTS[0]["scheduled_time"])
    days_to_earliest = (earliest - now) / 86400

    print(f"\ntrace.memorial — Daily Phase 2 ({len(POSTS)} posts, 23 June–3 July)\n")

    if days_to_earliest > 30:
        days_remaining = int(days_to_earliest - 30)
        print(
            f"WARNING: The earliest post ({POSTS[0]['scheduled_time']}) is still "
            f"{days_to_earliest:.0f} days away.\n"
            f"Facebook only allows scheduling up to 30 days ahead for newer pages.\n"
            f"Re-run this script in approximately {days_remaining} day(s) (on or after 15 June).\n"
        )

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
            print(f"  SKIP: still outside 30-day window — re-run later\n")
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
    if skip > 0:
        print(f"Re-run this script on or after 15 June to pick up any skipped posts.")


if __name__ == "__main__":
    main()
