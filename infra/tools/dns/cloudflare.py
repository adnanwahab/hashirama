#!/usr/bin/env python3

import os
import json
import requests
from dns import zone, rdatatype

# Cloudflare API configuration
API_TOKEN = 'kJO0IwzZ9z73q2tWQnEiKLI_Uy4HGtqDJPMmDkB0'
BASE_URL = 'https://api.cloudflare.com/client/v4'
HEADERS = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def get_zone_id(domain):
    url = f'{BASE_URL}/zones?name={domain}'
    response = requests.get(url, headers=HEADERS)
    data = response.json()
    if data['success'] and data['result']:
        return data['result'][0]['id']
    return None

def create_dns_record(zone_id, record):
    url = f'{BASE_URL}/zones/{zone_id}/dns_records'
    response = requests.post(url, headers=HEADERS, json=record)
    return response.json()

def main():
    domains = [
        "hashirama.bio", "hashirama.lol", "hashirama.info", "hashirama.art",
        "leafstudio.design", "michael-pollan.app",
        "taiyongrobotics.com",
    ]

    mx_records = [
        {"type": "MX", "name": "@", "content": "aspmx.l.google.com", "priority": 1, "ttl": 3600},
        {"type": "MX", "name": "@", "content": "alt2.aspmx.l.google.com", "priority": 5, "ttl": 3600},
        {"type": "MX", "name": "@", "content": "alt3.aspmx.l.google.com", "priority": 10, "ttl": 3600}
    ]

    txt_record = {
        "type": "TXT",
        "name": "@",
        "content": "google-site-verification=your_verification_code_here",
        "ttl": 3600
    }

    for domain in domains:
        print(f"Processing {domain}...")
        zone_id = get_zone_id(domain)
        if not zone_id:
            print(f"Failed to get zone ID for {domain}. Skipping.")
            continue

        for record in mx_records:
            result = create_dns_record(zone_id, record)
            if result['success']:
                print(f"Successfully added MX record for {domain}: {record['content']} (Priority: {record['priority']})")
            else:
                print(f"Failed to add MX record for {domain}: {result['errors']}")

        result = create_dns_record(zone_id, txt_record)
        if result['success']:
            print(f"Successfully added TXT record for {domain}")
        else:
            print(f"Failed to add TXT record for {domain}: {result['errors']}")

    print("DNS record upload process completed.")




if __name__ == "__main__":
    main()
