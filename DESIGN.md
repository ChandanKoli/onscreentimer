# DESIGN.md

## 1. Product Design Philosophy

OnScreenTimer is a browser utility, not a marketing page.

The user should be able to open the site and immediately use the core product:

1. Timer
2. Clock
3. Stopwatch
4. Mini To-do / Current Task system

The Mini To-do is not a separate primary mode. It is a lightweight task-timing system that can work alongside Timer, Clock, and Stopwatch.

There should be no onboarding wall, giant hero section, promotional copy, account requirement, or decorative introduction before the utility.

The interface should feel closer to a well-designed desktop utility or digital instrument than a startup landing page.

### Priority order

1. Function
2. Readability
3. Speed
4. Accessibility
5. Interaction quality
6. Visual identity
7. Decoration

If a visual decision makes the tool harder to understand or slower to use, remove it.

### Permanent design rule

**Utility first. Identity second. Decoration last.**

The product itself is the content.

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
- childish
- noisy
- overly minimal to the point of emptiness
- like a generic AI-generated SaaS landing page

### Density

Use compact controls and a clear information hierarchy.

Allow generous space around the active time display, but keep controls and secondary interfaces reasonably dense.

Avoid giant empty sections.

### Shape language

Prefer simple geometric shapes.

Use:

- `rounded-sm`
- `rounded-md`

Use larger radii only where functionally justified.

Circular controls are appropriate for small icon-only header actions such as:

- sound / mute
- theme

Do not make every button, panel, and container pill-shaped.

### Decoration

Decoration should be extremely restrained.

Do not add visual elements that do not communicate information or improve usability.

---

## 3. Color System

Use Tailwind's `zinc` palette as the neutral foundation.

The first-load experience should default to a comfortable light theme, not an aggressively bright white interface.

Dark mode should remain equally intentional and polished.

### Light Mode

Suggested foundation:

- Page background: `zinc-50`
- Primary surface: `white`
- Secondary surface: `zinc-100`
- Primary border: `zinc-200`
- Strong border: `zinc-300`
- Primary text: `zinc-950`
- Secondary text: `zinc-700`
- Muted text: `zinc-500`

The light theme should feel soft and calm rather than glaring.

### Dark Mode

Suggested foundation:

- Page background: `zinc-950`
- Primary surface: `zinc-900`
- Secondary surface: `zinc-900/60`
- Primary border: `zinc-800`
- Strong border: `zinc-700`
- Primary text: `zinc-50`
- Secondary text: `zinc-300`
- Muted text: `zinc-400`
- Disabled text: `zinc-600`

### Accent

Use one restrained accent family.

Preferred accent:

- Dark mode: `blue-500`
- Light mode: `blue-600`

The accent should primarily indicate:

- primary actions
- active mode
- focus
- timer progress
- selected controls
- important interactive state

Do not cover large portions of the UI with the accent color.

### Task state colors

The To-do / Current Task system uses three clear semantic states:

- Pending: red / rose
- Current: yellow / amber
- Completed: green / emerald

Color must not be the only signal. State should also be communicated through position, iconography, labels, or interaction.

### Current task contrast rule

Inside the desktop To-do list, the current task row should visibly invert against the active theme:

- Dark theme → current task row uses a light treatment
- Light theme → current task row uses a dark treatment

This is intentionally stronger than the surrounding rows so the active task is unmistakable.

The separate **Current Task bar** in the main workspace should remain aligned with the active theme rather than using the opposite-theme treatment.

A small yellow active indicator may blink while a task is running.

Respect `prefers-reduced-motion`; when reduced motion is requested, show the active indicator without blinking.

### Gradients

Do not use gradients in v1.

A future design may introduce an extremely subtle gradient only if it has a clear visual purpose.

---

## 4. Typography

Typography should prioritize numerical readability and interface clarity.

### General interface font

Prefer the normal system UI stack through Tailwind's `font-sans`.

Do not load a custom font unless there is a meaningful reason.

### Time digits

For Timer, Clock, and Stopwatch:

- use `tabular-nums`
- optionally use `font-mono` where it genuinely improves readability
- digits must not visually shift width as the time changes
- scale responsively using a controlled `clamp()` when useful

Example concept:

