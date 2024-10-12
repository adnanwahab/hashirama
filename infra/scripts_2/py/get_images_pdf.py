# import pdfplumber
# import fitz  # PyMuPDF
# import os
# import io
# import argparse
# from PIL import Image

# Parse arguments from terminal
# parser = argparse.ArgumentParser(description="The PDF Image Extractor is designed to process PDF files, extracting and saving images embedded within the pages of the document.")
# parser.add_argument("--input_dir", default=os.path.expanduser("~/static/alan_kay/"), help="Directory containing PDF files.")
# parser.add_argument("--output_dir", default=os.path.expanduser("~/static/alan_kay/images"), help="Directory to save the extracted images.")
# parser.add_argument("--img_format", default="JPEG", help="Image format to save.")
# parser.add_argument("--img_quality", default="80", help="Quality of the saved images.")
#args = parser.parse_args()

##                  arxiv explorer - mini for anything related t orelated to
## if pdf in root then make buket unless buckdt eixts
## bucket  = get paper_name from pdf_name 
## bucket = text 
##         images
##         js file or python - to impemnt and aglorithm that goes into a notebook .hashirama  if js jupyyter or if js obs else (wasm
##          #####     bibliograhpy 
##                    backlinks 
##                    --------


## make audio book - listen to ool visuaations of audio - in kermit voice - make robots fun for 3 year olds - mega man x gif 


##                sorry out of scope  -- too much shit - on click - show 
##                    related papers 
##                    related images 
##                    related videos 
##                    related audio 
##                    related data 
##                    related code 
##                    related notebooks 
##                    related websites 
##        

##

## pdf -> 

img_format = "png"
img_quality = "80"
output_dir = "static/alan_kay/images"

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def remove_letters(text):
    return ''.join([c for c in text if not c.isalpha()])

def sanitize_filename(filename, max_length=100):
    # Remove special characters and limit the filename length
    sanitized = "".join([c if c.isalnum() or c in (' ', '.', '_') else '_' for c in filename])
    return sanitized[:max_length].strip()

def resize_image(image):
    max_size = int(max(image.width, image.height) * 0.7)

    if image.width > max_size or image.height > max_size:
        if image.width > image.height:
            aspect_ratio = image.height / image.width
            new_width = max_size
            new_height = int(max_size * aspect_ratio)
        else:
            aspect_ratio = image.width / image.height
            new_height = max_size
            new_width = int(max_size * aspect_ratio)

        image = image.resize((new_width, new_height), Image.BICUBIC)
    return image

def save_images_from_page(document_title, document, page_number, product_reference):
    saved_images = []
    pagina = document.load_page(page_number)
    imagens = pagina.get_images(full=True)

    # Sanitize and truncate the product_reference
    sanitized_reference = sanitize_filename(product_reference)

    for img_index, img in enumerate(imagens):
        try:
            xref = img[0]
            base_image = document.extract_image(xref)
            image_bytes = base_image["image"]

            image = Image.open(io.BytesIO(image_bytes))
            if image.width < 500 or image.height < 500:
                continue

            image = resize_image(image)
            #print(f"Image Saved: {img}")
            image_filename = os.path.join(
                output_dir, f"{sanitized_reference}_{page_number + 1}_{img_index}.{img_format}")
            # Save the image file
            img_name = f"{document_title}_{img_index}"
            print(img_name)
            image.save(img_name, f"{img_format}", quality=int(img_quality))
            saved_images.append(image_filename)
        except (OSError, KeyError) as e:
            print(f"Failed to process image {img_index} on page {page_number + 1}: {e}")
            continue

    return saved_images

# Process each PDF in the input directory
alan = "static/alan_kay/pdf/"
for filename in os.listdir(alan):
    print("", filename)
    _ = f"/Users/shelbernstein/hashirama/services/homelab-status-page/{alan}"
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(_, filename)
        document = fitz.open(pdf_path)

        with pdfplumber.open(pdf_path) as pdf:
            pages = pdf.pages
            for index, pagina in enumerate(pages):
                texto = pagina.extract_text()


                product_reference = remove_letters(texto) if texto else filename.replace('.pdf', '')
                images = save_images_from_page(os.path.basename(pdf_path).replace(".pdf", ""), document, index, product_reference)

                #for img in images:

                    #img.save(image_filename, f"{args.img_format}", quality=int(args.img_quality))

        document.close()

print('great')
# innervate - 6min cooldown
