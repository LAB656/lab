# Copilot Instructions: LAB de Periodismo Crítico

## Project Overview
**El Cronista Digital** is a Vite + React 18 news publishing platform with Supabase backend. It features article CRUD operations, user authentication, and role-based access control. Deployed under `/LAB/` base path.

## Architecture & Key Components

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Library**: lucide-react for icons
- **Fonts**: Playfair Display (serif), Inter (sans-serif)

### Code Organization
All UI components live in **[src/App.jsx](src/App.jsx)** as a monolithic structure:
- `Navbar`: Header with auth links
- `AuthModal`: Login modal (email/password via Supabase)
- `EditorView`: Article creation/editing form
- `ArticleDetail`: Full article display with author/date
- `FrontPage`: Grid layout with main story + side articles
- Supabase client initialized in **[lib/supabaseClient.js](lib/supabaseClient.js)**

## Critical Data Flows

### Article Lifecycle
1. **Fetch**: `fetchArticles()` pulls from Supabase `articles` table, ordered by `created_at DESC`
2. **Fallback**: If no Supabase or empty results → use `DEMO_ARTICLES` (hardcoded demo data with IDs starting with `demo-`)
3. **CRUD Operations**:
   - Create: `POST` via `supabase.from('articles').insert()`
   - Update: `PATCH` via `.update().eq('id', id)`
   - Delete: Uses RLS policies; fails silently with alert if user lacks permission

### Authentication Pattern
- Session populated by `supabase.auth.onAuthStateChange()` hook
- `session` state gates all edit features (`canEdit = !!session`)
- Unauthenticated actions redirect to AuthModal
- Demo articles bypass auth (locally managed)

### View State Management
Three-view system via `view` state: `'frontpage'` → `'article'` → `'editor'`
- No URL routing; view changes trigger `window.scrollTo(0, 0)`
- View transitions preserve `selectedArticle` state

## Critical Developer Workflows

### Local Development
```bash
npm run dev        # Vite dev server (auto-reload)
npm run build      # Production build → dist/
npm run preview    # Preview prod build locally
```

### Environment Setup
Create `.env` with:
```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
If missing, app falls back to DEMO_ARTICLES (read-only).

### Debugging
- Console errors from Supabase ops logged with `console.error()`
- RLS policy failures show: "No se pudo [action] (revisa RLS/policies)"
- Auth failures show: "No se pudo iniciar sesión. Revisa email/password"
- Check browser DevTools → Network for Supabase request details

## Project-Specific Conventions

### Naming & IDs
- Demo articles use `id: 'demo-N'`; real articles use numeric/UUID Supabase IDs
- Date format: `'YYYY-MM-DD'` string (ISO date)
- Categories: Fixed list (Política, Economía, Cultura, Deportes, Ciencia, Opinión, General)
- Spanish UI text throughout (no i18n)

### Form Data Structure
```javascript
{
  id: null | number,
  title: '',           // required
  subtitle: '',        // optional
  category: 'General', // from fixed list
  author: '',          // required
  content: '',         // required
  date: 'YYYY-MM-DD'   // set on save
}
```

### RLS/Security
- Supabase RLS policies **must** allow:
  - Anonymous SELECT on published articles
  - Authenticated users UPDATE/DELETE own articles
- Edit/delete buttons hidden if `!session`
- Delete action confirms with `window.confirm()`

### Styling Patterns
- Utility-first Tailwind with custom serif font
- Border colors: `border-stone-*`, `border-black` for emphasis
- Red accents: `text-red-700`, `hover:bg-red-100`, category badges use `bg-red-700`
- Shadow: `shadow-sm`, `shadow-xl` (minimal use)
- Responsive: `hidden md:inline`, `lg:col-span-*` for layout shifts

## Common Editing Tasks

### Adding a New Category
1. **Update EditorView select options** ([src/App.jsx](src/App.jsx#L480)): Add `<option>NewCategory</option>`
2. **Update Navbar nav links** ([src/App.jsx](src/App.jsx#L331)): Add to category map
3. **Test with demo articles** to ensure styling works

### Fixing Article Display Issues
- Check `selectedArticle` structure in DevTools; ensure `date`, `author`, `content` fields exist
- Paragraph rendering uses `.split('\n')` → test multi-line content
- First-letter styling: `first-letter:float-left` applies only to first paragraph

### Adding/Removing Fields
- Update `formData` state shape in `handleCreateNew()` and `handleEditArticle()`
- Update Supabase table schema & RLS policies
- Update insert/update payloads in `handleSave()`
- Update form inputs in `EditorView`

## Dependencies & Integration Points
- **@supabase/supabase-js**: Direct client initialization (no middleware/API layer)
- **lucide-react**: Icon components (Search, Menu, Share2, Printer, PenTool, Trash2, etc.)
- **Vite**: Base path `/LAB/` hardcoded in config; affects asset URLs
- **PostCSS/Autoprefixer**: Auto-applied by Tailwind

## Testing & Validation
- No Jest/Vitest suite; manual testing via dev server
- Test auth by signing in with Supabase test user
- Test CRUD on demo articles to verify UI flow before Supabase integration
- Check RLS policies if create/update/delete fails silently

---
**Last Updated**: Feb 2026 | **Key Files**: [src/App.jsx](src/App.jsx), [vite.config.js](vite.config.js), [tailwind.config.js](tailwind.config.js)