```css
font-size: clamp(4rem, 12vw, 11rem);
```

Using an arbitrary Tailwind value for this specific purpose is acceptable.

### Interface hierarchy

Primary time display:
- extremely prominent

Section title:
- `text-sm`
- `font-medium`

Utility label:
- `text-xs`
- muted

Task text:
- compact and highly readable

Avoid excessive uppercase text.

Uppercase may be used for very small technical labels such as MODE, STYLE, and SIZE if it improves scanning.

---

## 5. Overall Page Structure

The main utility should dominate the first viewport.

Conceptual page structure:

```text
Header
↓
Primary Utility Workspace
↓
How It Works / Supporting Content
↓
FAQ / Supporting Pages Entry Points
↓
Footer
```

Do not turn the top of the page into a marketing hero.

### Desktop workspace

The desktop workspace should roughly follow this hierarchy:

```text
                 Main time display

          Set Timer    Start/Pause   Reset   Stop

Current Task bar                MODE   STYLE   SIZE

To-do panel on the left side of the workspace
```

The exact spacing may evolve during real browser testing, but the relationships above are intentional.

### Main visual priority

The Timer / Clock / Stopwatch display is the visual center of gravity.

The controls should support it rather than compete with it.

### Viewport behavior

Use:

- `min-h-dvh`

Do not globally force `overflow-hidden`.

Scrolling should remain available when:

- accessibility zoom increases content size
- the screen is unusually small
- supporting content extends below the utility
- mobile landscape creates limited vertical space

Full size mode may intentionally hide most surrounding interface.

### Width

Do not stretch controls across very wide displays.

The timer input, task controls, and dropdowns should remain compact even on large monitors.

### Spacing

Prefer the normal Tailwind spacing scale.

Typical values:

- small control spacing: `gap-2`
- standard grouping: `gap-4`
- major separation: `gap-6` or `gap-8`

Avoid massive spacing values purely for visual drama.

---

## 6. Header

The header should be compact and utility-oriented.

### Left side

Show:

- OnScreenTimer product mark / in-site logo
- `OnScreenTimer` title

The **OnScreenTimer title itself acts as Home**.

Clicking it returns the user to the main Home experience.

The in-site logo and favicon are separate assets. Changing one must not silently replace the other.

### Right side

Preferred order:

```text
[Sound]   [Language]   [Theme]   [Menu]
```

#### Sound

- circular icon button
- toggles sound / mute
- state must be obvious and accessible

#### Language

Use the language name itself, for example:

```text
English ▾
```

Do not require a globe icon.

The exact launch language list is not yet locked.

#### Theme

- circular icon button
- toggles light / dark theme

#### Burger menu

Use a compact menu control for persistent or less-frequent settings and navigation.

Appropriate items may include:

- 12h / 24h Clock format
- To-do visibility / reopen action where appropriate
- supporting pages
- other persistent settings added later

Do not turn the burger-menu position into a giant CTA.

---

## 7. Primary Modes

There are three primary modes:

1. Timer
2. Clock
3. Stopwatch

Mode switching belongs inside the main workspace rather than acting like a large marketing navigation system.

### Mode control

Use a compact button:

```text
MODE ▾
```

The dropdown opens downward.

Options:

```text
Timer
Clock
Stopwatch
```

Timer is the default mode on first visit.

Changing modes should not unexpectedly destroy To-do data.

The To-do system may remain available alongside any of the three modes unless the user hides it or enters Full size mode.

---

## 8. Display Styles

There are three time-display styles:

1. Modern
2. Digital
3. Analog

### Style control

Use a compact button:

```text
STYLE ▾
```

The dropdown opens downward.

Modern is the default style.

### Modern

A clean contemporary time display.

Prioritize:

- strong numeral clarity
- excellent spacing
- tabular digits
- minimal decoration

### Digital

A segmented digital-clock treatment.

It should feel intentional and readable, not like a neon arcade display.

Avoid unnecessary glow effects.

### Analog

A simple circular analog face inspired by the restraint of a modern phone clock.

Use:

- hour hand
- minute hand
- second hand
- hour numbers around the face: `12, 1, 2 ... 11`
- minimal tick treatment where useful

Do not use:

