## Packages
@tiptap/react | Rich text editor for blog content
@tiptap/starter-kit | Essential extensions for tiptap
@tiptap/extension-link | Link support for tiptap
@tiptap/extension-image | Image support for tiptap
dompurify | HTML sanitization for rendering blog content securely
@types/dompurify | Types for dompurify
jwt-decode | For decoding and validating admin auth token

## Notes
- Tailwind Config - extend fontFamily: { sans: ["var(--font-sans)"], display: ["var(--font-display)"] }
- Authentication uses a JWT token stored in localStorage ('admin_token') and passed in the Authorization header.
- Uses Framer Motion for premium, smooth micro-interactions.
