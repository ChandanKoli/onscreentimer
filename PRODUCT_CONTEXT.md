# OnScreenTimer — Product Context

## Product

OnScreenTimer is a fast browser utility built around:

- Timer
- Clock
- Stopwatch
- Mini To-do / Current Task timing

The main time tool is the product. The To-do system supports it rather than becoming a separate productivity suite.

## Core Goal

Immediate usefulness.

A user should be able to open the site and start using the timer, clock, stopwatch, or task-timing workflow without onboarding, an account, or a marketing-first landing page.

The tool itself is the content.

## Current Stage

Pre-production product definition and implementation setup.

The core behavior has been defined well enough to begin building, but some interaction details are intentionally left for hands-on testing after the first working version exists.

## Long-Term Direction

Public launch at:

`onscreentimer.com`

The first public version should be:

- fast
- clean
- mobile-friendly
- accessible
- SEO-aware
- usable without an account
- easy to return to because useful state can persist locally

## Priorities

1. Utility
2. Reliability
3. Speed
4. Ease of use
5. Calm visual design
6. Mobile usability
7. Accessibility
8. Interaction quality
9. Discoverability / SEO
10. Maintainability after launch

## Product Philosophy

Build a small, focused utility rather than a bloated productivity platform.

Important principles:

- Utility first
- Identity second
- Decoration last
- Keep the main time display visually dominant
- Keep controls compact
- Prefer clear behavior over clever behavior
- Avoid generic AI-generated SaaS design patterns
- Use reference sites for research, not imitation
- Test uncertain interaction choices in the real product before over-designing them

## Primary Modes

There are three main modes:

1. Timer
2. Clock
3. Stopwatch

Default mode:

`Timer`

Mode is controlled through a compact dropdown:

`MODE ▾`

The To-do / Current Task system may work alongside all three modes.

## Display Styles

There are three display styles:

1. Modern
2. Digital
3. Analog

Default style:

`Modern`

### Modern

Clean contemporary numerals and restrained interface styling.

### Digital

Segmented digital-clock styling without neon or arcade-like effects.

### Analog

A minimal modern analog face with:

- hour hand
- minute hand
- second hand
- hour numbers around the face

The analog design should feel closer to a modern phone clock than a vintage or skeuomorphic clock.

## Display Sizes

There are four size stops:

1. Tiny
2. Mid
3. Big
4. Full

Default size:

`Mid`

MODE and STYLE dropdowns open downward.

SIZE is the rightmost control and opens upward into a four-stop size selector.

## Full Size Mode

Full is a focused display mode.

In Full mode:

- the main Timer / Clock / Stopwatch dominates the viewport
- the normal To-do panel disappears
- header and other nonessential interface disappear
- Current Task bar(s) remain where relevant
- Start / Pause, Reset, Stop, and Size remain where relevant
- Clock should only show controls that make sense for Clock
- the user must have an obvious way to leave Full mode

The To-do data itself is not deleted when hidden.

## Timer

Timer is the default mode.

### Set Timer input

The user can enter durations naturally.

Examples:

- `2mins`
- `02:00`
- `1hr 30mins`
- `90s`
- `5`

A plain number such as `5` means 5 minutes.

### Main controls

Preferred order:

`Start/Pause → Reset → Stop`

### Reset

Reset initially resets:

- the main timer
- active Current Task duration tracking

This behavior can be refined later if real use shows a better interaction.

### Stop

Stop ends the current main session.

If one or two Current Tasks are active, Stop completes all active Current Tasks at the same moment.

They become completed and keep their recorded durations.

### Timer completion sound

When Timer reaches zero:

- play a soothing, smooth beep/chime
- avoid loud or chaotic alarm sounds
- respect the Sound / Mute setting

## Clock

Clock is a normal real-world clock.

Use cases may include:

- studying with a large clock visible
- New Year or birthday timing
- passive time display
- keeping time visible while using the To-do system

Clock supports both:

- 12-hour format
- 24-hour format

The 12h / 24h choice belongs in the burger/settings menu as a persistent setting.

To-do does not automatically disappear in Clock mode.

The user may manually minimize it.

Only Full size mode intentionally hides the normal To-do panel.

## Stopwatch

Stopwatch uses the same main visual system as Timer and Clock.

It can run while one or two Current Tasks independently measure their own elapsed durations.

Tasks may start at different points in the Stopwatch session.

The main Stopwatch duration and task durations therefore do not need to match.

## Mini To-do / Current Task System

The To-do feature is intentionally lightweight.

It is not:

- Notion
- Todoist
- a project manager
- a calendar
- a collaboration platform

It exists to connect a study/work session with individually timed tasks.

### Two connected surfaces

The task system has two connected surfaces:

1. Main To-do panel
2. Separate Current Task bar in the main workspace

On desktop, the main To-do panel lives on the left.

The exact mobile presentation is intentionally deferred until responsive testing.

## Task States

Tasks have three main states:

- Pending
- Current
- Completed

Conceptual color states:

- red = Pending
- yellow = Current
- green = Completed

The interface should not rely on color alone to communicate state.

