# AI Image Generator Prompts for Fluxwing Social Media Images

## OG Image (1200x630px) - For Facebook, LinkedIn, etc.

**Prompt for AI Generator:**

```
A retro computer terminal screen with a dark blue-gray background (#0a0e14). The screen displays large ASCII art block letters spelling "FLUXWING" in bright cyan (#00ffff) with a subtle phosphor glow effect. Below the logo is the tagline "Design Systems for Humans + AI" in bright green monospace text (#33ff33).

The composition features:
- 1980s BBS aesthetic with CRT monitor phosphor glow
- Subtle horizontal scanlines across the entire image
- ASCII box-drawing characters forming decorative borders using light single-line characters (┌─┐ │ └─┘)
- Terminal-style command prompt at the bottom showing: "$ fluxwing --create"
- Color scheme: dark background with cyan and green terminal colors
- Monospace IBM Plex Mono font appearance
- Retro computing nostalgia, clean and professional

Style: Digital art, retro computing, terminal interface, high contrast, phosphor screen glow effect, 1980s BBS aesthetic, technical documentation style.

Aspect ratio: 1200x630 pixels (1.9:1)
Image should be sharp, high quality, with authentic CRT terminal appearance.
```

**Alternative Shorter Prompt:**

```
Retro 1980s computer terminal screen, dark background, large ASCII art "FLUXWING" logo in cyan with glow, tagline "Design Systems for Humans + AI" in green monospace text, CRT scanlines, BBS aesthetic, box-drawing character borders, terminal prompt "$ fluxwing --create", IBM Plex Mono font style, professional tech documentation look, 1200x630px
```

---

## Twitter Card (1200x600px)

**Prompt for AI Generator:**

```
A vintage computer terminal display with dark blue-gray background (#0a0e14). Center-aligned ASCII art block letters spelling "FLUXWING" in glowing cyan (#00ffff) with phosphor screen effect. Underneath: "Design Systems for Humans + AI" in bright green (#33ff33) monospace terminal font.

Features:
- Classic 1980s-90s BBS/terminal aesthetic
- CRT monitor phosphor glow on text
- Horizontal scanlines texture overlay
- Simple ASCII box border using single-line drawing characters (┌───┐)
- Command line prompt at bottom: "$ npm install fluxwing"
- Authentic retro computing terminal interface
- High contrast cyan and green on dark background
- Monospace typography throughout
- Clean, professional, technical

Art style: Retro terminal interface, BBS artwork, digital phosphor screen, vintage computing, high-tech nostalgia, technical precision.

Dimensions: 1200x600 pixels (2:1 ratio)
Quality: Sharp, crisp text, authentic CRT appearance.
```

**Alternative Shorter Prompt:**

```
1980s terminal screen interface, ASCII "FLUXWING" in glowing cyan, "Design Systems for Humans + AI" in green monospace, dark background, CRT scanlines, phosphor glow, box-drawing borders, terminal command prompt, BBS aesthetic, retro computing style, professional tech look, 1200x600px
```

---

## Color Reference

Use these exact color codes in your prompts when the AI generator supports hex colors:

- **Background**: #0a0e14 (deep dark blue-gray)
- **Cyan/Primary**: #00ffff (bright cyan)
- **Green/Text**: #33ff33 (terminal green)
- **Bright Green**: #66ff66 (highlight green)

---

## Design Notes

1. **Typography**: All text should appear in monospace font (IBM Plex Mono style)
2. **Glow Effect**: Cyan text should have subtle phosphor/neon glow
3. **Scanlines**: Horizontal lines across entire image (subtle, not overpowering)
4. **Borders**: Use simple ASCII box-drawing characters, not heavy or ornate
5. **Composition**: Center-aligned, balanced, professional
6. **Terminal Authenticity**: Should look like a real 1980s computer terminal screenshot

---

## Tools You Can Use

- **DALL-E 3** (via ChatGPT Plus or API)
- **Midjourney** (Discord)
- **Stable Diffusion** (local or online)
- **Adobe Firefly**
- **Leonardo.ai**

### Recommended Settings:
- Style: Digital Art, Technical Illustration, or Photorealistic (for authentic CRT look)
- Quality: High/Max
- Aspect Ratio: Custom (1200x630 for OG, 1200x600 for Twitter)

---

## Post-Generation Steps

1. Download generated images
2. Verify dimensions are exactly 1200x630 and 1200x600
3. Resize if needed using ImageMagick:
   ```bash
   magick input.png -resize 1200x630! og-image.png
   magick input.png -resize 1200x600! twitter-card.png
   ```
4. Save to `docs/assets/`
5. Update meta tags in HTML files to reference these images

---

## Quick Photoshop/Figma Alternative

If AI generation doesn't work well, you can also:

1. Create 1200x630 / 1200x600 canvas with #0a0e14 background
2. Add FLUXWING text in IBM Plex Mono font, cyan color
3. Add tagline in green
4. Apply outer glow effect (cyan, 20px, 50% opacity)
5. Add scanline pattern overlay (2px horizontal lines, 5% opacity)
6. Add ASCII border using text tool with box-drawing characters
7. Export as PNG
