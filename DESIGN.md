# DESIGN.md

## 1. Product Design Philosophy

This website is a utility, not a marketing page.

The user should be able to open the site and immediately use one of three tools:

1. Clock
2. Timer
3. Mini To-do

There should be no onboarding, hero section, promotional copy, account requirement, or decorative introduction.

The interface should feel closer to a well-designed desktop utility or digital instrument than a startup landing page.

### Priority order

1. Function
2. Readability
3. Speed
4. Accessibility
5. Visual identity
6. Decoration

If a visual decision makes the tool harder to understand or slower to use, remove it.

---

## 2. Visual Identity

### Mood

The interface should feel:

- calm
- precise
- focused
- modern
- lightweight
- trustworthy
- slightly premium
- intentionally designed

It should not feel:

- futuristic for the sake of it
- corporate
- playful
- overly minimal to the point of emptiness
- like a generic AI-generated SaaS landing page

### Density

Use compact controls and clear information hierarchy.

Allow generous space around the active Clock or Timer display, but keep controls and secondary interfaces reasonably dense.

Avoid giant empty sections.

### Shape language

Prefer simple geometric shapes.

Use:

- `rounded-sm`
- `rounded-md`

Use larger radii only where functionally justified.

Do not make every button, panel, and container pill-shaped.

### Decoration

Decoration should be extremely restrained.

Do not add visual elements that do not communicate information or improve usability.

---

## 3. Color System

Use Tailwind's `zinc` palette as the neutral foundation.

Dark mode is the primary visual experience.

### Dark Mode

- Page background: `zinc-950`
- Primary surface: `zinc-900`
- Secondary surface: `zinc-900/60`
- Primary border: `zinc-800`
- Strong border: `zinc-700`
- Primary text: `zinc-50`
- Secondary text: `zinc-300`
- Muted text: `zinc-400`
- Disabled text: `zinc-600`

### Light Mode

- Page background: `zinc-50`
- Primary surface: `white`
- Secondary surface: `zinc-100`
- Primary border: `zinc-200`
- Strong border: `zinc-300`
- Primary text: `zinc-950`
- Secondary text: `zinc-700`
- Muted text: `zinc-500`

### Accent

Use one restrained accent family.

Preferred accent:

- Dark mode: `blue-500`
- Light mode: `blue-600`

The accent should primarily indicate:

- active navigation
- focus
- timer progress
- selected controls
- important interactive state

Do not cover large portions of the UI with the accent color.

### Semantic colors

- Success: `emerald-500`
- Warning: `amber-500`
- Error/destructive: `rose-500`

Use semantic colors only when they communicate an actual state.

### Gradients

Do not use gradients in v1.

A future design may introduce an extremely subtle gradient only if it has a clear visual purpose.

---

## 4. Typography

Typography should prioritize numerical readability and interface clarity.

### General interface font

Prefer the normal system UI stack through Tailwind's `font-sans`.

Do not load a custom font unless there is a meaningful reason.

### Clock and Timer digits

Use:

- `tabular-nums`
- optionally `font-mono` if it improves readability

Digits must not visually shift width as the time changes.

The main time display should scale responsively using a controlled `clamp()` value when necessary.

Example concept:

```css
font-size: clamp(4rem, 12vw, 11rem);
```

Using an arbitrary Tailwind value for this specific purpose is acceptable.

### Interface hierarchy

Primary clock/timer:
- extremely prominent

Section title:
- `text-sm`
- `font-medium`

Utility label:
- `text-xs`
- muted

Task text:
- `text-base`

Avoid excessive uppercase text.

Uppercase may be used for very small technical labels only.

---

## 5. Overall Layout

The active utility should dominate the viewport.

Use:

```text
Header / Mode Switcher
        ↓
Primary Tool
        ↓
Contextual Controls
        ↓
Optional Secondary Content
```

### Viewport behavior

Use:

- `min-h-dvh`

Do not globally force `overflow-hidden`.

Scrolling should remain available when:

- accessibility zoom increases content size
- the screen is unusually small
- the to-do list contains more content
- mobile landscape creates limited vertical space

Fullscreen Clock mode may intentionally hide overflow.

### Width

Primary controls:

- `max-w-md`

To-do panel:

- `max-w-lg`

Do not stretch controls across very wide displays.

### Spacing

Prefer the normal Tailwind spacing scale.

Typical values:

- small control spacing: `gap-2`
- standard grouping: `gap-4`
- major separation: `gap-6` or `gap-8`

Avoid massive spacing values purely for visual drama.

---

## 6. Clock Mode

Clock mode should be the visually simplest mode.

