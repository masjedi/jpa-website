# Cursor workflow

## Phase 1: Public UX/UI

1. Theme tokens and appearance system
2. Typography and spacing
3. Buttons and animated icons
4. Reveal/Stagger primitives
5. PublicLayout
6. Navbar
7. Mobile navigation
8. Theme toggle
9. Language selector
10. Footer
11. Home
12. Tours
13. Tour Details
14. Destinations
15. Destination Details
16. Services
17. Booking Request
18. Articles
19. Article Details
20. Gallery
21. About
22. Donation
23. Contact
24. FAQ/Travel Information
25. Legal pages
26. Full quality review

## Phase 2: Dashboard UX/UI

Start only after public UX/UI approval.

## Phase 3: Backend

Start only after public and dashboard UX/UI approval.

## Skill order

1. `/tourism-design-system`
2. `/public-site-shell`
3. `/ui-quality-review`
4. `/public-page-builder`
5. `/ui-quality-review`
6. `/react-bits-motion` only when explicitly needed

## Validation commands

```powershell
npm run build
npx tsc --noEmit
php artisan test
vendor\bin\pint --test
```

Also run project lint and formatting scripts when they exist.

## Current repo notes

These notes describe the repository at the time the Cursor rules and docs were created. They do not authorize implementation work.

- Boost skill `inertia-react-development` still documents `resources/js/Pages`. This product uses `resources/js/pages/public/`. The always-on project contract wins.
- Laravel backend tests currently use PHPUnit. Pest is the target when backend work begins; do not install it during public UX/UI.
- There is no project `tsconfig.json` yet. Run `npx tsc --noEmit` after TypeScript is configured.
- `package.json` currently exposes `build` and `dev` only. Run lint and formatting scripts when they exist.
- shadcn/ui is part of the intended stack and is not installed yet. Install it only when implementing the design system.

## Final verification

After creating or updating Cursor rules, skills or project docs:

1. Confirm the expected files exist.
2. Confirm every `.mdc` file has valid YAML frontmatter.
3. Confirm every skill has valid YAML frontmatter.
4. Confirm every skill `name` matches its parent directory.
5. Confirm no application source files were modified unless explicitly authorized.
6. Reload the Cursor window before starting implementation.
