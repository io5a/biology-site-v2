# Adding New Learning Materials

To add a new learning material, simply create a new Markdown file in this directory.

## File Format

Each learning material should be a `.md` file with the following frontmatter:

```markdown
---
title: "Your Learning Material Title"
description: "A brief description of the material"
pdf: "/learning/your-file.pdf"
date: "Month Day, Year" (optional)
---

Your detailed description and content goes here...

You can use **markdown formatting** for rich content.
```

## Frontmatter Fields

- **title**: The main title of your learning material
- **description**: A short description that appears in the card (1-2 sentences)
- **pdf**: The path to the PDF file (should be in `public/learning/` directory)
- **date**: Publication date (optional) - format "Month Day, Year" or "YYYY-MM-DD"

## PDF Files

1. Place your PDF files in the `public/learning/` directory
2. Reference them in the frontmatter using the path: `/learning/your-file.pdf`
3. The PDF will be viewable in the browser and users can download it using their browser's download functionality

## Markdown Features

You can use all standard Markdown features in the content:

- **Headings**: # H1, ## H2, ### H3
- **Bold**: **bold text**
- **Italic**: *italic text*
- **Lists**: Bulleted and numbered
- **Links**: [text](url)
- **Images**: ![alt text](/path/to/image.jpg)
- **Code blocks**: ```language
- **Blockquotes**: > quote text
- **Tables**: Standard Markdown tables

## Example

```markdown
---
title: "Cell Biology Study Guide"
description: "Comprehensive guide covering cell structure, organelles, and cellular processes."
pdf: "/learning/cell-biology-guide.pdf"
date: "October 1, 2025"
---

# Cell Biology Study Guide

This comprehensive guide covers:

- Cell structure and organization
- Organelles and their functions
- Cellular processes and metabolism

## Cell Structure

The cell is the basic unit of life...
```

## Notes

- The description field is used for the card preview
- The markdown content below the frontmatter can contain detailed information
- PDF files should be placed in `public/learning/` and referenced with `/learning/filename.pdf`
- Users can view PDFs directly in the browser and download them using browser controls
