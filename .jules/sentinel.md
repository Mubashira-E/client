## 2026-01-16 - [Derived State Anti-Pattern]
**Learning:** `RoleForm` and `UserForm` used `useEffect` to synchronize state with props, leading to double renders and potential user input overwrites during background updates.
**Action:** Use `key` prop on the component instance to reset state when the identity changes, instead of `useEffect`.
