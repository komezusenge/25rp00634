# Figma Build Spec - CareFlow Live

Use this spec to build the matching Figma file required in Part 1.

## Page Structure

Create these Figma pages:

1. `00 Cover`
2. `01 Foundations`
3. `02 Components`
4. `03 Mobile Flow`
5. `04 Prototype Map`

## 01 Foundations (Design System)

Create style tokens matching implementation:

- Colors:
  - `paper #F8F4E9`
  - `sand-100 #F7F2E7`
  - `sand-200 #EAE1CF`
  - `sand-300 #D8CCB5`
  - `mint-100 #E8F8F3`
  - `mint-200 #C9EFE2`
  - `brand-600 #008077`
  - `brand-700 #025D57`
  - `ink-500 #5F6E6A`
  - `ink-700 #2B3F3C`
  - `ink-800 #1A2F2C`

- Typography:
  - Heading: Fraunces 600
  - Body/UI: Manrope 500/700
  - Recommended scale:
    - Display: 32/36
    - H1: 24/30
    - H2: 18/24
    - Body: 14/21
    - Caption: 12/16

- Radius:
  - `8, 12, 16, 24, 32`

- Spacing:
  - Base scale `4, 8, 12, 16, 24`

## 02 Components and Variants

All components must use Auto Layout.

Create components with variants:

1. `Button`
- Variants: `Primary`, `Ghost`, `Soft`
- States: `Default`, `Pressed`, `Disabled`

2. `Symptom Pill`
- Variants: `Selected`, `Unselected`

3. `Doctor Card`
- Variants: `Default`, `Selected`

4. `Toggle`
- Variants: `On`, `Off`

5. `Progress Segment`
- Variants: `Done`, `Pending`

6. `Status Badge`
- Variants: `Online`, `Offline`

## 03 Mobile Flow (390 x 844)

Design these 8 frames in order:

1. Symptom input
2. Doctor discovery
3. Booking
4. Confirmation/reminders
5. Arrival/check-in
6. Live waiting
7. Post-visit summary
8. Follow-up/medication reminder

Per-frame rules:

- Keep one primary action (Continue).
- Keep simple, concise copy.
- Keep high contrast and large tap targets.
- Use the same header and footer navigation shell for consistency.

## 04 Prototype Interactions

Use Smart Animate with 250-350ms transitions.

Required interactions:

- Tap symptom pill -> Selected state
- Select doctor card -> Selected variant + score highlight
- Continue -> Next frame with Smart Animate
- Back -> Previous frame
- Check-in button -> Checked-in visual state
- Toggle controls -> On/Off variants
- Queue value card -> At least two timed states to simulate live updates

## Auto Layout Expectations

- Root mobile frame: vertical Auto Layout
- Header, progress card, content card, footer all auto-layout children
- Components should resize with content where appropriate
- Use constraints for mobile responsiveness

## File Hygiene (Marks Criterion)

- Name layers and components clearly (`cmp/button/primary/default`)
- Keep assets grouped by page
- Use reusable styles (colors and text styles), not raw values everywhere
- Keep a clear component section separate from screen section

## Mapping To Code

The implementation mirrors this flow in:

- `src/App.jsx` for interactions and states
- `src/index.css` for tokens and motion

If desired, export SVG icons and replace simple text placeholders in code while keeping the same component contracts.
