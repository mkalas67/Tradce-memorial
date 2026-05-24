"""
trace.memorial — Complete Facebook page profile
================================================
Fills in the remaining page fields:
  mission, company_overview, general_info, founded
  + CTA button (Learn More -> trace.memorial)
  + cover photo retry

NOTE: The page name currently shows as "Trace Memorial" (capitalised).
This must be corrected manually in Facebook:
  Settings > Page Info > Page Name > Edit > "trace.memorial"
  Facebook will review the change (usually within a few hours).

Run:  python scripts/facebook_complete_profile.py
"""

import json
import time
import requests
from pathlib import Path

USER_ACCESS_TOKEN = "EAAWSo5Gt8zoBRgNjqZCBmtMinv0HSRbPAS78i0Tl5NMZCOeHV6kCepDUhmP3bI1ikZB0WUZBVd60gpQpAX7ksU5yrTah3QncmKf8qOZCS41QA4PZB9ri7WEyHNvoZBbYigsTfOPc6ZC5zXG5ainkrDJ8AAklZCWZAb3cUiZCBwrCVBinRZASiJ4MIRb9xZCJ7KwZDZD"
PAGE_ID = "1104616522737038"
VISUALS_DIR = Path(__file__).parent.parent / "visuals"

ADDITIONAL_INFO = {
    "mission": (
        "To give every lost pet a permanent place to be remembered. "
        "Their name, their story, the photographs, the bond. "
        "Kept at a simple address, forever."
    ),
    "company_overview": (
        "trace.memorial was built for the people who know that losing a pet is real loss.\n\n"
        "We create permanent memorial pages for pets: a page shaped around who they were, "
        "built with care, and kept at a simple web address the family can share with anyone "
        "who loved them.\n\n"
        "Each page holds the pet's name and story, the photographs their family treasures "
        "most, and the words that capture the bond they shared. Nine colour palettes. "
        "Permanent hosting. A page that is entirely theirs.\n\n"
        "Pages take a few days to build. They stay live for years.\n\n"
        "trace.memorial is a product of the Academy for Pet Loss."
    ),
    "general_info": (
        "To get started, visit trace.memorial and fill in the enquiry form. "
        "We will send you a simple intake form to gather the details we need: "
        "your pet's story, the photographs you would like included, and your "
        "preferred colour palette.\n\n"
        "For a limited time, the first 100 pages are completely free — a $99 value "
        "at no charge. Spaces are limited.\n\n"
        "Questions? Email hello@trace.memorial."
    ),
    "founded": "2026",
}


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


def update_page_fields(page_id, page_token, fields):
    resp = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}",
        params={"access_token": page_token},
        data=fields,
    )
    if resp.ok:
        print(f"  OK: {resp.json()}")
    else:
        print(f"  ERROR: {resp.text}")
    return resp.ok


def set_cta_button(page_id, page_token):
    """Set a Learn More CTA button pointing to trace.memorial."""
    resp = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}/call_to_action",
        params={"access_token": page_token},
        data={
            "type": "LEARN_MORE",
            "web_url": "https://trace.memorial",
        },
    )
    if resp.ok:
        print(f"  CTA button set: {resp.json()}")
    else:
        # Try updating an existing CTA instead
        print(f"  Create failed ({resp.json().get('error', {}).get('message', '')}), trying update...")
        resp2 = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/call_to_action",
            params={"access_token": page_token},
            json={
                "type": "LEARN_MORE",
                "web_url": "https://trace.memorial",
            },
        )
        if resp2.ok:
            print(f"  CTA button updated: {resp2.json()}")
        else:
            print(f"  CTA ERROR: {resp2.text[:200]}")


def upload_cover_photo(page_id, page_token, image_path):
    """Upload and set the cover photo. Often blocked on new-style pages."""
    print(f"  Uploading cover image: {image_path.name}")
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/v21.0/{page_id}/photos",
            params={"access_token": page_token},
            data={"published": "false"},
            files={"source": f},
        )
    if not resp.ok:
        print(f"  ERROR uploading image: {resp.text[:200]}")
        return
    photo_id = resp.json()["id"]
    time.sleep(2)

    resp2 = requests.post(
        f"https://graph.facebook.com/v21.0/{page_id}",
        params={"access_token": page_token},
        data={"cover": json.dumps({"id": photo_id})},
    )
    if resp2.ok:
        print(f"  Cover photo set.")
    else:
        print(f"  Cover photo blocked (new-style page limitation).")
        print(f"  Upload manually: Facebook > Your Page > Edit cover photo > {image_path.name}")


def main():
    print("\n-- Getting page token --")
    page_token = get_page_token(USER_ACCESS_TOKEN, PAGE_ID)
    print(f"  Got token.\n")

    print("-- Updating additional page fields --")
    for field, value in ADDITIONAL_INFO.items():
        print(f"  Setting: {field}")
        update_page_fields(PAGE_ID, page_token, {field: value})
        time.sleep(1)

    print("\n-- Setting CTA button --")
    set_cta_button(PAGE_ID, page_token)

    print("\n-- Attempting cover photo --")
    cover_path = VISUALS_DIR / "trace-memorial-fb-cover.png"
    if cover_path.exists():
        upload_cover_photo(PAGE_ID, page_token, cover_path)
    else:
        print(f"  Cover image not found: {cover_path}")

    print("\nDone.")
    print("\n*** ACTION REQUIRED ***")
    print("Fix page name: Facebook > Settings > Page Info > Name > change to 'trace.memorial'")
    print("Upload cover photo manually if the API attempt above failed.")


if __name__ == "__main__":
    main()