- vintage styling
- realistic textures
- metallic bezels
- skeuomorphic shadows
- decorative complications

Analog style should be available for Timer, Clock, and Stopwatch where the time model supports it.

If an analog representation creates ambiguity in Timer or Stopwatch behavior, clarity takes priority over visual purity.

---

## 9. Display Size System

There are four size stops:

1. Tiny
2. Mid
3. Big
4. Full

Mid is the default.

### Size control

Use a compact button visually consistent with MODE and STYLE:

```text
SIZE ^
```

SIZE is the rightmost control in the lower control group.

Unlike MODE and STYLE, the size selector opens upward.

### Slider behavior

Use a four-stop vertical or upward-expanding control, conceptually similar to stops on a transit line:

```text
Full
  ●
Big
  ●
Mid
  ●
Tiny
```

The exact visual implementation should stay compact and accessible.

### Full size mode

Full is a focused display mode, not merely a slightly larger font size.

In Full:

- the main Timer / Clock / Stopwatch display dominates the viewport
- the To-do panel disappears
- header and supporting content disappear
- nonessential controls disappear
- essential contextual controls remain

For Timer and Stopwatch, retain applicable controls such as:

- Start / Pause
- Reset
- Stop
- Current Task bar(s)
- Size control

For Clock, retain only controls that make sense for Clock.

Do not show irrelevant Timer controls in Clock mode.

The user must retain a clear way to leave Full mode.

---

## 10. Timer Mode

Timer is the default mode.

### Main display

Use:

- large high-contrast digits
- `tabular-nums`
- responsive scaling
- selected Modern / Digital / Analog style

### Set Timer input

Provide a compact natural-duration input.

Example placeholder:

```text
eg: 2mins, 02:00, 1hr 30mins, 90s
```

Supported input should include natural forms such as:

- `2mins`
- `02:00`
- `1hr 30mins`
- `90s`

A plain number such as:

```text
5
```

should be interpreted as **5 minutes**.

Parsing rules should be predictable and forgiving.

### Primary timer controls

Preferred order:

```text
Start/Pause   Reset   Stop
```

Start is the primary blue action when idle.

Pause replaces or takes over the primary Start action while running.

Reset and Stop are secondary but clearly discoverable.

### Reset

Reset should reset:

- the main timer
- active Current Task duration tracking

The exact interaction may be refined after hands-on testing, but the initial implementation should follow this rule.

### Stop

Stop ends the main running session.

If Current Tasks are active:

- Stop completes all active Current Tasks
- their recorded task durations are preserved
- they become Completed
- pending-task progression continues according to the task queue behavior

Stop is intentionally stronger than Pause.

A later update may separate session stopping from task completion if real usage shows that users need more control.

### Completion sound

When the timer reaches zero:

- use a soothing, smooth completion sound
- avoid loud, chaotic, alarm-like audio
- respect the header Sound / Mute state

Do not flash the entire screen.

A subtle completion-state transition is acceptable.

---

## 11. Clock Mode

Clock mode is a normal real-world clock.

It should work well for passive display use such as:

- studying with a large clock visible
- New Year countdown watching
- waiting for a birthday or event boundary
- keeping current time visible on another screen

### Clock display

The Clock should remain the dominant visual element.

12-hour and 24-hour formats should both be available.

This is a persistent preference and belongs in the burger/settings menu rather than occupying the primary workspace.

Seconds should be available in the Clock display.

### To-do alongside Clock

Do **not** automatically hide the To-do system when MODE = Clock.

A user may want a large real-world clock while still tracking tasks.

The To-do panel is hidden only when:

- the user manually minimizes/closes it
- Full size mode intentionally removes it from the focused layout

### Clock controls

Do not show Timer-only controls such as Set Timer, Reset, or Stop unless they have an actual Clock-specific meaning.

Avoid inactive or decorative controls.

---

## 12. Stopwatch Mode

Stopwatch should use the same visual system as Timer and Clock.

### Main display

Use:

- tabular numerals
- responsive scaling
- Modern / Digital / Analog styles
- Tiny / Mid / Big / Full sizing

### Controls

Use the same compact control language as Timer where semantically appropriate:

```text
Start/Pause   Reset   Stop
```

