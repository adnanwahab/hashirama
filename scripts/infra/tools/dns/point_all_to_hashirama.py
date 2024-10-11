import requests
import socket

API_TOKEN = 'kJO0IwzZ9z73q2tWQnEiKLI_Uy4HGtqDJPMmDkB0'
API_ENDPOINT = "https://api.cloudflare.com/client/v4"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

domains = [
    "hashirama.art", "hashirama.bio", "hashirama.blog", "hashirama.info",
    "hashirama.lol", "leafstudio.design", "michael-pollan.app",
    "taiyongrobotics.com",
]

def update_dns(domain, ip):
    zone_id = requests.get(f"{API_ENDPOINT}/zones?name={domain}", headers=headers).json()['result'][0]['id']
    records = requests.get(f"{API_ENDPOINT}/zones/{zone_id}/dns_records?type=A&name={domain}", headers=headers).json()['result']

    data = {
        "type": "A", "name": domain, "content": ip, "ttl": 1, "proxied": True
    }

    if records:
        url = f"{API_ENDPOINT}/zones/{zone_id}/dns_records/{records[0]['id']}"
        response = requests.put(url, headers=headers, json=data)
    else:
        url = f"{API_ENDPOINT}/zones/{zone_id}/dns_records"
        response = requests.post(url, headers=headers, json=data)

    print(f"{'Success' if response.status_code in [200, 201] else 'Failed'}: {domain}")

target_ip = socket.gethostbyname("hashirama.com")


def get_public_ip():
    return requests.get('https://api.ipify.org').text

target_ip = get_public_ip()
print(f"Your public IP: {target_ip}")

for domain in domains:
    update_dns(domain, target_ip)
