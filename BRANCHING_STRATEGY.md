# Git Branching Strategy - Stocks-Search-101

## Overview
This project uses a **Git Flow-inspired branching model** to enable independent, parallel development while maintaining code stability.

## Branch Structure

### 1. **Main Branch** (`main`)
- **Purpose**: Production-ready code only
- **Stability**: Always stable and deployable
- **Protection Rules**: 
  - Require pull request reviews before merge
  - Require status checks to pass
  - Dismiss stale PR approvals
- **Merge From**: `dev` branch via pull request
- **Example**: `https://github.com/JacksonFan111/Stocks-Search-101/tree/main`

### 2. **Development Branch** (`dev`)
- **Purpose**: Integration branch for all features in current development cycle
- **Stability**: Stable but may contain pre-release features
- **Merge From**: Individual `feature/*` branches via pull request
- **Merge To**: `main` branch for releases
- **CI/CD**: Automated tests run on all PRs
- **Example**: `https://github.com/JacksonFan111/Stocks-Search-101/tree/dev`

### 3. **Feature Branches** (`feature/*`)
- **Purpose**: Isolated development for individual features
- **Naming Convention**: `feature/{feature-name}`
- **Branch From**: `dev` branch
- **Merge Back To**: `dev` via pull request
- **Deletion**: Delete after merge to keep repo clean
- **Examples**:
  - `feature/api-enhancements` - API and backend improvements
  - `feature/ui-improvements` - Frontend and UX enhancements
  - `feature/forensics-analysis` - Advanced analysis features

## Workflow

### Starting a New Feature
```bash
# 1. Update dev branch
git checkout dev
git pull origin dev

# 2. Create feature branch from dev
git checkout -b feature/my-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat: add my feature description"

# 4. Push feature branch
git push -u origin feature/my-feature-name
```

### Creating a Pull Request (PR)
1. Push your feature branch: `git push origin feature/my-feature-name`
2. Go to GitHub: https://github.com/JacksonFan111/Stocks-Search-101/pulls
3. Click "New Pull Request"
4. Select:
   - **Base**: `dev` (for features) or `main` (for releases)
   - **Compare**: `feature/my-feature-name`
5. Add title and description
6. Request review from team members
7. Ensure all CI/CD checks pass

### Merging Feature Back to Dev
```bash
# 1. Switch to dev
git checkout dev
git pull origin dev

# 2. Merge feature branch
git merge --no-ff feature/my-feature-name

# 3. Push dev
git push origin dev

# 4. Delete feature branch (locally and remote)
git branch -d feature/my-feature-name
git push origin --delete feature/my-feature-name
```

### Merging Dev to Main (Release)
```bash
# 1. Create release PR on GitHub (dev → main)
# 2. After review and merge, tag the release
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Current Branches

| Branch | Purpose | Status |
|--------|---------|--------|
| `main` | Production release | Active |
| `dev` | Development integration | Active |
| `feature/api-enhancements` | API & backend improvements | Ready for development |
| `feature/ui-improvements` | Frontend & UX enhancements | Ready for development |
| `feature/forensics-analysis` | Advanced analysis features | Ready for development |

## Commit Message Convention

Use conventional commits for clarity:

```
feat: add new feature
fix: bug fix description
docs: documentation updates
refactor: code refactoring
test: test additions
chore: dependency updates, configuration
```

Example:
```bash
git commit -m "feat: add real-time quote fetching with caching"
git commit -m "fix: resolve rate limiting issue in ETL pipeline"
git commit -m "docs: update API configuration guide"
```

## Protection Rules (Recommended for GitHub)

**For `main` branch:**
- ✅ Require pull request reviews (at least 1)
- ✅ Require status checks to pass before merge
- ✅ Require branches to be up to date before merge
- ✅ Include administrators in restrictions
- ✅ Dismiss stale pull request approvals

**For `dev` branch:**
- ✅ Require pull request reviews (at least 1)
- ✅ Require status checks to pass before merge
- ✅ Dismiss stale pull request approvals

## Development Independence

Each team member can:
1. Work on their own feature branch (`feature/their-feature`)
2. Commit and push independently without affecting others
3. Request reviews when ready
4. Merge to `dev` after approval
5. Rebase or merge depending on preference

**Benefits:**
- ✅ Zero conflicts during independent development
- ✅ Parallel feature development
- ✅ Easy rollback of individual features
- ✅ Clean git history with feature tracking
- ✅ Safe integration in `dev` before production release

## Example Multi-Developer Scenario

```
Developer 1 (Alice):
  feature/api-enhancements → dev → (PR) → Approved → Merged to dev

Developer 2 (Bob):
  feature/ui-improvements → dev → (PR) → Approved → Merged to dev

Developer 3 (Charlie):
  feature/forensics-analysis → dev → (PR) → Approved → Merged to dev

---

Once all features tested in dev:
  dev → main → (Release PR) → Tagged v1.0.0
```

All three developers work independently without conflicts!

## Troubleshooting

### Q: How do I sync my feature branch with latest dev?
```bash
git fetch origin
git rebase origin/dev
# or merge if you prefer
git merge origin/dev
```

### Q: How do I undo a commit?
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

### Q: What if I accidentally committed to main?
```bash
git reset --soft HEAD~1  # Undo commit
git checkout -b feature/my-feature
git commit -m "feat: proper commit message"
git checkout main
git reset --hard origin/main  # Reset main to remote
```

### Q: How do I see what changed in a feature?
```bash
git diff dev...feature/my-feature
# or on GitHub: Compare tab
```

## Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
