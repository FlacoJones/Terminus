# Terminus Industrials - GitHub Pages Site

This is a GitHub Pages project for terminusindustrials.com.

## Setup Instructions

### 1. Create a GitHub Repository

1. Create a new repository on GitHub (e.g., `terminusindustrials` or `terminus-industrials`)
2. Initialize and push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select the branch (usually `main`) and folder (usually `/ (root)`)
4. Click **Save**

### 3. Configure Custom Domain

1. In the same **Pages** settings section, enter `terminusindustrials.com` in the **Custom domain** field
2. Click **Save**
3. The `CNAME` file is already included in this repository

### 4. DNS Configuration

Configure your DNS records with your domain provider:

**Option A: Apex Domain (terminusindustrials.com)**
- Type: `A`
- Name: `@` or `terminusindustrials.com`
- Value: 
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

**Option B: Subdomain (www.terminusindustrials.com)**
- Type: `CNAME`
- Name: `www`
- Value: `YOUR_USERNAME.github.io`

**Option C: Both (Recommended)**
- Set up both A records for the apex domain AND a CNAME for www
- This allows both `terminusindustrials.com` and `www.terminusindustrials.com` to work

### 5. SSL Certificate

GitHub Pages will automatically provision an SSL certificate for your custom domain. This may take a few minutes to a few hours after DNS propagation.

## Local Development

To test the site locally:

1. Simply open `index.html` in a web browser, or
2. Use a local server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js (with http-server)
   npx http-server
   ```
3. Visit `http://localhost:8000` in your browser

## Project Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── script.js       # JavaScript functionality
├── CNAME          # Custom domain configuration
└── README.md      # This file
```

## Customization

- Edit `index.html` to modify the content
- Edit `styles.css` to change the styling
- Edit `script.js` to modify the JavaScript behavior
- Update the `CNAME` file if you need to change the domain

## Notes

- The site will be available at `https://terminusindustrials.com` after DNS propagation
- GitHub Pages supports Jekyll, but this is a static HTML site
- Make sure to commit and push changes to see them live (may take a few minutes)