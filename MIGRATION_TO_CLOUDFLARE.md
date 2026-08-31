# Cloudflare migration copy

This is the website source without the original Codex Sites project binding,
build output, dependency folder, or Git history. It is ready to place in a new
GitHub repository.

## Before publishing

1. Install Node.js 22 or newer.
2. Run `npm ci`.
3. Run `npm run build` to confirm the site builds.
4. In Cloudflare, create a Workers project connected to the GitHub repository.
   Use the build command `npm run build`. Configure the deployment command in
   Cloudflare according to its current Workers build flow.

This site has no database or file-storage binding and contains no environment
variables or deployment credentials. The `app/chatgpt-auth.ts` helper is kept
for reference but is not used by the public homepage.
