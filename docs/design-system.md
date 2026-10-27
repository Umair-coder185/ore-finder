# OreFinder.io — Premium Hybrid Design System (Phase 01)

## 1. Visual Philosophy

OreFinder.io combines two coordinated visual environments:

1. **Environment A — Premium Light Editorial Website:** Warm alabaster background (`#F8F7F3`), crisp white surfaces (`#FFFFFF`), deep forest slate typography (`#202722`), and mineral emerald (`#326B55`) and subtle gold (`#D5B77D`) accents. Used for navigation, editorial hero, geological reference matrices, blog articles, supporting pages, and footer.
2. **Environment B — Premium Dark Tool Workspace:** Deep obsidian-pine background (`#111916`), elevated mineral panels (`#1B2621` and `#25332C`), high-legibility off-white text (`#F4F7F4`), and luminous mint-emerald action accents (`#69C598`). Used exclusively for the interactive Ore Finder workspace and telemetry viewport.

## 2. Color Tokens (`src/styles/tokens.css`)

### Light Editorial Environment
| Token | Value | Role |
|---|---|---|
| `--color-bg-light` | `#F8F7F3` | Primary page background |
| `--color-surface-light` | `#FFFFFF` | Cards, tables, header/footer surfaces |
| `--color-text-primary` | `#202722` | Headings and body text |
| `--color-text-secondary` | `#65716B` | Supporting copy and metadata |
| `--color-accent-emerald` | `#326B55` | Primary brand actions and active states |
| `--color-accent-emerald-subtle` | `#E9F1EC` | Subtle badges and callout backgrounds |
| `--color-accent-gold` | `#D5B77D` | Secondary warm highlight |
| `--color-border-light` | `#E4E8E2` | Hairline structural borders |

### Dark Tool Workspace
| Token | Value | Role |
|---|---|---|
| `--color-tool-bg` | `#111916` | Workspace shell and input background |
| `--color-tool-surface` | `#1B2621` | Elevated tool panels |
| `--color-tool-panel` | `#25332C` | Active controls and header strips |
| `--color-tool-text-primary` | `#F4F7F4` | Primary workspace labels and readouts |
| `--color-tool-text-secondary` | `#A8B8AF` | Secondary telemetry and hints |
| `--color-tool-accent` | `#69C598` | Interactive focus, primary CTA, and active states |
| `--color-tool-border` | `#34443B` | Panel and control borders |

## 3. Typography & Spacing

- **Headings (`--font-heading`):** `Manrope` (600, 700, 800), tight tracking (`-0.025em`) for authoritative editorial and UI headers.
- **Body & Interface (`--font-sans`):** `Inter` (400, 500, 600, 700) for clean readability across long-form guides and dense form controls.
- **Coordinates & Telemetry (`--font-mono`):** `JetBrains Mono` for chunk indices, MCA region filenames, seed strings, and Y-level ranges.
- **Spacing System:** 4px/8px spatial grid with consistent container widths (`max-w-7xl` standard, `max-w-4xl` editorial/legal reading).

