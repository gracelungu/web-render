# HTML/CSS/JavaScript/React Renderer API

This project provides an API to render HTML, CSS, JavaScript, and React components as images using Next.js and Playwright. It allows users to pass a component (HTML and CSS, or a React component), JavaScript, CSS/SCSS, and a list of dependencies, and the API will return an image URL after rendering the component.

## Features

- Render HTML, CSS, and JavaScript components as images
- Support for React components with CSS or SCSS
- Optional dependency handling for React components
- Customizable viewport size and image format

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Test the API by sending a POST request to `http://localhost:3000/api/render` with the appropriate payload

## API

### POST /api/render

Request payload:

```json
{
  "component": "string",
  "css": "string",
  "javascript": "string (optional)",
  "viewportWidth": "number (optional, default: 640)",
  "viewportHeight": "number (optional, default: 640)",
  "imageFormat": "string ('jpeg' or 'png', optional, default: 'png')",
  "dependencies": "object (optional)"
}
```

```
{
  "imageUrl": "string"
}
```
