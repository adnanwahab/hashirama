from playwright.sync_api import sync_playwright
import os
import requests

import os
import requests
import asyncio
from playwright.async_api import async_playwright

# Function to download PDF from a URL
def download_pdf(pdf_url, folder_path="pdfs"):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    response = requests.get(pdf_url)
    if response.status_code == 200:
        pdf_name = pdf_url.split("/")[-1]
        pdf_path = os.path.join(folder_path, pdf_name)
        
        with open(pdf_path, 'wb') as pdf_file:
            pdf_file.write(response.content)
        print(f"Downloaded: {pdf_name}")
    else: 
        print(response)
        print(f"No PDF found at: {pdf_url}")

# Function to scrape PDF links with Playwright
def scrape_with_playwright(links):
    print('scraping links')
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context()

        for link in links:
            page = context.new_page()
            page.goto(link)

            page_content = page.content()
            print(f"Page content for {link}:\n")
            print(page_content)
            # Find all links with [PDF] span
            a_tags = page.query_selector_all('a:has(span:text-is("[PDF]"))')
            

            for a_tag in a_tags:
                pdf_url = a_tag.get_attribute('href')
                if pdf_url:
                    pdf_url = pdf_url if pdf_url.startswith('http') else page.urljoin(pdf_url)
                    download_pdf(pdf_url)

            page.close()
        browser.close()


# Example list of links to scrape
links = [
    "https://scholar.google.de/citations?view_op=view_citation&hl=de&user=ZKtYLHwAAAAJ&citation_for_view=ZKtYLHwAAAAJ:KlAtU1dfN6UC",
    # Add more links here
]
scrape_with_playwright(links)

# async def main():
#     await scrape_with_playwright(links)

# # Entry point for the async function
# asyncio.run(main())