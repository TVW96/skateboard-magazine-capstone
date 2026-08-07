# Week 04 AI co-pilot prompts

## Prompt 1 — Designing an asymmetric grid

> I have a main content area containing 5 cards. I want to build a CSS Grid
> that is asymmetric. On desktop, I want a 3-column layout where the first
> card is a “hero” card that spans 2 columns and 2 rows, while the rest span
> 1 column. Write the CSS using fractional units (`fr`) and grid-template-areas
> (or explicit grid spans). Make sure it scales nicely down to a single column
> on mobile viewports.

### Applied direction

The final grid uses `repeat(3, minmax(0, 1fr))` so each fractional track may
shrink below its content's intrinsic width. The hero uses `grid-column: span 2`
and `grid-row: span 2`; a secondary feature spans two columns to keep the six-
card composition intentionally uneven. At 68rem the grid becomes two columns,
and at 44rem all spans reset into a single reading-order column.

## Prompt 2 — Preventing grid gaps

> When I shrink my viewport to tablet sizes, my asymmetric grid leaves a large
> empty space in the second row because of the card span rules. Can you analyze
> my grid code and show me how to use CSS Grid's auto-placement rules, like
> `grid-auto-flow: dense`, to prevent gaps while preserving hierarchy?

### Applied direction

`grid-auto-flow: dense` lets later one-track cards backfill earlier holes left
by spanning cards. Source order still controls the accessible reading order;
dense placement changes only visual position. At the one-column breakpoint,
the explicit hero and wide-card spans are reset to `auto`, eliminating both
holes and accidental implicit columns.
