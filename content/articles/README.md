# Adding New Articles

To add a new article to the BioART blog, simply create a new Markdown file in this directory.

## File Format

Each article should be a `.md` file with the following frontmatter:

\`\`\`markdown
---
title: "Your Article Title"
excerpt: "A brief description of your article (1-2 sentences)"
category: "Category Name"
date: "Month Day, Year"
readTime: "X min read" (optional - automatically calculated if not provided)
---

# Your Article Title

Your article content goes here...
\`\`\`

## Frontmatter Fields

- **title**: The main title of your article
- **excerpt**: A short summary that appears in article cards
- **category**: The category (e.g., "Genetics", "Botany", "Microbiology")
- **date**: Publication date in format "Month Day, Year"
- **readTime**: (Optional) Estimated reading time (e.g., "5 min read"). If not provided, it will be automatically calculated based on the article's word count (200 words per minute)

## Markdown Features

You can use all standard Markdown features:

- **Headings**: # H1, ## H2, ### H3
- **Bold**: **bold text**
- **Italic**: *italic text*
- **Lists**: Bulleted and numbered
- **Links**: [text](url)
- **Images**: ![alt text](/path/to/image.jpg)
- **Code blocks**: ```language
- **Blockquotes**: > quote text
- **Tables**: Standard Markdown tables

## Adding Images

To add images to your articles:

1. Place images in `public/content/images/`
2. Reference them in your markdown: `![Description](/content/images/your-image.jpg)`

## Example

See the existing articles in this directory for examples of proper formatting.
