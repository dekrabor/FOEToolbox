# FOE Toolbox (React)

This repo contains the React + Vite rewrite of the FOE toolbox.

## Getting started

1. Clear any forced proxy environment variables so `npm` can talk directly to the public registry:
   ```bash
   unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY npm_config_http_proxy npm_config_https_proxy YARN_HTTP_PROXY YARN_HTTPS_PROXY
   ```
2. Install dependencies using the helper script that applies the same proxy-safe environment:
   ```bash
   npm run deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

If your network still blocks the registry, check the latest log in `~/.npm/_logs` for the exact upstream error.
