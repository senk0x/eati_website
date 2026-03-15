# Push Eati Landing to a New GitHub Repository

Your changes are committed locally. Follow these steps to create a new GitHub repo and push.

## 1. Create the repository on GitHub

1. Open **https://github.com/new**
2. **Repository name:** e.g. `eati-landing` (or any name you prefer)
3. **Description (optional):** e.g. "Eati – AI Calorie Tracker landing site"
4. Choose **Public**
5. **Do not** add a README, .gitignore, or license (this project already has code)
6. Click **Create repository**

## 2. Add the remote and push

In your terminal, from the project folder run (replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and repo name):

```bash
cd /Users/senko/business/apps/eati/landing

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

**Example** (if your username is `senko` and repo is `eati-landing`):

```bash
git remote add origin https://github.com/senko/eati-landing.git
git push -u origin main
```

If GitHub shows you a URL after creating the repo, you can use that instead:

```bash
git remote add origin <paste the URL here>
git push -u origin main
```

## 3. Optional: use SSH

If you use SSH keys with GitHub:

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

After pushing, you can delete this file or keep it for reference.