Exact stopwatch semantics should remain intuitive.

### To-do integration

Stopwatch can run while Current Tasks independently track their own elapsed durations.

The main stopwatch and task timers are related but separate clocks.

Example:

```text
Main Stopwatch     14:23
Task A              03:18
Task B              00:54
```

Tasks may begin at different points in the stopwatch session.

Their recorded durations therefore do not need to equal the main stopwatch duration.

---

## 13. Current Task System

The Current Task system connects the main time utility with the Mini To-do.

It is not a heavy project-management system.

### Separate surfaces

There are two connected surfaces:

1. the Mini To-do panel
2. the separate Current Task bar in the main workspace

Do not merge these into one giant task panel.

### Main timer vs task timers

The primary Timer or Stopwatch measures the overall session.

Each Current Task measures only the time during which that task is active.

Example:

```text
Main Timer:   30:00 study session

Task 1:        5:00 De Moivre
Task 2:       10:00 Questions
```

Task durations are calculated automatically.

### Up to two simultaneous Current Tasks

A maximum of **two tasks may be Current at the same time**.

They may start at different moments.

They run simultaneously once active.

Example:

```text
Main timer      14:23
Current Task A   06:12
Current Task B   02:03
```

Each Current Task can finish independently.

Pressing the main Stop control ends both active Current Tasks together.

### Current Task bar

The Current Task bar sits below the primary timer-control row and starts farther left than the MODE / STYLE / SIZE group.

The bar should be wide enough to make the task name readable.

When one task is Current, show one Current Task bar.

When two tasks are Current, show two bars stacked vertically in task priority/order.

### Active indicator

A Current Task should have a small yellow active indicator.

The indicator may blink while actively timing.

Respect reduced-motion preferences.

### Contextual Current Task controls

On desktop hover, contextual controls may appear:

```text
[X]   Current Task name   [✓]
```

- `✓` completes that task individually
- `X` removes it from Current and returns it to Pending rather than deleting it

For the initial interaction model, cancellation with `X` should be available after the main timer/session is paused.

The exact presentation may be refined during real usage testing.

---

## 14. Mini To-do Panel

The Mini To-do is intentionally lightweight.

This is not Notion.
This is not Todoist.
This is not a project manager.

### Desktop placement

On desktop, the main To-do panel lives on the **left side** of the utility workspace.

Do not let it overpower the main time display.

### Mobile placement

The exact mobile presentation is intentionally not locked yet.

Do not simply squeeze the desktop left panel into a narrow phone screen.

Possible mobile patterns may be evaluated during responsive testing.

### Default state

On first use:

- To-do is empty
- show a clear `Add +` action
- do not pre-create fake tasks

### Core task states

Each task is one of:

```text
Pending
Current
Completed
```

Visual semantics:

```text
🔴 Pending
🟡 Current
🟢 Completed
```

Actual implementation should use accessible UI rather than emoji as the only state indicator.

### Adding tasks

Provide a simple task-entry interaction.

A plus button is appropriate.

Keep task creation fast.

### Editing task names

Task names can be edited at any time.

Desktop:
- double-click a task name to enter editing
- hover may expose contextual actions such as delete and complete/select

Mobile:
- double-tap the task to expose editing and contextual task controls

Do not depend on hover for functionality that must work on touch screens.

### Deleting tasks

Deleting a task removes it from existence.

This is different from removing a task from Current.

### Reordering

Users can:

- drag tasks to reorder the To-do
- drag a Pending task into the Current Task area

Reordering must not corrupt original task identity or recorded duration.

### Starting tasks

If there are zero tasks, the primary timer can run without a Current Task.

If one or more Pending tasks exist and there is no Current Task, starting the main Timer/Stopwatch should make the first Pending task Current.

Users may also explicitly make a task Current.

### Completing a Current Task

A Current Task may be completed in two ways:

1. press the task's `✓`
2. press the main Stop button

When completed:

- task becomes green / Completed
- its recorded duration becomes visible
- pending progression continues
- the main timer may continue when completion was done via the individual `✓`

### Cancelling a Current Task

Using the Current Task `X`:

- removes the task from Current
- returns it to Pending
- does not delete it

### Restarting a Completed Task

A Completed task may expose a circular-arrow / restart control.

