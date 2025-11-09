# Competition PDFs

Place competition PDF files in this directory.

## Usage

1. Add your PDF files to this directory:
   - Past questions: `competition-name-questions.pdf`
   - Answer keys: `competition-name-answers.pdf`

2. Reference them in your markdown file's frontmatter:
   ```markdown
   pastQuestions: "/competitions/competition-name-questions.pdf"
   answerKey: "/competitions/competition-name-answers.pdf"
   ```

## Notes

- PDF files will be viewable directly in the browser
- Users can download PDFs using their browser's download functionality
- Buttons will only appear if the corresponding PDF files exist
- If only one PDF exists (e.g., only answer key), only that button will be shown
- Keep file names descriptive and URL-friendly (use hyphens instead of spaces)
