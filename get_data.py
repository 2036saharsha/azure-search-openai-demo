import requests
from bs4 import BeautifulSoup
import pdfkit
from urllib.parse import urljoin
import os
from pdf2docx import Converter


# Function to get all links from a webpage
def get_links(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        soup = BeautifulSoup(response.text, 'html.parser')
        base_url = url
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if "howard.edu" in href:
                links.append(href)
            elif href.startswith('/'):
                links.append(urljoin(base_url, href))
        return links
    except Exception as e:
        print(f"Error in getting links from {url}: {e}")
        return []


# Function to fetch HTML content of a page
def get_page_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.text
    except Exception as e:
        print(f"Error in getting content from {url}: {e}")
        return ''


# Function to save HTML content as PDF and DOC
def save_as_doc(html_content, filename):
    try:
        # Write the HTML content to a temporary HTML file
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(html_content)

        # Convert HTML to PDF
        output_file_name = filename.split(".")[0] + ".pdf"
        if not output_file_name:
            output_file_name = "home"
        docx_file_name = output_file_name.split(".")[0] + ".pdf"
        docx_file_name1 = output_file_name.split(".")[0] + ".html"

        if not os.path.exists(docx_file_name) or not os.path.exists(docx_file_name1):
            # Convert HTML to PDF
            pdfkit.from_file(filename, output_file_name, verbose=True)
            print("=" * 50)
        else:
            print(f"PDF file '{output_file_name}' already exists, skipping conversion.")

        # # Convert PDF to DOC
        # convert_to_doc(output_file_name)

        # # Delete temporary files
        os.remove(filename)
        # os.remove(output_file_name)
    except Exception as e:
        print(f"Error in saving as doc for {filename}: {e}")


# Function to convert PDF to DOC
def convert_to_doc(pdf_filename):
    try:
        docx_filename = pdf_filename.split(".")[0] + ".docx"
        cv = Converter(pdf_filename)
        cv.convert(docx_filename)
        cv.close()
    except Exception as e:
        print(f"Error in converting {pdf_filename} to DOCX: {e}")

# Main function to crawl website and save pages as PDF and DOC
def crawl_and_save(url, depth, visited):
    if depth == 0 or url in visited:
        return
    visited.add(url)
    links = get_links(url)
    html_content = get_page_content(url)
    save_as_doc(html_content, url.split('/')[-1] + ".html")
    for link in links:
        crawl_and_save(link, depth - 1, visited)

if __name__ == "__main__":
    url = input("Enter the URL of the website: ")
    depth = int(input("Enter the depth of crawling: "))
    visited = set()
    crawl_and_save(url, depth, visited)
