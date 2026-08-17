# Theme and motion specification

## Core palette tokens

```css
--lapis-500: #163b5c;
--turquoise-500: #0e7373;
--saffron-500: #d7a23a;
```

## Light theme

```css
:root {
    color-scheme: light;

    --background: #f7fafc;
    --foreground: #172b3a;
    --surface: #ffffff;
    --surface-muted: #edf3f6;
    --primary: #163b5c;
    --primary-foreground: #ffffff;
    --secondary: #0e7373;
    --secondary-foreground: #ffffff;
    --accent: #d7a23a;
    --accent-foreground: #163b5c;
    --muted-foreground: #5b6b78;
    --border: #d9e4e9;
    --focus: #0e7373;
}
```

## Dark theme

```css
.dark {
    color-scheme: dark;

    --background: #071722;
    --foreground: #f2f7f9;
    --surface: #0d2536;
    --surface-muted: #123247;
    --primary: #75a6c7;
    --primary-foreground: #071722;
    --secondary: #2aa3a0;
    --secondary-foreground: #061b1b;
    --accent: #e2b44b;
    --accent-foreground: #102a3d;
    --muted-foreground: #afc0ca;
    --border: #274559;
    --focus: #52c2bd;
}
```

## Theme behavior

- Support `system`, `light` and `dark`.
- Follow system preference on the first visit.
- Persist explicit user choice.
- Apply `.dark` to `<html>`.
- Avoid theme flash.
- Set `color-scheme`.
- Theme state must have one centralized owner.
- If the project already has an appearance hook, reuse it.
- Otherwise create one when implementation begins.
- Components must not read local storage directly.

## Animation-on-scroll

- Create shared `Reveal` and optional `StaggerGroup` components.
- Reveal once.
- Opacity from 0 to 1.
- Vertical movement around 20px.
- Duration 0.45–0.65 seconds.
- Easing similar to `[0.22, 1, 0.36, 1]`.
- Stagger 0.06–0.10 seconds.
- Trigger around 15–20% visibility.
- Respect reduced motion.
- Do not animate every sentence.
- Do not replay large effects repeatedly.
- Do not use scroll hijacking.
- Do not hide essential content until JavaScript executes.

## Animated buttons

- Gold CTA receives subtle hover elevation and press scale around 0.98.
- Turquoise secondary action may animate an arrow 3–4px.
- Interaction duration should generally be 120–220ms.
- No continuous pulsing.
- Loading buttons preserve their width and prevent duplicate submission.

## Animated icons

- Use Lucide as the only icon family.
- Standard size: 18–20px in controls and 20–24px in navigation/features.
- Animate wrappers with Motion.
- Chevron may rotate.
- Arrow may translate 3–4px.
- Sun/Moon icons may cross-fade and rotate.
- Decorative icons use `aria-hidden`.
- Icon-only buttons require accessible names.
- Do not animate all icons continuously.

## Performance targets

- LCP ≤ 2.5 seconds
- CLS ≤ 0.1
- INP ≤ 200ms
- Lazy-load below-the-fold media.
- Use responsive AVIF/WebP images.
- Set explicit image dimensions.
- Avoid multiple heavy animation libraries in the initial viewport.
- Test using mobile/throttled conditions.
