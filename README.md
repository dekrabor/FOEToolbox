# FOE Toolbox (React)

This repo contains the React + Vite rewrite of the FOE toolbox.

## Getting started

The repo includes two install helpers so you can choose whether to keep or clear the proxy variables baked into this environment:

* `npm run deps` will try your active proxy settings first, then automatically retry with all proxy variables removed to rule out an intercept issue.
* `npm run deps:proxy` keeps `http_proxy/https_proxy` (recommended when you have authenticated egress).
* `npm run deps:direct` strips all proxy variables (recommended when the proxy returns 403/ENETUNREACH).

Typical flow:

1. Install dependencies
   ```bash
   npm run deps
   ```
   If you see `403 Forbidden` from the registry, rerun with explicit proxy control:
   ```bash
   npm run deps:proxy   # keep proxy if your org requires it
   npm run deps:direct  # bypass proxy if it's blocking the registry
   ```
   Check the freshest log in `~/.npm/_logs` for the upstream error text (e.g., auth-required 407 vs. registry 403).
2. Start the dev server:
   ```bash
   npm run dev
   ```
