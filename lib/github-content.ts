/**
 * GitHub Contents API helpers for persisting article JSON files.
 *
 * Used by admin API routes when running on Vercel (read-only filesystem).
 * Falls back to local fs when GITHUB_TOKEN / GITHUB_REPO are not set (local dev).
 *
 * Required env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with "Contents: Read & Write" on this repo
 *   GITHUB_REPO   — "owner/repo", e.g. "senk0x/eati_website"
 *   GITHUB_BRANCH — branch to commit to (default: "main")
 */

const API = 'https://api.github.com';

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'eati-admin/1.0',
  };
}

/** Returns true when GitHub credentials are configured (production mode). */
export function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

/** Get the current SHA of a file (required for updates; undefined for new files). */
async function getFileSha(
  token: string,
  repo: string,
  path: string,
  branch: string,
): Promise<string | undefined> {
  const res = await fetch(
    `${API}/repos/${repo}/contents/${path}?ref=${branch}`,
    { headers: headers(token) },
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub getFile failed: ${res.status} ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data.sha as string;
}

/** Create or update a file in the repo. */
export async function putFile(
  path: string,
  content: string,
  commitMessage: string,
): Promise<void> {
  const token = process.env.GITHUB_TOKEN!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH || 'main';

  const encoded = Buffer.from(content, 'utf-8').toString('base64');
  const sha = await getFileSha(token, repo, path, branch);

  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({
      message: commitMessage,
      content: encoded,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub putFile failed: ${res.status} ${JSON.stringify(err)}`);
  }
}

/** Delete a file from the repo. */
export async function deleteFile(
  path: string,
  commitMessage: string,
): Promise<void> {
  const token = process.env.GITHUB_TOKEN!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH || 'main';

  const sha = await getFileSha(token, repo, path, branch);
  if (!sha) return; // already gone

  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ message: commitMessage, sha, branch }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub deleteFile failed: ${res.status} ${JSON.stringify(err)}`);
  }
}
