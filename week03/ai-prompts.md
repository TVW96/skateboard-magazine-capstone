# Week 03 AI co-pilot prompts

## Prompt 1 — Drafting semantic layout scaffolding

> I am building an editorial skateboard magazine (Archetype B: Editorial) for
> my PUSH Magazine capstone project. Write a semantic HTML5 layout wrapper
> utilizing `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>`. Then write
> the CSS Grid rules needed to position these zones so the layout occupies
> exactly 100% of the dynamic viewport height, with a `100vh` fallback. The
> header should remain sticky, the main article frame should be wide and
> centered, and the aside should act as a secondary rail for future related
> stories or newsletter controls. Use low-specificity class selectors. Bind
> padding and gaps to the Week 02 spacing tokens, especially
> `var(--space-md)`, and bind backgrounds, text, accents, dividers, and grid
> lines to the existing OKLCH variables: `var(--background)`, `var(--text)`,
> `var(--surface)`, `var(--accent)`, `var(--accent-secondary)`,
> `var(--line)`, and `var(--grid-line)`. Do not add lorem ipsum, placeholder
> article copy, images, or final magazine content. Keep the output focused on
> accessible structural zones.

## Prompt 2 — Grid frame debugging

Draft structure:

```html
<body>
  <header class="site-header">
    <nav class="site-nav" aria-label="Primary navigation"></nav>
  </header>
  <main class="editorial-frame"></main>
  <aside class="context-rail"></aside>
  <footer class="site-footer"></footer>
</body>
```

Draft grid:

```css
body {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template:
    "header header" auto
    "main rail" minmax(0, 1fr)
    "footer footer" auto
    / minmax(0, 1fr) minmax(16rem, 22rem);
}

.editorial-frame,
.context-rail {
  min-width: 0;
}

@media (max-width: 56rem) {
  body {
    grid-template:
      "header" auto
      "main" auto
      "rail" minmax(20rem, 1fr)
      "footer" auto
      / minmax(0, 1fr);
  }
}
```

> My right-hand aside is collapsing to zero width when the screen gets narrow,
> and it is causing a horizontal scrollbar. Explain why this happens within
> the CSS Grid formatting context, including the grid item's automatic minimum
> size. Show how `minmax()` gives the sidebar a responsive minimum and maximum,
> why the main track should use `minmax(0, 1fr)`, and why the grid items need
> `min-width: 0`. Then explain where a one-column media query should take over
> before the sidebar's minimum track size can force overflow.
