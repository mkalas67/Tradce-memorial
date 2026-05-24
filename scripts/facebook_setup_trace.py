"""
trace.memorial — Facebook Page Setup & Post Scheduler
======================================================

Uses the same long-lived token as the Academy setup script.
Token covers both pages (same Business Portfolio).

Run:  python scripts/facebook_setup_trace.py
"""

import os
import json
import time
import requests
from pathlib import Path
from datetime import datetime, timezone

# -- Config -------------------------------------------------------------------

USER_ACCESS_TOKEN = "EAAWSo5Gt8zoBRgNjqZCBmtMinv0HSRbPAS78i0Tl5NMZCOeHV6kCepDUhmP3bI1ikZB0WUZBVd60gpQpAX7ksU5yrTah3QncmKf8qOZCS41QA4PZB9ri7WEyHNvoZBbYigsTfOPc6ZC5zXG5ainkrDJ8AAklZCWZAb3cUiZCBwrCVBinRZASiJ4MIRb9xZCJ7KwZDZD"

PAGE_ID = "1104616522737038"  # trace.memorial

VISUALS_DIR = Path(__file__).parent.parent / "visuals"

# -- Page info ----------------------------------------------------------------

PAGE_INFO = {
    "about": (
        "Permanent memorial pages for the pets you have loved and lost. "
        "Built with care. Kept forever."
    ),
    "description": (
        "trace.memorial creates beautiful, permanent memorial pages for the pets we lose.\n\n"
        "Each page holds their name, their story, the photographs you treasure most, "
        "and the words that capture the bond you shared. Built to last, at a simple "
        "address you can share with anyone who loved them.\n\n"
        "For a limited time, the first 100 pages are completely free.\n\n"
        "A product of the Academy for Pet Loss."
    ),
    "website": "https://trace.memorial",
    "emails": '["hello@trace.memorial"]',
}

# -- Photos to upload to the page gallery -------------------------------------
# These appear in the Photos tab of the page and give visitors real examples.

GALLERY_PHOTOS = [
    {
        "file": "Montage _ 4 memorials _warm_.png",
        "caption": "Four memorial pages, four different pets, four different stories. trace.memorial builds a permanent page for each of them.",
    },
    {
        "file": "Montage _ 4 memorials _cool_.png",
        "caption": "Every memorial is different. A different palette, a different story, a different set of photographs. These are a few of the pages we have built.",
    },
    {
        "file": "All six _ cream.png",
        "caption": "Six memorial pages, six colour palettes. Each one shaped around the pet it was built for.",
    },
    {
        "file": "Portrait _ Bella.png",
        "caption": "Bella's memorial page. Her story, her photographs, the bond she shared — kept permanently at trace.memorial.",
    },
    {
        "file": "Portrait _ Pepper.png",
        "caption": "Pepper's memorial page in the Sky palette. Every detail chosen to suit him.",
    },
    {
        "file": "Portrait _ Willow.png",
        "caption": "Willow's memorial page in the Lavender palette. Built to hold everything she meant.",
    },
    {
        "file": "Meadow _ Bella.png",
        "caption": "The Meadow palette — soft greens for a pet who lived close to the ground.",
    },
    {
        "file": "Ocean _ Captain.png",
        "caption": "Captain's page in the Ocean palette. Cool blues for a cool cat.",
    },
    {
        "file": "Golden _ Honey.png",
        "caption": "Honey's page in the Golden palette. Warm amber for a warm presence.",
    },
    {
        "file": "Rose _ Rosie.png",
        "caption": "Rosie's page in the Rose palette. Chosen because it suited her.",
    },
]

# -- Post schedule ------------------------------------------------------------

def ts(date_str):
    """Convert 'YYYY-MM-DD HH:MM' UTC string to Unix timestamp."""
    dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
    return int(dt.timestamp())


