<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project CSS & Styling Guidelines

1. **NO INLINE STYLES**: Never use `style={{ ... }}` attributes inside any `.tsx` or `.ts` React components.
2. **NO TAILWIND CSS**: Do not use Tailwind CSS utility classes or imports.
3. **GLOBAL CSS ONLY**: All styles, component classes, layout rules, responsive media queries, and design tokens MUST be written inside `frontend/app/globals.css`.
4. **PURE CSS CLASSES**: Components must only use `className="..."` referencing semantic, BEM-style CSS classes defined in `frontend/app/globals.css`.
