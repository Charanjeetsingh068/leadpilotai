# Workspace Styling & Architecture Rules

1. **NO INLINE STYLES**: `style={{ ... }}` attributes are strictly prohibited in all `.tsx` and `.ts` files.
2. **NO TAILWIND CSS**: Tailwind CSS utility classes are strictly prohibited.
3. **ONLY GLOBAL CSS**: All CSS styling rules, theme custom properties, layout flex/grid definitions, and media queries MUST be placed inside `frontend/app/globals.css`.
4. **SEMANTIC CLASS NAMES**: Every React component must use clean, semantic `className="..."` definitions pointing to class selectors in `frontend/app/globals.css`.
