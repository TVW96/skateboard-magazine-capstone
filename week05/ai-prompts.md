# Week 05 AI co-pilot prompts

## Prompt 1 — Refactoring CSS to cascade layers

> Here is my CSS file [Paste CSS]. I want to modernize my code by sorting
> these styles into four cascade layers: reset, base, layout, and components.
> Can you help me group my existing rules into these layer blocks, explaining
> which layer each rule belongs to and why?

### Applied direction

The stylesheet declares the intended precedence once with
`@layer reset, base, layout, components;`. The existing rules are then grouped
by responsibility:

- `reset` contains universal box sizing and removes the browser's default body
  margin. These low-level normalizations should be easiest for later layers to
  override.
- `base` contains design tokens, automatic and explicit color themes, document
  typography, link inheritance, keyboard focus treatment, and reduced-motion
  defaults. These rules establish page-wide behavior without describing a
  particular layout or component.
- `layout` contains the page shell, header/footer tracks, editorial frame,
  responsive story grid, card spans, and context-rail placement. These rules
  control where major regions and cards sit at desktop, tablet, and mobile
  widths.
- `components` contains the skip link, wordmark, navigation, skateboard theme
  control, issue heading, story-card visuals, issue index, and component-level
  responsive states. Placing components last lets their intentional UI styling
  win without specificity tricks.

The Google Fonts `@import` remains outside the layers because imports must be
declared before normal style rules. Theme tokens retain separate `--line` and
`--grid-line` values so accent dividers and neutral internal grid lines keep
their distinct roles.

## Prompt 2 — Refactoring to native nesting

> Analyze my CSS component styles [Paste Card/Grid CSS]. Help me refactor this
> code to use native CSS Nesting, making sure parent-child relationships are
> clean and pseudo-elements/pseudo-classes are set up using the `&` operator.

### Applied direction

The `.story-card` block now owns its true descendants—content, kicker, heading,
metadata, art, and number styles. Interactive and generated states use the
nesting selector explicitly: `&:hover`, `&::after`, `&::before`, and
`&:not(...)`. Same-element variants use forms such as
`&.story-card--hero`; this avoids the Sass-only `&--hero` concatenation pattern,
which native CSS does not support.

The responsive grid keeps its column changes inside `.story-grid` with nested
`@media` rules. Card-span changes also live beside their matching hero, wide,
and film selectors. Navigation, the theme toggle, and the issue rail use the
same relationship-based nesting so the final stylesheet consistently expresses
component ownership while keeping the HTML class names unchanged.
