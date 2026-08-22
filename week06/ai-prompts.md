# Week 06 AI co-pilot prompts

## Prompt 1 — Writing container queries

> I have a reusable card element called `.card` containing an image and some
> text. I want to convert this card's styling to use CSS Container Queries
> instead of Media Queries. If its parent element is wider than 450px, the card
> should display horizontally. If its parent is narrower, it should stack
> vertically. Can you write the HTML structure and the nested CSS using
> `@container`?

### Applied direction

Each `.story-card` is now a child of either a `.story-slot` in the asymmetric
grid or a `.rail-card-slot` in the sidebar. Both wrappers establish a named
inline-size context with `container: story-card / inline-size`.

The card's narrow default is a vertical flex layout. A named
`@container story-card (min-width: 31.25rem)` query changes the same component
to a horizontal row once its own parent slot reaches 500px. The 500px threshold
keeps the assignment's multi-layout test explicit while remaining close to the
450px example prompt.

## Prompt 2 — Refactoring layouts for container queries

> [Paste your HTML & CSS] In my project, I have cards in my main asymmetric
> grid and cards in my sidebar aside. They currently look messy because the
> sidebar cards are being squished. Can you help me set
> `container-type: inline-size` on the parent elements of these card slots and
> show me how to refactor the cards to self-adjust perfectly?

### Applied direction

The grid-span responsibilities moved from the cards to their new slot wrappers.
That distinction matters: a container cannot query its own size to style itself,
but its child card can query the wrapper. It also prevents every card from
measuring the full `.story-grid` instead of the individual track or span it
actually occupies.

Viewport media queries still shape the page shell and the number of grid
columns. They no longer decide whether a card's art and copy are stacked or
horizontal. The wide film story and the narrow sidebar dispatch deliberately
reuse `.story-card--film`; at the same desktop viewport, their different parent
widths produce different component layouts.
