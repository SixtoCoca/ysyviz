# YsyViz

A lightweight, fast, and professional web app to create charts without writing any code. Upload your data, configure the visuals, and export a high‑quality image in seconds.

## Highlights

- Drag & drop file upload (CSV or XLSX)
- Live preview with side‑by‑side configuration panel
- One‑click PNG export
- Smart column detection and helpful messages
- Clean, responsive UI

## Supported Charts

- Bar
- Line / Area
- Pie / Donut
- Scatter
- Bubble
- Heatmap
- Sankey
- Chord

## Getting Started

Prerequisites:
- Node.js 18+

Install and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Open http://localhost:5173

## How It Works

1) Upload
- Go to “Upload File”.
- Drag & drop or select a .csv or .xlsx file.

2) Configure & Preview
- Go to “Preview & Download”.
- Left: Configuration panel (chart type, titles, colors, axes, legend, etc.).
- Right: Live chart preview.

3) Export
- Click “Download” to export the current preview as a PNG image.

## Data Tips

- First row should contain column headers.
- CSV should be UTF‑8 encoded.
- XLSX uses the first worksheet.
- Ensure numeric fields are truly numeric where required (e.g., values, x/y coordinates, sizes).

## Tech Stack

- React 19 + Vite
- D3 (+ d3‑sankey)

## License

This project is licensed under the terms of the MIT License. See LICENSE for details.

