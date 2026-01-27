import sys
import pypdfium2 as pdfium

def extract_text(pdf_path):
    try:
        pdf = pdfium.PdfDocument(pdf_path)
        full_text = []
        for page in pdf:
            textpage = page.get_textpage()
            text = textpage.get_text_range()
            full_text.append(text)
            textpage.close()
            page.close() # Good practice to close pages
        
        print("\n".join(full_text))
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_pdf.py <path_to_pdf>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    extract_text(pdf_path)