### Primary time

The time should be the dominant visual element on the page.

Display:

```text
10:42
```

Seconds may optionally appear as:

```text
10:42:18
```

or as a visually reduced secondary element.

### Date

The date should be secondary.

Example:

```text
Tuesday, 1 September
```

Use muted typography.

### 12h / 24h control

Provide a small, clearly labeled control.

Examples:

```text
12H
24H
```

Do not hide this inside an unnecessarily complex settings interface.

### Fullscreen mode

Clock mode may offer a fullscreen button.

In fullscreen mode:

- hide unnecessary secondary controls
- keep time visible
- keep exit-fullscreen discoverable

Do not automatically hide navigation during normal use.

If controls auto-hide in fullscreen mode later, they must immediately return with pointer movement or keyboard interaction.

---

## 7. Timer Mode

Timer mode should maintain the same visual language as Clock mode.

### Timer digits

Use the same numeral system as the clock:

- `tabular-nums`
- large responsive sizing
- high contrast

### Main controls

The primary controls are:

```text
Start
Pause
Reset
```

Only controls relevant to the current state should have strong emphasis.

Example:

```text
Idle:
Start = primary
Reset = secondary

Running:
Pause = primary
Reset = secondary
```

### Presets

Allow compact optional presets:

```text
5m
10m
15m
25m
30m
60m
```

Do not turn presets into large decorative cards.

### Progress

A thin progress indicator may be used.

It should be quiet and secondary to the timer digits.

### Completion state

Do not flash the entire screen.

Instead use:

- a short color-state transition
- a clear "Timer complete" message
- optional sound
- optional browser notification later

Avoid rapid flashing because of accessibility concerns.

---

## 8. Mini To-do Mode

The to-do feature must remain intentionally small.

This is not Notion.  
This is not Todoist.  
This is not a project manager.

### Scope

Support only:

- add task
- complete task
- edit task if useful
- delete task
- clear completed tasks

Do not add in v1:

- projects
- nested subtasks
- tags
- priorities
- calendars
- due dates
- databases
- kanban
- collaboration
- accounts

### Task row

A task row should contain:

```text
[checkbox] Task text                    [delete]
```

Keep rows compact.

### Completed tasks

Use:

- line-through
- muted text

Completed tasks should remain readable but clearly secondary.

### Add task

Prefer one simple input.

Example placeholder:

```text
Add task
```

Pressing `Enter` should add the task.

### Persistence

If persistence is implemented, use local browser storage for this small static utility.

Do not require a server or account.

---

## 9. Navigation

Navigation switches between:

```text
Clock
Timer
To-do
```

Use a compact tab or segmented-control pattern.

Example:

```text
Clock    Timer    To-do
```

The active mode should be obvious through:

- text color
- subtle surface change
- restrained accent

Do not use oversized navigation buttons.

Navigation should remain usable with keyboard controls.

---

## 10. Components

### Buttons

Buttons should be:

- flat
- compact
- clearly interactive
- high contrast

Preferred shapes:

- `rounded-sm`
- `rounded-md`

Avoid excessive shadows.

Primary button:

```text
accent background
high-contrast text
```

Secondary button:

```text
zinc surface
border
```

Ghost button:

```text
transparent background
muted text
hover state
```

### Inputs

Inputs should use:

- simple border
- clear focus state
- compact padding
- high readability

Avoid floating-label patterns unless necessary.

### Panels

Panels should exist only when they help group related controls.

Use:

```text
surface
border
small radius
```

Do not wrap every piece of content inside a card.

### Borders

Prefer:

```text
border
```

instead of arbitrary `border-[1px]`.

### Shadows

Default:

```text
shadow-none
```

A very subtle shadow may be used only if necessary to separate overlapping UI.

---

## 11. Motion

Motion should communicate state, not decorate the page.

### Allowed

- opacity transitions
- button hover transitions
- subtle color transitions
- small progress transitions

Typical duration:

```text
100–200ms
```

### Avoid

- bouncing
- floating elements
- constant animations
- large panel slides
- animated backgrounds
- dramatic scale effects
- unnecessary entrance animations

### Reduced motion

Respect:

```text
prefers-reduced-motion
```

The application must remain fully usable without animation.

---

## 12. Responsive Behavior

The application must work well on:

- phones
- tablets
- laptops
- desktops
- large monitors

### Mobile

Primary tool remains dominant.

Controls may stack vertically when necessary.

Touch targets should generally be at least approximately 44×44 CSS pixels.

### Landscape mobile

Prioritize keeping Clock/Timer digits visible.

Controls may shift into a compact horizontal layout.

