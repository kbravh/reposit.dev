### Lists feature guidelines

- Ownership: Every record in `list` is scoped to a `userId`. All actions must verify `userId` ownership before mutating or reading sensitive data.
- Matching semantics:
  - includeMatch: `any` means at least one included tag must be present on a repository; `all` means every included tag must be present.
  - excludeMatch: `any` means any excluded tag removes a repository; `all` means only repositories that contain all excluded tags are removed.
  - Explicit repository rules: `list_repository_exclude` overrides everything; `list_repository_include` includes regardless of tag rules (unless explicitly excluded).
- Performance: Compute list membership server-side by fetching all user repositories and their tag IDs in a single join, then filtering in memory. For large datasets, consider pushing matching to SQL with EXISTS/COUNT HAVING patterns.
- Accessibility: Use semantic form controls (`label`, `fieldset`, `legend`) and ensure keyboard users can operate all interactions.
- Type safety: Use zod validators mirroring the action inputs. Prefer enums for match modes.
- DX: Keep CRUD coarse-grained. `updateList` replaces mapping sets when arrays are provided.
- Testing: Core matching logic is covered in `src/utils/__tests__/lists.test.ts`.