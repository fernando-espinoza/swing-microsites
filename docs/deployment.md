# Swing microsite delivery

## Environments and triggers

- Code: `fernando-espinoza/swing-microsites` (public GitHub repository).
- Hosting: [ownward / swing-microsites](https://vercel.com/ownward/swing-microsites).
- Vercel project ID: `prj_OFCPCvkEYuzaTx6euiLg6iReNAHk`; team ID: `team_HDbZ1HzOVHGr2pPOMd9mNWc8`.
- Production branch: `main`. The existing production hostname is `swing-microsites.vercel.app`; no wearswing.com domain integration has been performed.
- GitHub integration is connected. PR comments, commit statuses and deployment-status events are enabled.

Vercel's native Git integration is the deployment trigger. Feature-branch pushes generate Preview deployments and attach them to the PR; opening a PR gives Marketing its review link. Further pushes refresh that PR's preview. Merging the approved PR into main triggers Production automatically. Do not configure a duplicate Actions deploy or run `vercel --prod` for previews.

The `.github/workflows/verify.yml` workflow runs the full verification suite for same-repository PRs. It has read-only GitHub permissions, restores only pinned approved media, and runs Chromium, Firefox, WebKit and source/output audits. Fork PRs do not receive the private media key and require an internal reviewed branch before the campaign can be previewed.

## Build contract

`vercel.json` uses `npm ci`, `npm run build:deployment`, and the generated `publish/` directory. `media:restore` obtains the immutable media commit declared in `deployment/media-lock.json`; build-time hashes validate each original and derivative. `scripts/deployment/build.mjs` builds and audits every entry in `deployment/campaigns.json`, then packages only those routes without local ownership markers. `publish/` is generated, ignored, and never a source directory.

New campaigns must have separate content/assets and a registry entry with unique `/campaign/<slug>/` route, source directory and build/audit modules. Those modules must export the same build/audit interfaces, produce their campaign in `dist`, and audit that campaign. Do not simply change Sunday's hardcoded route or overwrite its content when adding another campaign. Verify all registered campaigns before publishing: each Vercel deployment replaces the entire project output.

The output contains campaign routes only. It is not a parent-site deployment. A future wearswing.com path mount requires a separate parent-owner routing decision. Headers apply to `/campaign/*`; no catch-all rewrite to the campaign is used. Search indexing stays disabled until Marketing explicitly changes that requirement.

## Private media bootstrap

The source store must be private because originals and licensing-sensitive source material do not belong in this public repository. The user must choose/authorize the store before bootstrap. For the proposed private GitHub media repository:

1. Store approved originals and derivatives under `assets-source/<campaign>/`, excluding prepared caches and unrelated files.
2. Commit and push the media, and record the full immutable commit SHA in `deployment/media-lock.json` with the repository owner/name.
3. Create a repository-scoped **read-only** SSH deploy key. Store the private half as `SOURCE_MEDIA_SSH_KEY` in GitHub Actions and in the Vercel project for Preview and Production only; do not put it in Git, logs, PR text, or this document.
4. `deployment/github-known-hosts` pins GitHub's public SSH host keys. Review official GitHub key changes rather than disabling host checking.
5. Restore in a clean checkout, run all checks, then verify the Vercel preview for the exact PR head. A missing key/lock or a changed asset hash fails the build.

Do not use a personal GitHub token with broad repository write access as the build credential. Keep Vercel fork protection enabled. Only trusted internal branches should have access to private build-time media. Any collaborator who can modify a secret-bearing build must be treated as trusted with its source material.

## Review and production approval

Use `$create-microsite` for requirements → plan → implementation → PR → preview → feedback → approved release. A copy of the skill is versioned in `skills/create-microsite`; the discoverable personal installation lives under the user's Codex skills directory.

Before returning a preview, inspect Vercel/GitHub for a successful deployment at the current PR head SHA. Use the actual returned deployment URL plus the campaign path. Confirm Marketing can access it without changing protection silently. Never return localhost or a guessed/stale URL as staging.

Do not merge, enable auto-merge or promote a deployment until the user explicitly approves production for the verified head. Any subsequent change requires a new preview and approval. Merge with `gh pr merge --squash --match-head-commit <approved-sha>` after required checks succeed. Verify the resulting Vercel Production deployment and campaign URL; a successful merge is not proof of a successful release.

Main should require the `Build and verify microsites` check and the Vercel check, with up-to-date PR branches and no force pushes. Direct pushes to main also trigger Vercel production, so use branch protection and do not push main during setup. Do not impose an impossible second-person review requirement on a sole repository owner; the skill records the explicit release decision while GitHub enforces checks/PR merging.

## Rollback

Retain the previous successful production deployment and commit. If a release fails, use Vercel's verified previous project deployment only after checking that it preserves all currently required campaign routes; reverting a whole project can otherwise remove a newer unrelated campaign. Prefer a reviewed revert PR for a persistent source correction. Never roll back the parent website.

## Initial setup status

The skill is installed and validated; deployment files are prepared and static packaging passes. The private media store/key, branch protection, fresh-checkout CI, and first successful PR preview must be verified before this workflow can be described as live. Production deployment is deliberately not part of bootstrap. Automatic approval review rejected enabling branch protection before the required CI workflow exists remotely; main protection is unchanged and requires approval after CI is available.