## Current Task Timing

The main Timer or Stopwatch measures the overall session.

Each Current Task measures only the time during which that task is active.

Example:

A 30-minute Maths session may contain:

- 5 minutes De Moivre
- 10 minutes questions
- another task with a different real duration

Task durations calculate themselves and are recorded when the task is completed.

## Two Simultaneous Current Tasks

A maximum of two tasks may be Current at the same time.

They may:

- start at different moments
- run simultaneously
- finish separately

The Current Task area shows two bars when two tasks are active.

Their order follows task priority / To-do order.

Pressing the main Stop button completes both active Current Tasks together.

## Starting Tasks

If there are zero tasks:

- the main Timer / Stopwatch may run without a Current Task
- the To-do panel may remain empty or be minimized

If Pending tasks exist and there is no Current Task:

- starting the main Timer / Stopwatch makes the first Pending task Current

A user may also:

- explicitly start/select a task
- drag a Pending task into the Current Task area

## Current Task Controls

On desktop hover, contextual actions may appear around the Current Task.

Important actions:

- `X` = remove from Current and return to Pending
- `✓` = complete the Current Task

The Current Task `X` does not delete the task.

For the initial behavior, cancelling a Current Task is available after the main session is paused.

## To-do Task Interaction

Tasks can be:

- added
- edited
- reordered
- made Current
- completed
- restarted
- deleted

### Editing

Desktop:

- double-click task name to edit
- hover exposes contextual actions

Mobile:

- double-tap exposes editing / contextual task controls

The mobile interaction can be refined after real testing.

### Reordering

Tasks can be dragged to reorder the To-do list.

A Pending task can also be dragged into Current Task.

## Completed Tasks

When completed:

- the task becomes green
- its recorded duration becomes visible
- the next Pending task may advance into Current according to queue behavior

A Completed task may expose a circular-arrow control to make it Current again.

A Completed task may also be deleted.

## Task Queue Behavior

The To-do begins as Pending tasks and progressively becomes Completed as work is done.

Example initial state:

```text
🔴 Task 1
🔴 Task 2
🔴 Task 3
🔴 Task 4
🔴 Task 5
```

Example during progress:

```text
🟢 Task 2    8:20
🟡 Task 3   ← CURRENT
🔴 Task 4
🔴 Task 5
🟢 Task 1   12:41
```

The latest completed task may remain near the active area while earlier completed work rotates downward.

When the whole list is complete, the final green list should resolve back into the original task order:

```text
🟢 Task 1   12:41
🟢 Task 2    8:20
🟢 Task 3   19:02
🟢 Task 4    6:54
🟢 Task 5   14:33
```

If implementation exposes an edge case in this behavior, it should be treated as a product decision rather than silently changed.

## All Tasks Completed

When all tasks are completed:

- Current Task area shows `All tasks completed`
- Timer stops and returns to `00:00`
- Stopwatch keeps the final elapsed result
- completed tasks remain visible
- the user may add more tasks or reset the To-do

## To-do Minimize / Close

The To-do panel can be minimized or closed from view without deleting its tasks.

When minimized:

- tasks remain stored
- a compact reopen control should be available
- the final reopen placement can be chosen based on what looks and works best

Possible reopen locations include:

- left-edge control
- burger menu

## To-do Reset

The To-do should have a separate reset action.

Reset terminates the current To-do session and returns the To-do to an empty state.

Exact confirmation behavior can be tested later.

## Visible Task Count

Start with approximately:

`8 visible task rows on desktop`

This is a visual limit, not a hard task limit.

After that, expose:

`More +`

`More +` should eventually open a proper expanded task manager.

The exact expanded layout is intentionally deferred.

## Default To-do State

On first use:

- empty To-do
- clear `Add +` option
- no fake starter tasks

## Header

The compact header should include:

### Left

- in-site OnScreenTimer mark/logo
- `OnScreenTimer` title

Clicking `OnScreenTimer` returns to the main Home experience.

The in-site logo and favicon are separate assets.

### Right

Preferred order:

- circular Sound / Mute button
- Language selector using the language name, e.g. `English`
- circular Theme button
- burger menu

The language selector does not need a globe icon.

The exact supported launch-language list is not yet finalized.

## Theme

Default first-load theme:

`Light`

The light theme should be comfortable and not overly bright.

Dark mode should be equally polished.

The user can switch themes with the circular theme button.

Theme preference should persist locally.

### Current task theme treatment

Inside the desktop To-do list:

- Dark theme → Current task row uses a light treatment
- Light theme → Current task row uses a dark treatment

The separate Current Task bar remains visually aligned with the active theme.

## Sound

Use a dedicated Sound / Mute control in the header.

Default product sound should be calm.

Timer completion should use a soothing beep/chime rather than an aggressive alarm.

Sound preference should persist locally.

## Persistence

Use local browser storage where practical.

The product should preserve useful state across refresh / return visits, including:

- tasks
- task order
- task states
- recorded task durations
- Current Task identity
- relevant Timer / Stopwatch restoration state
- Mode
- Style
- Size
- Theme
- Sound / Mute
- Language
- 12h / 24h Clock preference
- To-do minimized state where appropriate

