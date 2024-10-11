import requests
import os
from dotenv import load_dotenv
load_dotenv()
cf_api = os.getenv("cloudflare_api")
print(cf_api)
account_id = "f12249d05845494d385d80253a902b04"
url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/registrar/domains"

headers = {
    "Content-Type": "application/json",
    #"X-Auth-Key": cf_api,  # Your Cloudflare API key
        #"Authorization": "Bearer your-api-token",  # Your Cloudflare API Token

    "Authorization": f"Bearer {cf_api}",  # Your Cloudflare API Token

    #"X-Auth-Email": "adnan.f.wahab@gmail.com"
}

response = requests.request("GET", url, headers=headers)

print(response.text)