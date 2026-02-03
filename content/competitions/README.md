# Adding New Competitions

To add a new competition, simply create a new Markdown file in this directory.

## File Format

Each competition should be a `.md` file with the following frontmatter:

```markdown
---
title: "Competition Title"
date: "Month Day, Year"
description: "A brief description of the competition" (optional)
location: "București" (optional)
stage: "național" (optional)
pastQuestions: "/competitions/competition-name-questions.pdf" (optional)
answerKey: "/competitions/competition-name-answers.pdf" (optional)
officialUrl: "https://exemplu-concurs.ro" (optional)
---

Your detailed competition information goes here...

You can use **markdown formatting** for rich content.
```

## Frontmatter Fields

- **title**: The main title of the competition
- **date**: The date of the competition in format "Month Day, Year" or "YYYY-MM-DD". The year badge is automatically extracted from this field.
- **status**: (Optional) Either "Upcoming" or "Past". If not provided, it will be automatically determined based on the date:
  - If the date is today or in the future → "Upcoming"
  - If the date is in the past → "Past"
- **description**: (Optional) A short description that appears in the card (1-2 sentences)
- **location**: (Optional) Location of the event (e.g. "București", "Online")
- **stage**: (Optional) Stage of the competition (e.g. "național", "local", "internațional")
- **pastQuestions**: (Optional) Path to the past questions PDF file
- **answerKey**: (Optional) Path to the answer key PDF file
- **officialUrl**: (Optional) URL to the official website of the competition. If present, a button will appear that opens this site in a new tab.

## PDF Files

1. Place your PDF files in the `public/competitions/` directory
2. Reference them in the frontmatter:
   - `pastQuestions: "/competitions/competition-name-questions.pdf"`
   - `answerKey: "/competitions/competition-name-answers.pdf"`
3. The buttons will only appear if the corresponding PDF files exist
4. PDFs will be viewable in the browser and users can download them using their browser's download functionality

## Conditional Display

- If `pastQuestions` PDF exists, the "Past Questions" button will be shown
- If `answerKey` PDF exists, the "Answer Key" button will be shown
- If neither exists, no buttons will be shown
- If only one exists, only that button will be shown

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
title: "Biology Olympiad 2024"
date: "March 20, 2024"
description: "Last year's competition focused on molecular and biochemical concepts."
location: "București"
stage: "național"
pastQuestions: "/competitions/biology-olympiad-2024-questions.pdf"
answerKey: "/competitions/biology-olympiad-2024-answers.pdf"
officialUrl: "https://olimpiadadebiologie.ro"
---

# Biology Olympiad 2024

Last year's competition focused on molecular and biochemical concepts.

## Competition Details

The competition covered various topics including...
```

**Note**: The `status` field is optional. Since "March 20, 2024" is in the past, it will automatically be marked as "Past". For upcoming competitions, you can omit the status field and it will be automatically set to "Upcoming" based on the date.