POSTS = [
    {
        "image": "trace-memorial-post-hero.png",
        "message": (
            "Every pet leaves behind a story worth keeping.\n\n"
            "trace.memorial builds permanent memorial pages for the pets we lose. "
            "A page shaped around their life — their name, their story, the photos "
            "you love most, the things that made them who they were.\n\n"
            "It lives at a simple address, forever. Share it with anyone who loved them.\n\n"
            "For a short time, the first 100 pages are free — a $99 value, at no charge.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-02 09:00",
    },
    {
        "image": "Announce _ Bella.png",
        "message": (
            "This is Bella's page.\n\n"
            "Her name, her story, the golden years she gave her family, and the "
            "specific way she made herself known in every room she walked into.\n\n"
            "Bella's memorial lives permanently at trace.memorial. If you have lost "
            "a pet and would like to build something like this for them, the first "
            "100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-05 09:00",
    },
    {
        "image": "trace-memorial-post-howitworks.png",
        "message": (
            "Here is how trace.memorial works.\n\n"
            "You tell us about your pet. We send you a simple form — their story, "
            "their photographs, the things that made them who they were. We build "
            "the page and it stays live permanently at a simple, shareable address.\n\n"
            "No technical knowledge needed. You do not need to be working with a "
            "counsellor. You just need to want to remember them properly.\n\n"
            "The first 100 pages are free.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-09 09:00",
    },
    {
        "image": "Quote _ Honey.png",
        "message": (
            "Some pets are that attuned. They read the room before you do. "
            "They arrive before you know you needed them.\n\n"
            "A trace.memorial page is a place to say that. Not in a sympathy card, "
            "not in a passing comment — but properly, in full, for as long as the "
            "page lives.\n\n"
            "Free for the first 100.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-12 09:00",
    },
    {
        "image": "Portrait _ Willow.png",
        "message": (
            "This is Willow's page.\n\n"
            "Each trace.memorial page is built around the pet — their name, their "
            "story, the people they loved and the ones who loved them. Photographs, "
            "the things they were known for, the bond that does not end because they have.\n\n"
            "Nine colour palettes. Permanent hosting. A page that is entirely theirs.\n\n"
            "The first 100 pages are free — a $99 value, at no charge.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-16 09:00",
    },
    {
        "image": "trace-memorial-post-tagline.png",
        "message": (
            "They deserve more than a moment.\n\n"
            "Pet grief is real grief. The silence in the house. The routine that no "
            "longer exists. The space they occupied that nothing quite fills.\n\n"
            "trace.memorial was built for this. A permanent page, built properly, "
            "for the pet you lost.\n\n"
            "The first 100 pages are free. Spaces are limited.\n\n"
            "trace.memorial"
        ),
        "scheduled_time": "2026-06-19 09:00",
    },
    {
        "image": "Montage _ 4 memorials _warm_.png",
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
        "image": "Announce _ Rosie.png",
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

# -- Helpers ------------------------------------------------------------------

def get_page_token(user_token, page_id):
    resp = requests.get(
        "https://graph.facebook.com/v21.0/me/accounts",
        params={"access_token": user_token, "limit": 50},
    )
    resp.raise_for_status()
    pages = resp.json().get("data", [])
    for page in pages:
        if page["id"] == page_id:
            print(f"  Found page: {page['name']} ({page['id']})")
            return page["access_token"]
    ids_found = [p["id"] for p in pages]
    raise ValueError(
        f"Page {page_id} not found in managed pages.\nFound: {ids_found}"
    )


def update_page_info(page_id, page_token, info):
    resp = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}",
        params={"access_token": page_token},
        data=info,
    )
    resp.raise_for_status()
    print(f"  Page info updated: {resp.json()}")


def upload_profile_photo(page_id, page_token, image_path):
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/picture",
            params={"access_token": page_token},
            files={"source": f},
        )
    resp.raise_for_status()
    print(f"  Profile photo set.")


def upload_cover_photo(page_id, page_token, image_path):
    """Note: may fail on new-style pages — upload manually if so."""
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "false"},
            files={"source": f},
        )
    resp.raise_for_status()
    photo_id = resp.json()["id"]
    resp2 = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}",
        params={"access_token": page_token},
        data={"cover": json.dumps({"id": photo_id})},
    )
    if resp2.ok:
        print(f"  Cover photo set.")
    else:
        print(f"  Cover photo API blocked (new-style page) — upload manually via Facebook.")


def upload_page_photo(page_id, page_token, image_path, caption):
    """Upload a published photo to the page gallery."""
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "true", "caption": caption},
            files={"source": f},
        )
    if resp.ok:
        print(f"  Gallery photo uploaded: {image_path.name}")
    else:
        print(f"  WARNING: {image_path.name} failed — {resp.text[:120]}")
    time.sleep(2)


def schedule_post_with_image(page_id, page_token, image_path, message, scheduled_unix):
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "false"},
            files={"source": f},
        )
    resp.raise_for_status()
    photo_id = resp.json()["id"]

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
    resp2.raise_for_status()
    post_id = resp2.json().get("id")
    scheduled_dt = datetime.fromtimestamp(scheduled_unix, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"  Scheduled: {image_path.name} -> {scheduled_dt} [{post_id}]")

# -- Main ---------------------------------------------------------------------

def main():
    print("\n-- Step 1: Getting page access token --")
    page_token = get_page_token(USER_ACCESS_TOKEN, PAGE_ID)

    print("\n-- Step 2: Updating page info --")
    update_page_info(PAGE_ID, page_token, PAGE_INFO)

    print("\n-- Step 3: Uploading profile photo --")
    profile_path = VISUALS_DIR / "trace-memorial-profile.png"
    upload_profile_photo(PAGE_ID, page_token, profile_path)

    print("\n-- Step 4: Attempting cover photo --")
    cover_path = VISUALS_DIR / "trace-memorial-fb-cover.png"
    upload_cover_photo(PAGE_ID, page_token, cover_path)

    print("\n-- Step 5: Uploading page gallery photos --")
    for photo in GALLERY_PHOTOS:
        image_path = VISUALS_DIR / photo["file"]
        if not image_path.exists():
            print(f"  WARNING: Not found, skipping: {image_path.name}")
            continue
        upload_page_photo(PAGE_ID, page_token, image_path, photo["caption"])

    print("\n-- Step 6: Scheduling posts --")
    for post in POSTS:
        image_path = VISUALS_DIR / post["image"]
        if not image_path.exists():
            print(f"  WARNING: Image not found, skipping: {post['image']}")
            continue
        scheduled_unix = ts(post["scheduled_time"])
        if scheduled_unix < time.time() + 600:
            print(f"  WARNING: {post['scheduled_time']} is too soon or in the past, skipping.")
            continue
        print(f"  Posting: {post['image']} -> {post['scheduled_time']}")
        schedule_post_with_image(PAGE_ID, page_token, image_path, post["message"], scheduled_unix)
        time.sleep(1)

    print("\nDone.")


if __name__ == "__main__":
    main()
