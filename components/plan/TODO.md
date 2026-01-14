## Plan Workspace TODOs

- Plan data: sync with `PlanSection` API once `/api/plan/sections` stabilizes.
- Mentor signals: use mentor note + review events from `planSections` service.
- Price inputs: connect to price history feed (`/api/registry/price-intelligence`) and eventually the price protection signals.
- Reference checklist: pull canonical structure from `lib/plan/planSectionMap` or a dedicated schema file.
- Registry readiness: mirror `RegistryPage` readiness state + MyRegistry activation status.
- UX copy: centralize repeated copy in `components/plan/copy.ts` or similar once approved.
