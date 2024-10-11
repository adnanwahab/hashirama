#!/usr/bin/env python3

import requests

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

def get_dns_records(zone_id):
    url = f'{BASE_URL}/zones/{zone_id}/dns_records'
    response = requests.get(url, headers=HEADERS)
    return response.json()

def delete_dns_record(zone_id, record_id):
    url = f'{BASE_URL}/zones/{zone_id}/dns_records/{record_id}'
    response = requests.delete(url, headers=HEADERS)
    return response.json()

def main():
    domains = [
        #"hashirama.bio",
        #"hashirama.lol",
        "hashirama.info",
        "hashirama.com",
        #"hashirama.art",
        #"leafstudio.design",
        #"michael-pollan.app",
        #"taiyongrobotics.com",
    ]


    for domain in domains:
        print(f"Processing {domain}...")
        zone_id = get_zone_id(domain)
        if not zone_id:
            print(f"Failed to get zone ID for {domain}. Exiting.")
            return

        records = get_dns_records(zone_id)
        if not records['success']:
            print(f"Failed to retrieve DNS records: {records['errors']}")
            return

        for record in records['result']:
            # if record['type'] == 'MX':
            #     print(f"Keeping MX record: {record['name']} - {record['content']}")
            #     continue
            # if record['type'] == 'TXT':
            #     print(f"Keeping Txt record: {record['name']} - {record['content']}")
            #     continue
            # else:
            result = delete_dns_record(zone_id, record['id'])
            if result['success']:
                print(f"Successfully deleted {record['type']} record: {record['name']}")
            else:
                print(f"Failed to delete {record['type']} record: {record['name']} - {result['errors']}")

    print("DNS record deletion process completed.")

if __name__ == "__main__":
    main()
