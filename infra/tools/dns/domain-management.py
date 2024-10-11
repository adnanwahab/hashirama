#!/usr/bin/env python3

import json
import os
from datetime import datetime

# DNS zone file template
template = """;;
;; Domain:     {domain}
;; Exported:   {date}
;;
;; This file is intended for use for informational and archival
;; purposes ONLY and MUST be edited before use on a production
;; DNS server.

;; SOA Record
{domain}.	3600	IN	SOA	bonnie.ns.cloudflare.com. dns.cloudflare.com. {serial} 10000 2400 604800 3600

;; NS Records
{domain}.	86400	IN	NS	bonnie.ns.cloudflare.com.
{domain}.	86400	IN	NS	everton.ns.cloudflare.com.

;; MX Records for Google Workspace
{domain}.	3600	IN	MX	1 aspmx.l.google.com.
{domain}.	3600	IN	MX	5 alt1.aspmx.l.google.com.
{domain}.	3600	IN	MX	5 alt2.aspmx.l.google.com.
{domain}.	3600	IN	MX	10 alt3.aspmx.l.google.com.
{domain}.	3600	IN	MX	10 alt4.aspmx.l.google.com.

;; TXT Record for Google Workspace verification (replace with your actual verification code)
{domain}.	3600	IN	TXT	"google-site-verification=your_verification_code_here"

;; CNAME Records for Google Workspace services
calendar	3600	IN	CNAME	ghs.googlehosted.com.
drive		3600	IN	CNAME	ghs.googlehosted.com.
mail		3600	IN	CNAME	ghs.googlehosted.com.
groups		3600	IN	CNAME	ghs.googlehosted.com.

;; A Record for your domain (replace with your actual IP if not using Cloudflare proxy)
{domain}.	1	IN	A	192.0.2.1

;; AAAA Record for IPv6 (if applicable)
{domain}.	1	IN	AAAA	2001:db8::1

;; Additional records as needed for your specific setup
"""

# Read the JSON file
with open('domains.json', 'r') as f:
    data = json.load(f)

# Create a directory for the zone files if it doesn't exist
os.makedirs('zone_files', exist_ok=True)

# Generate zone files for each domain
for domain in data['domains']:
    # Generate a serial number (yyyymmddnn format)
    serial = datetime.now().strftime("%Y%m%d01")

    # Fill in the template
    zone_file_content = template.format(
        domain=domain,
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        serial=serial
    )

    # Write the zone file
    filename = f"zone_files/{domain}.txt"
    with open(filename, 'w') as f:
        f.write(zone_file_content)

    print(f"Created zone file for {domain}: {filename}")

print("All zone files have been generated.")
