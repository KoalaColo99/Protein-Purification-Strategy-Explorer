# Protein Purification Strategy Explorer

Protein Purification Strategy Explorer is a browser-based CHEM214 learning environment for designing, predicting, running, and evaluating protein-purification workflows. Students use experimentally relevant protein properties to explain binding, precipitation, elution, resolution, purity, recovery, and biological activity.

The application is inspired by the strategy-centered learning approach of Andrew Booth’s Protein Purification simulation. This implementation is an independent modern application; no source code or assets from that simulation are included.

## Educational goals

Students should be able to:

- connect molecular mass, pI, solubility, and activity with experimental evidence;
- commit a prediction before running a major operation;
- distinguish target protein mass from active target protein;
- evaluate purity, recovery, activity, cost, time, and compatibility together;
- interpret incomplete separation and unsuccessful choices scientifically;
- develop multiple defensible purification strategies rather than discover one fixed sequence.

## Current feature status

Functional Phase 1 models and workflows:

- deterministic CHEM214 bacterial-lysate scenario with eight proteins;
- Guided Explorer and Purification Challenge interfaces;
- ammonium sulfate fractionation;
- anion and cation ion-exchange chromatography;
- size-exclusion chromatography;
- enzyme activity assays;
- first-class fraction selection and pooling;
- composition-derived 1D SDS-PAGE;
- purification table, strategy dashboard, notebook observations, undo, restart, and JSON export.

Registered but intentionally marked as planned: clarification, heat treatment, dialysis/desalting, hydrophobic-interaction chromatography, affinity chromatography, and 2D PAGE.

## Run locally

Requirements: Node.js 20.19 or newer and pnpm 11.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The development server uses the same project-relative base path as GitHub Pages.

To build and validate the deployable site:

```sh
pnpm test
pnpm validate:pages
pnpm preview
```

## Architecture

- `index.html` and `src/main.tsx` form the static browser entry point.
- `app/data.ts` is the single registry for intrinsic protein and method metadata.
- `app/science.ts` owns sample and fraction structures, deterministic separation models, mass accounting, pooling, and purification metrics.
- `app/Explorer.tsx` coordinates application state, prediction history, workflow transitions, notebook export, and accessible views.
- `app/globals.css` supplies the responsive scientific workspace.
- `scripts/validate-pages.mjs` validates generated paths and screens the deployable output for host-only references or credential patterns.
- `tests/static-site.test.mjs` checks the static entry point and architectural boundaries.

Protein definitions are independent of quantities in a sample. A sample records composition, active target mass, conditions, and lineage. Each generated fraction carries its own composition, activity, absorbance estimate, and volume. Pooling sums only selected fractions. Modeled handling loss is applied explicitly during fraction generation; it is not hidden in a view component.

## GitHub Pages deployment

The Vite base is fixed to:

`/protein-purification-strategy-explorer/`

The workflow in `.github/workflows/deploy-pages.yml` installs dependencies, runs tests, validates the static artifact, and deploys `dist` through GitHub Pages. In the repository’s **Settings → Pages**, set **Source** to **GitHub Actions**. Every push to `main` then publishes the validated site.

Expected project URL:

`https://koalacolo99.github.io/protein-purification-strategy-explorer/`

## Scientific-model limitations

These models are transparent educational approximations, not exact physical chemistry or substitutes for experimental optimization.

- Ion exchange estimates binding and elution from the sign and magnitude of `pH − pI`; it does not calculate protein surface electrostatics.
- Size exclusion maps logarithmic molecular mass into a fraction range and broadens peaks with sample load; molecular shape and resin-specific calibration are simplified.
- Ammonium sulfate behavior uses overlapping precipitation intervals rather than a full solubility thermodynamic model.
- Gaussian peak distributions preserve internally coherent mass accounting but do not simulate fluid dynamics, dispersion, or detector electronics.
- SDS-PAGE uses molecular mass and quantity to estimate migration and band intensity; staining response and gel artifacts are simplified.

Identical settings produce deterministic results. Outputs should be interpreted as reasoning evidence rather than exact predictions of a laboratory protocol.

## Attribution, third-party software, and licensing

The interface and scientific-model source in this repository were created for this project. It uses React, React DOM, Vite, and the Vite React plugin as development/runtime dependencies; those packages are distributed under permissive MIT licenses. The project uses no remote fonts, stock images, third-party datasets, or copied simulation assets.

No project license has been added yet. **MIT is the recommended license** because it is compatible with the identified dependencies and supports broad educational reuse. Before adding it, the repository owner should confirm that they have authority to license the project-specific source and that the project’s reference to Andrew Booth’s simulation is descriptive inspiration only.