Using it can make that task Current again.

This is allowed even when another task is already Current, provided the maximum of two Current Tasks is not exceeded.

### Completed task deletion

Completed tasks may be deleted.

### Task duration visibility

The duration of an active task does not need to dominate the interface.

The recorded duration becomes especially important after completion.

### Queue behavior

Pending tasks should remain prominent.

Completed-task ordering follows the product's motivating rotating-queue concept.

Reference behavior:

Initial:

```text
🔴 Task 1
🔴 Task 2
🔴 Task 3
🔴 Task 4
🔴 Task 5
```

During progress:

```text
🟢 Task 2    8:20
🟡 Task 3   ← CURRENT
🔴 Task 4
🔴 Task 5
🟢 Task 1   12:41
```

The latest completed task may remain near the active area while earlier completed work rotates downward.

When every task is complete, the final completed list should resolve back into the original task sequence:

```text
🟢 Task 1   12:41
🟢 Task 2    8:20
🟢 Task 3   19:02
🟢 Task 4    6:54
🟢 Task 5   14:33
```

Do not invent a different sorting system merely because it is easier to implement.

If implementation reveals an ambiguous edge case in this rotation behavior, surface it as a product decision rather than silently redefining the feature.

### All tasks completed

When all tasks are Completed:

- the Current Task area shows a clear `All tasks completed` state
- no new Current Task is invented
- the main Timer stops and returns to `00:00`
- a Stopwatch keeps the elapsed result it took to complete the task session
- the completed To-do remains available until the user adds more tasks or resets the To-do

### To-do minimize / close

The To-do panel may be minimized/closed without deleting its tasks.

When minimized:

- data remains
- provide a compact left-edge or menu-based way to reopen it
- choose the final reopen control based on what looks and works best in the implemented layout

### To-do reset

Provide a separate reset action.

Reset terminates the current To-do session and returns the To-do to an empty state.

Exact confirmation behavior may be calibrated after hands-on testing.

### Visible desktop task count

Start with approximately **8 visible task rows** on desktop.

This is a visual limit, not a hard task-capacity limit.

After the visible list grows beyond the compact panel, expose:

```text
More +
```

### Expanded task manager

`More +` should eventually open a proper expanded task-management view.

The exact form is intentionally deferred until the compact product is tested.

Possible forms include:

- overlay
- expanded panel
- dedicated task manager surface

The expanded view may comfortably handle roughly 20–30 visible/scrollable tasks, but do not impose an arbitrary hard 30-task product limit without a reason.

Current Task remains conceptually separate from the expanded task manager.

---

## 15. Lower Workspace Controls

Below the primary timer-control row, use this relationship:

```text
Current Task bar       MODE ▾   STYLE ▾   SIZE ^
```

The Current Task bar begins farther left and receives more width.

MODE, STYLE, and SIZE should feel like one compact control group.

### MODE

- opens downward
- Timer
- Clock
- Stopwatch

### STYLE

- opens downward
- Modern
- Digital
- Analog

### SIZE

- rightmost
- same general button dimensions as MODE and STYLE
- opens upward
- Tiny
- Mid
- Big
- Full

Do not make these controls giant or visually louder than the main time display.

---

## 16. Sound

Sound is functional feedback, not spectacle.

### Timer completion

Use a soft, smooth, soothing beep/chime.

The desired feeling is calm and creamy rather than alarming.

Avoid:

- harsh buzzers
- emergency-alarm sounds
- repeated chaotic beeping
- unnecessarily high volume
- startling effects

### Sound toggle

The header contains a dedicated circular Sound / Mute button.

Persist the user's sound choice.

Other sound events may be added only if they improve usability and do not create noise.

---

## 17. Persistence

The application should preserve useful local state so returning users can continue easily.

Use local browser storage for this small static utility.

Persist where practical:

- To-do tasks
- task order
- Pending / Current / Completed states
- completed task durations
- active Current Task identity
- Timer / Stopwatch state needed for restoration
- selected Mode
- selected Style
- selected Size
- light / dark theme
- sound / mute choice
- language choice
- Clock 12h / 24h preference
- To-do minimized state where appropriate

Do not require:

- account
- backend
- database
- cloud sync

