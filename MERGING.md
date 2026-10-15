# Push and merge guide

Claude can push your branch. Merging is done by you on GitHub.

## 1. Push your branch (Claude does this, or run it yourself)

```
git push -u origin feature/<flow>-<name>
```

Push after every change you approve, so work never lives only in a Claude session.

## 2. Open a pull request

1. Open https://github.com/divisht08/survey-insights-prototype
2. Click the yellow "Compare & pull request" banner (or Pull requests > New pull request).
3. Base: `main`. Compare: your branch.
4. Fill in the template: which flow, which files, shared files touched.
5. Click "Create pull request".

## 3. Review

- Ask the other person to review, especially if you touched a shared file (see CONTEXT.md).
- Check "Files changed". It should only contain your flow's files.

## 4. Merge

1. Click "Merge pull request" (use "Squash and merge" to keep history tidy), then "Confirm".
2. Click "Delete branch".
3. Wait about a minute. The Actions tab shows "Deploy to GitHub Pages". Green tick means it is live.
4. Open https://divisht08.github.io/survey-insights-prototype/ and check it. Hard refresh if you see the old version.

## 5. If GitHub says "This branch has conflicts"

1. In Claude: `git pull --rebase origin main`.
2. Give Claude both sides and say: "keep both sides' changes; do not drop either."
3. Open the page locally or in the preview, check it, then `git push --force-with-lease`.

## 6. If the live page breaks

Open the merged PR and click "Revert". Merge the revert PR. The live page goes back in about a minute.