Do not force a complicated split-screen design unless it genuinely improves usability.

### Desktop

Keep content centered.

Do not stretch controls unnecessarily.

### Wide screens

Allow the clock itself to scale.

Keep settings, navigation, and task panels constrained.

---

## 13. Accessibility

Accessibility is part of the design, not an optional cleanup phase.

### Keyboard

All interactive elements must be reachable by keyboard.

### Focus

Never remove focus outlines without providing an equally visible replacement.

Example:

```text
focus-visible:ring-2
focus-visible:ring-blue-500
```

### Semantics

Prefer correct HTML elements:

- `<main>`
- `<nav>`
- `<section>`
- `<button>`
- `<time>`
- `<label>`
- `<input>`

Do not replace semantic controls with clickable `<div>` elements.

### Contrast

Text and controls must maintain strong contrast.

Do not use muted colors for important information.

### Motion

Respect reduced-motion preferences.

---

## 14. Tailwind CSS v4 Rules

This project uses Tailwind CSS v4.

### Configuration

Do not generate outdated Tailwind v3 configuration unless explicitly required.

Do not automatically create:

```text
tailwind.config.js
```

Use Tailwind v4 conventions.

### Utilities

Prefer standard Tailwind utilities.

Use arbitrary values only when they solve a real design requirement.

Acceptable example:

```text
text-[clamp(4rem,12vw,11rem)]
```

for responsive clock typography.

Do not use arbitrary values simply to avoid following the spacing scale.

### Consistency

Keep consistent:

- spacing
- border radius
- text sizing
- color tokens

### State

Use semantic HTML states or `data-*` attributes when they simplify styling.

Do not create overly complicated dynamic class-generation systems for simple UI states.

---

## 15. Anti-Slop Rules

The AI must not default to common AI-generated landing-page patterns.

Do not use:

- gradient hero backgrounds
- glowing blobs
- decorative floating spheres
- glassmorphism
- excessive backdrop blur
- neon glow shadows
- oversized hero marketing copy
- giant empty cards
- excessive pill-shaped buttons
- fake testimonials
- fake company logos
- fake statistics
- unnecessary badges
- random decorative SVGs
- abstract background patterns
- excessive animations
- unnecessary illustrations
- startup marketing layouts

Do not use phrases such as:

```text
Transform your workflow
Supercharge your productivity
Unlock your potential
The ultimate productivity experience
```

This is a utility.

The product itself is the content.

---

## 16. Content and Microcopy

Copy should be short and literal.

Prefer:

```text
Start
Pause
Reset
Add task
Clear completed
12H
24H
Fullscreen
```

Instead of:

```text
Begin your focus journey
Supercharge your session
You're all caught up!
```

Empty state:

```text
No tasks
```

Error state:

```text
Could not save task
```

Keep language calm and direct.

---

## 17. Favicon and App Identity

The site should have a simple recognizable mark that works at very small sizes.

Preferred concept:

```text
:
```

A bold digital colon can represent both:

- clock
- timer

Alternative concepts may use a minimal clock/timer glyph.

Do not create:

- gradient app icons
- complicated illustrations
- tiny detailed logos

The icon should remain recognizable at:

```text
16×16
32×32
```

Primary dark theme browser color:

```html
<meta name="theme-color" content="#09090b" />
```

---

## 18. Product Identity Rule

The interface should not imitate:

- Vercel
- Apple
- Linear
- Notion
- another existing tool

These products may be used as references for design discipline, but not as visual templates.

The site should gradually develop its own recognizable identity.

Identity should come from:

- typography
- layout
- interaction quality
- restrained accent usage
- consistency

not from decoration.

---

## 19. Definition of Done

Before considering a UI implementation complete, verify:

- [ ] Clock / Timer is immediately usable after page load.
- [ ] Primary tool is visually dominant.
- [ ] No marketing hero section exists.
- [ ] No unnecessary gradients, blur, glow, or decorative backgrounds exist.
- [ ] Time digits use `tabular-nums` or an appropriate monospace treatment.
- [ ] Layout works on mobile and desktop.
- [ ] Accessibility zoom does not make important content inaccessible.
- [ ] Keyboard navigation works.
- [ ] Every interactive control has a visible focus state.
- [ ] Buttons use clear semantic labels.
- [ ] To-do feature remains intentionally lightweight.
- [ ] No server/account dependency exists for basic functionality.
- [ ] Tailwind CSS v4 conventions are followed.
- [ ] `DESIGN.md` takes priority over generic AI-generated styling habits.
- [ ] Git diff contains no unexplained design-related changes.
