# Keyboard Shortcuts

This document catalogues all existing keyboard shortcuts in the Reposit application and outlines potential keyboard shortcuts that could enhance user productivity.

### General Navigation

Currently, the application relies on standard browser navigation patterns and does not implement custom global keyboard shortcuts.

## Suggested Keyboard Shortcuts (Future Work)

### Global Navigation

Implement common web application patterns for quick navigation:

- **Cmd/Ctrl + K** - Open command palette (most important addition)
- **G then D** - Go to Dashboard (Gmail-style navigation)
- **G then R** - Go to Repositories
- **G then T** - Go to Tags
- **G then L** - Go to Lists
- **G then S** - Go to Settings

### Command Palette Actions

When implementing the command palette (Cmd/Ctrl + K), include these quick actions:

- **"Add Repository"** - Open repository addition form
- **"Create Tag"** - Open tag creation form
- **"Search Repositories"** - Focus repository search
- **"Search Tags"** - Focus tag search
- **"Go to [Page]"** - Navigation shortcuts
- **"Edit [Tag Name]"** - Quick tag editing
- **"Delete [Tag Name]"** - Quick tag deletion

### Page-Specific Shortcuts

#### Repositories Page (`/repositories`)

- **Cmd/Ctrl + N** - Add new repository (focus the add repository form)
- **/** - Focus repository search field
- **Escape** - Clear search field or close add repository form

#### Tags Page (`/tags`)

- **Cmd/Ctrl + N** - Add new tag (focus the add tag form)
- **/** - Focus tag search field
- **Escape** - Clear search field or close add tag form

#### Dashboard Page (`/dashboard`)

- **R** - Refresh dashboard data
- **N** - Navigate to repositories page for adding new repo
- **T** - Navigate to tags page for creating new tag

### Modal and Form Shortcuts

#### Tag Modal (Enhancement to existing)

- **Cmd/Ctrl + Enter** - Submit form (in addition to Enter/Space)
- **Backspace** (when input is empty) - Remove last assigned tag

#### Add Repository Form

- **Cmd/Ctrl + Enter** - Submit repository form
- **Escape** - Cancel and close form

#### Add Tag Form

- **Cmd/Ctrl + Enter** - Submit tag form
- **Escape** - Cancel and close form

#### Edit/Delete Modals

- **Enter** - Confirm action (save/delete)
- **Escape** - Cancel and close modal

### List Navigation Shortcuts

When viewing lists of repositories or tags:

- **J/K** - Navigate down/up through items (Vim-style)
- **Enter** - Open/select current item
- **E** - Edit current item (where applicable)
- **D** - Delete current item (with confirmation)

### Search and Filtering

- **Cmd/Ctrl + F** - Focus main search field on current page
- **Cmd/Ctrl + Shift + F** - Global search across all content
- **Enter** - Navigate to first search result
- **Escape** - Clear search and return focus

## Implementation Priority

### Phase 1 (High Priority)

1. **Command Palette (Cmd/Ctrl + K)** - Single most important addition
2. **Focus search shortcuts (/)** - For repositories and tags pages
3. **Modal escape handling** - Consistent Escape key behavior
4. **Form submission shortcuts** - Cmd/Ctrl + Enter for forms

### Phase 2 (Medium Priority)

1. **Global navigation shortcuts** - G + letter combinations
2. **Add new item shortcuts** - Cmd/Ctrl + N on relevant pages
3. **Page refresh shortcuts** - R for dashboard refresh

### Phase 3 (Low Priority)

1. **List navigation** - J/K for item navigation
2. **Quick edit/delete** - E/D keys for item actions
3. **Advanced search** - Cmd/Ctrl + Shift + F global search

## Technical Implementation Notes

### Framework Considerations

- Using **React** with **@tanstack/react-router** for navigation
- **@headlessui/react** for modals and UI components
- Consider using `useHotkeys` or similar library for global shortcuts
- Implement keyboard shortcut context providers for different page areas

### Accessibility

- Ensure all keyboard shortcuts are announced to screen readers
- Provide visual indicators for available shortcuts (tooltip overlays)
- Allow shortcuts to be disabled for users who prefer mouse navigation
- Consider conflicts with browser shortcuts and assistive technology

### User Experience

- Add a help modal (triggered by **?**) showing all available shortcuts
- Display shortcut hints in tooltips and button labels where appropriate
- Allow customization of shortcuts in user settings
- Provide visual feedback when shortcuts are activated

## References

- Taking inspiration from **GitHub** (Cmd/Ctrl + K command palette, G + letter navigation)
- **Gmail-style navigation** patterns (G + letter combinations)
- **Vim-style navigation** (J/K for list navigation)
- **Common web patterns** for form submission and modal handling