for basic v1 persistence.

This amount of local state is expected to be tiny.

If real-device testing reveals a genuine low-end-device issue, simplify restoration behavior based on evidence rather than prematurely removing persistence.

---

## 18. Buttons, Inputs, and Panels

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
clear hover/focus state
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

Prefer normal Tailwind border utilities rather than unnecessary arbitrary values.

### Shadows

Default:

```text
shadow-none
```

A very subtle shadow may be used only if necessary to separate overlapping UI such as a dropdown.

---

## 19. Motion

Motion should communicate state, not decorate the page.

### Allowed

- opacity transitions
- button hover transitions
- subtle color transitions
- small progress transitions
- compact dropdown / slider transitions
- current-task active indicator

Typical duration:

```text
100–200ms
```

### Avoid

- bouncing
- floating decoration
- animated backgrounds
- dramatic panel entrances
- large scale effects
- constant decorative animation
- unnecessary parallax

### Reduced motion

Respect:

```text
prefers-reduced-motion
```

The application must remain fully understandable and usable without animation.

---

## 20. Responsive Behavior

The application must work well on:

- phones
- tablets
- laptops
- desktops
- large monitors

### Mobile philosophy

Mobile is not a squeezed desktop layout.

Recalibrate the interface for touch.

The same core product functionality should remain available, but controls may move or change presentation.

### Mobile requirements

- touch targets should generally be at least approximately 44×44 CSS pixels
- do not show desktop-only keyboard helper text on touch layouts
- avoid hover-only functionality
- double-tap task interaction may expose editing / contextual controls
- keep the primary time display dominant
- avoid horizontal overflow
- test multiple real viewport widths

### Landscape mobile

Prioritize keeping the Timer / Clock / Stopwatch readable.

Controls may shift into a compact horizontal arrangement when space allows.

### Desktop

- To-do panel on the left
- primary time display near visual center
- compact controls
- do not stretch everything to the viewport edges

### Wide screens

Allow the time display to scale.

Keep settings, navigation, and task panels constrained.

---

## 21. Accessibility

Accessibility is part of the design, not a cleanup phase.

### Keyboard

All interactive elements must be keyboard reachable.

Keyboard shortcuts may be added when useful, but desktop-only hints must not appear on phone layouts.

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

### Task states

Pending / Current / Completed states must not depend on red / yellow / green alone.

### Sound

The product must remain understandable while muted.

### Motion

Respect reduced-motion preferences.

---

## 22. Tailwind CSS v4 Rules

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

for responsive time typography.

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

## 23. Supporting Content

The primary utility remains dominant.

Supporting content belongs below the usable application rather than before it.

### How It Works

A compact How It Works section may explain the main flow:

```text
01 Set mode
02 Set timer or start stopwatch
03 Set size
04 Set style
```

Also provide focused explanations for:

- using Clock
- using the Mini To-do / Current Task system

Do not turn these into marketing sections.

### FAQ

FAQ should answer real user questions and search intent.

Avoid filler questions written only to create page length.

### Supporting pages

Potential pages include:

- FAQ
- About
- Contact
- Privacy Policy
- Terms & Conditions
- 404
- error page where applicable

Supporting pages should inherit the actual product's visual language.

Do not design them as disconnected templates.

---

## 24. Footer

The footer may have richer organization than the main utility, but must remain restrained.

Possible groups:

- Product / Modes
- Learn / How It Works / FAQ
- Project / About / Contact
- Legal
- Language
- Credits where appropriate

Do not copy another website's exact footer structure or branding.

Avoid:

- giant newsletter boxes
- fake social proof
- decorative corporate sections
- unrelated links added for visual density

---

## 25. Content and Microcopy

Copy should be short and literal.

Prefer:

```text
Start
Pause
Reset
Stop
Add +
Current Task
All tasks completed
Timer
Clock
Stopwatch
Modern
Digital
Analog
Tiny
Mid
Big
Full
```

Instead of:

```text
Begin your focus journey
Supercharge your session
You're all caught up!
Unlock your productivity
```

Error states should be equally direct.

Keep language calm and understandable.

Because the product is intended to support multiple languages, avoid slang or unnecessarily ambiguous UI copy in functional controls.

---