No account or backend is required for this basic persistence.

If real low-end-device testing reveals a genuine issue, simplify based on evidence.

## Mobile

Mobile should preserve the same core functionality but be recalibrated for touch.

Do not squeeze the desktop layout into a phone.

Important mobile lessons:

- hide desktop-only keyboard helper text
- use touch-friendly controls
- do not depend on hover
- test multiple viewport widths
- decide the final mobile To-do presentation after using the desktop version in-hand

## Supporting Content

The main utility remains dominant.

Supporting content may appear below the product.

Important supporting areas:

- How It Works
- FAQ
- About
- Contact
- Privacy Policy
- Terms & Conditions
- 404
- error page where applicable

### How It Works

A simple main flow may explain:

1. Set mode
2. Set timer or start stopwatch
3. Set size
4. Set style

Also explain:

- how to use Clock
- how to use the To-do / Current Task system

## SEO Direction

The site should be technically SEO-aware without becoming content-first.

Later work may include:

- useful page title and description
- one clear H1
- clean URLs
- sitemap
- robots configuration
- structured data / schema where appropriate
- Open Graph image
- search-intent FAQ
- Search Console
- Bing Webmaster Tools

Search-specific behavior such as opening a preconfigured timer from a query or URL may be evaluated later.

## Non-Goals for V1

- No accounts
- No backend unless genuinely necessary
- No social features
- No collaboration
- No projects / workspaces
- No nested subtasks
- No tags
- No priorities system
- No calendars
- No due dates
- No databases
- No kanban
- No bloated productivity-suite behavior
- No generic SaaS landing page
- No unnecessary paid API or recurring external service

## Reference-Site Philosophy

Reference websites are research sources only.

We may study:

- functionality they do well
- friction or weaknesses
- useful interaction patterns
- mobile behavior
- keyboard controls
- fullscreen behavior
- navigation organization
- visual hierarchy

Do not copy:

- branding
- text
- exact layout
- exact UI
- design identity

Reference sites can influence thinking, not become templates.

## Preset Data Protocol

- **Rule 1: Data Location:** All sequence presets must be defined as hardcoded arrays in `src/lib/presets.ts`.
- **Rule 2: Type Definition:** Sequence items use the `SequenceItem` interface (`label`, `duration`, `themeColor`).
- **Rule 3: i18n Requirement:** English string literals must NEVER be hardcoded in `presets.ts` for the `label`. You MUST add new translation keys to `src/i18n/ui.ts` for all 8 supported locales (`en`, `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt-br`) and use the `tMsg` mapping pattern.
- **Rule 4: Theme Colors:** Allowed sequence `themeColor` values are `'blue'`, `'yellow'`, `'green'`, and `'red'`.

## Intentionally Deferred Decisions

These are not missing by accident.

They should be decided after the first working product can be used and tested:

- exact `More +` expanded task-manager layout
- exact mobile To-do presentation
- Clear Completed / Clear All behavior
- exact mobile contextual-task interaction
- final favicon and in-site logo
- exact supported language list
- small Stop / task-completion refinements
- optional additional sound / notification behavior
- minor queue edge cases discovered during implementation
- visual polish that cannot be judged before the product exists

Do not invent permanent answers for these without a product decision.

## Current Product Defaults

```text
Mode:      Timer
Style:     Modern
Size:      Mid
Theme:     Light
To-do:     Empty + Add
```

## Current Build Principle

The product definition is now complete enough to begin implementation.

When an undecided detail is cosmetic or easy to change later, prefer building and testing the real product instead of blocking development with speculation.

When an undecided detail changes core behavior, data, architecture, privacy, cost, or user expectations, surface it as a product decision before implementing it.

## Weeklist Storage and Linkage Model

### Storage Schema
Weeklist data is stored in `localStorage` under the isolated key `ost_weeklist`.
```typescript
interface WeeklistTask {
  id: string;              // Stable Weeklist-owned ID
  text: string;            // Task text
  timerTaskId: string | null; // ID of linked Timer task, or null if unsent/unlinked
}

interface WeeklistData {
  currentWeek: WeeklistTask[][]; // 7 arrays, one for each day
  nextWeek: WeeklistTask[][];    // 7 arrays, one for each day
}
```

### Derived Status & Linkage Rules
- **No valid linked Timer task (`null` or missing in Timer state)**: Weeklist renders status as **RED** (Unsent/Pending).
- **Linked Timer task is pending**: Weeklist renders status as **RED**.
- **Linked Timer task is current**: Weeklist renders status as **YELLOW**.
- **Linked Timer task is completed**: Weeklist renders status as **GREEN**.
- **Idempotency**: Clicking send (`▶`) on a task already linked to a valid Timer task is a no-op (does not duplicate).
- **Redo (`↺`)**: When clicked on a completed linked task, the linked Timer task is reverted to pending status.
- **Unlinking**: If a Timer task is deleted directly from the main Timer UI, the Weeklist detects it is missing during render, clears the `timerTaskId` linkage, and reverts the task to **RED** (Unsent).
