#!/usr/bin/env python3

# 1. SEO Analyzer
import requests
from bs4 import BeautifulSoup

def analyze_seo(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    title = soup.find('title').string
    meta_description = soup.find('meta', attrs={'name': 'description'})
    h1_tags = soup.find_all('h1')

    print(f"Title: {title}")
    print(f"Meta Description: {meta_description['content'] if meta_description else 'Missing'}")
    print(f"Number of H1 tags: {len(h1_tags)}")

# Usage: analyze_seo('https://adnanwahab.com')

# 2. Broken Link Checker
def check_broken_links(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    for link in soup.find_all('a'):
        href = link.get('href')
        if href and href.startswith('http'):
            try:
                link_response = requests.head(href)
                if link_response.status_code >= 400:
                    print(f"Broken link: {href}")
            except requests.RequestException:
                print(f"Failed to check: {href}")

# Usage: check_broken_links('https://adnanwahab.com')

# 3. Content Readability Analyzer
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize

nltk.download('punkt')

def analyze_readability(text):
    sentences = sent_tokenize(text)
    words = word_tokenize(text)

    avg_sentence_length = len(words) / len(sentences)
    avg_word_length = sum(len(word) for word in words) / len(words)

    print(f"Average sentence length: {avg_sentence_length:.2f} words")
    print(f"Average word length: {avg_word_length:.2f} characters")

# Usage: analyze_readability("Your blog post content here")

# 4. Image Optimizer
from PIL import Image
import os

def optimize_images(directory):
    for filename in os.listdir(directory):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            with Image.open(filepath) as img:
                img.save(filepath, optimize=True, quality=85)

# Usage: optimize_images('/path/to/your/images')

# 5. RSS Feed Generator
import feedgenerator
import datetime

def generate_rss_feed(blog_title, blog_link, blog_description, items):
    feed = feedgenerator.Rss201rev2Feed(
        title=blog_title,
        link=blog_link,
        description=blog_description
    )

    for item in items:
        feed.add_item(
            title=item['title'],
            link=item['link'],
            description=item['description'],
            pubdate=item['pubdate']
        )

    with open('rss.xml', 'w') as f:
        feed.write(f, 'utf-8')

# Usage:
# items = [
#     {'title': 'Post 1', 'link': 'https://adnanwahab.com/post1', 'description': 'Description 1', 'pubdate': datetime.datetime.now()},
#     # Add more items...
# ]
# generate_rss_feed('Adnan Wahab Blog', 'https://adnanwahab.com', 'My awesome blog', items)

# 6. Sitemap Generator
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

def generate_sitemap(urls):
    urlset = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for url in urls:
        url_element = SubElement(urlset, 'url')
        loc = SubElement(url_element, 'loc')
        loc.text = url

    xmlstr = minidom.parseString(tostring(urlset)).toprettyxml(indent="  ")
    with open('sitemap.xml', 'w') as f:
        f.write(xmlstr)

# Usage:
# urls = ['https://adnanwahab.com', 'https://adnanwahab.com/about', 'https://adnanwahab.com/blog']
# generate_sitemap(urls)

# 7. Social Media Share Counter
import requests

def get_share_counts(url):
    facebook_api = f"https://graph.facebook.com/?id={url}"
    twitter_api = f"https://counts.twitcount.com/counts.php?url={url}"

    facebook_response = requests.get(facebook_api)
    twitter_response = requests.get(twitter_api)

    facebook_shares = facebook_response.json().get('share', {}).get('share_count', 0)
    twitter_shares = twitter_response.json().get('count', 0)

    print(f"Facebook shares: {facebook_shares}")
    print(f"Twitter shares: {twitter_shares}")

# Usage: get_share_counts('https://adnanwahab.com/your-post')

# 8. Comment Sentiment Analyzer
from textblob import TextBlob

def analyze_comment_sentiment(comment):
    blob = TextBlob(comment)
    sentiment = blob.sentiment.polarity

    if sentiment > 0:
        return "Positive"
    elif sentiment < 0:
        return "Negative"
    else:
        return "Neutral"

# Usage: print(analyze_comment_sentiment("Great post! I learned a lot."))

# 9. Related Posts Suggester
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def suggest_related_posts(current_post, all_posts):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([current_post] + all_posts)

    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    related_posts_indices = cosine_similarities.argsort()[-3:][::-1]

    return [all_posts[i] for i in related_posts_indices]

# Usage:
# current_post = "Content of the current post"
# all_posts = ["Post 1 content", "Post 2 content", "Post 3 content", ...]
# related_posts = suggest_related_posts(current_post, all_posts)

# 10. Performance Monitoring
import time
import psutil

def monitor_performance():
    start_time = time.time()
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_usage = psutil.virtual_memory().percent

    # Your blog rendering code here

    end_time = time.time()
    execution_time = end_time - start_time

    print(f"Execution time: {execution_time:.2f} seconds")
    print(f"CPU usage: {cpu_usage}%")
    print(f"Memory usage: {memory_usage}%")

# Usage: monitor_performance()
