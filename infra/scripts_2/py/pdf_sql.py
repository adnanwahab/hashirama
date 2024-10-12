import os
import sqlite3
from pypdf import PdfReader
from pdf2image import convert_from_path
from PIL import Image
from io import BytesIO

# Database setup
db_path = 'alan_kay_research.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY,
    file_name TEXT,
    text_content TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    document_id INTEGER,
    image_data BLOB,
    FOREIGN KEY(document_id) REFERENCES documents(id)
)
''')

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF using PyPDF"""
    text = ""
    reader = PdfReader(pdf_path)
    for page in reader.pages:
        text += page.extract_text() if page.extract_text() else ""
    return text

def extract_images_from_pdf(pdf_path):
    """Extract images from a PDF using pdf2image and Pillow"""
    images = []
    pages = convert_from_path(pdf_path)
    for page in pages:
        # Convert page to byte data
        img_byte_arr = BytesIO()
        page.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        images.append(img_byte_arr)
    return images

def save_to_db(pdf_path):
    # Extract text and images
    text_content = extract_text_from_pdf(pdf_path)
    images = extract_images_from_pdf(pdf_path)
    # Create a directory for saving extracted images and text if it doesn't exist
    output_dir = 'static/alan_kay/'
    os.makedirs(output_dir, exist_ok=True)

    # Save extracted text to a file
    text_file_name = os.path.join(output_dir, os.path.basename(pdf_path) + '.txt')
    with open(text_file_name, 'w', encoding='utf-8') as text_file:
        text_file.write(text_content)

    # Save extracted images to files
    for i, img_data in enumerate(images):
        image_file_name = os.path.join(output_dir, f"{os.path.basename(pdf_path)}_image_{i}.png")
        with open(image_file_name, 'wb') as img_file:
            img_file.write(img_data)
    # # Insert into documents table
    # cursor.execute('INSERT INTO documents (file_name, text_content) VALUES (?, ?)', (pdf_path, text_content))
    # document_id = cursor.lastrowid

    # # Insert into images table
    # for img_data in images:
    #     cursor.execute('INSERT INTO images (document_id, image_data) VALUES (?, ?)', (document_id, img_data))

    conn.commit()

# Directory with PDFs
pdf_dir = 'static/alan_kay/'
for pdf_file in os.listdir(pdf_dir):
    if pdf_file.endswith('.pdf'):
        print('cool')
        save_to_db(os.path.join(pdf_dir, pdf_file))

conn.close()


# 150 elements
#
# 50 gifs / 100 stills
#
# pan camera around - draw links
# parallex, layouts,
# haku - each miror is a portal into ???
#
#
#
