---
name: book-reading
description: Skill for book reading, including PDF text extraction.
---

# Book Reading Skill

This skill provides tools and utilities for assisting with book reading tasks.

## Capabilities

### Read PDF Content
Extract text from PDF files using `pypdfium2`.

**Prerequisites:**
You must have `pypdfium2` installed.
```bash
pip install pypdfium2
```

**Usage:**
Run the helper script `extract_pdf.py` with the path to the PDF file.

```bash
python3 .agent/skills/book-reading/scripts/extract_pdf.py <path_to_pdf>
```