## 26. Anti-Slop Rules

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

OnScreenTimer is a utility.

The utility itself is the content.

---

## 27. Favicon and Product Identity

The site should have a simple recognizable mark that works at very small sizes.

The final favicon/logo is intentionally deferred.

Important rule:

**The browser favicon and the in-website OnScreenTimer logo are separate assets.**

If the in-site logo is replaced later, do not modify the favicon unless explicitly requested.

Avoid:

- gradient app icons
- complicated illustrations
- tiny detailed logos

The favicon should remain recognizable at:

```text
16×16
32×32
```

Do not lock a final favicon concept before the dedicated branding step.

---

## 28. Product Identity Rule

The interface should not imitate:

- Vercel
- Apple
- Linear
- Notion
- another timer utility
- the mentor/reference websites

Existing products may be used as references for:

- design discipline
- interaction organization
- clarity
- restraint

They are not visual templates.

OnScreenTimer should gradually develop its own identity through:

- typography
- layout
- interaction quality
- task-timing behavior
- restrained accent usage
- consistency

not through decoration.

---

## 29. Deliberately Deferred Decisions

Some decisions should be made after the first real implementation can be used in-hand.

Do not invent permanent answers for these prematurely.

Currently deferred:

- exact `More +` expanded task-manager form
- exact mobile To-do presentation
- Clear Completed / Clear All behavior
- final task-manager capacity presentation
- final favicon / logo
- exact supported language list
- small Timer/Stop/Task-completion refinements discovered through real use
- optional additional completion sounds or notification behavior
- visual polish that cannot be judged until the product exists

When these become relevant, use the implemented product and real testing to decide.

---

## 30. Definition of Done

Before considering a UI implementation complete, verify:

- [ ] Timer is the default mode.
- [ ] Timer, Clock, and Stopwatch are all immediately accessible.
- [ ] Modern, Digital, and Analog display styles exist.
- [ ] Tiny, Mid, Big, and Full size options exist.
- [ ] Full mode behaves as a focused display rather than simply enlarging text.
- [ ] Primary time display is visually dominant.
- [ ] Set Timer accepts the agreed natural-duration examples.
- [ ] A plain number is interpreted as minutes.
- [ ] Timer exposes Start/Pause, Reset, and Stop.
- [ ] Timer completion sound is calm and respects Mute.
- [ ] Header contains product Home/title, Sound, Language, Theme, and menu controls.
- [ ] Language control uses the language name rather than requiring a globe icon.
- [ ] 12h / 24h Clock format is available as a persistent setting.
- [ ] To-do can coexist with Timer, Clock, and Stopwatch.
- [ ] Desktop To-do panel lives on the left.
- [ ] To-do can be minimized without losing tasks.
- [ ] Current Task is a separate main-workspace surface.
- [ ] Up to two Current Tasks can run simultaneously.
- [ ] Two Current Tasks may start at different times.
- [ ] Main Stop completes all active Current Tasks.
- [ ] Individual Current Tasks can be completed independently.
- [ ] Cancelling Current returns it to Pending rather than deleting it.
- [ ] Completed tasks can be restarted and deleted.
- [ ] Task durations are recorded independently from the main session timer.
- [ ] Task status is communicated by more than color alone.
- [ ] Approximately eight task rows fit the compact desktop list before `More +`.
- [ ] To-do persistence works without an account or backend.
- [ ] Theme, sound, mode, style, size, and relevant preferences persist locally.
- [ ] No marketing hero section exists.
- [ ] No unnecessary gradients, blur, glow, or decorative backgrounds exist.
- [ ] Time digits use `tabular-nums` or another stable-width treatment where appropriate.
- [ ] Layout works on mobile and desktop.
- [ ] Mobile does not expose desktop-only keyboard helper text.
- [ ] Accessibility zoom does not make important content inaccessible.
- [ ] Keyboard navigation works.
- [ ] Every interactive control has a visible focus state.
- [ ] Reduced-motion preference is respected.
- [ ] No server/account dependency exists for basic functionality.
- [ ] Tailwind CSS v4 conventions are followed.
- [ ] `DESIGN.md` takes priority over generic AI-generated styling habits.
- [ ] Git diff contains no unexplained design-related changes.
