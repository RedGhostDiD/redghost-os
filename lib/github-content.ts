import { Octokit } from "@octokit/rest";
import type { Project } from "@/lib/projects";
import type { SiteConfig } from "@/lib/site-config";
import type { WallPost } from "@/lib/wall";
import { isTunelPhoto, type TunelPhoto } from "@/lib/tunel";

const PROJECTS_PATH = "data/projects.json";
const SITE_CONFIG_PATH = "data/site-config.json";
const WALL_PATH = "data/wall.json";

function config() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_COMMIT_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error(
      "Missing GITHUB_REPO_OWNER, GITHUB_REPO_NAME or GITHUB_COMMIT_TOKEN env vars"
    );
  }
  return { owner, repo, branch, octokit: new Octokit({ auth: token }) };
}

async function getFile(path: string): Promise<{ contentBase64: string; sha: string } | null> {
  const { owner, repo, branch, octokit } = config();
  try {
    const res = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    if (Array.isArray(res.data) || res.data.type !== "file" || !res.data.content) {
      throw new Error(`${path} is not a readable file`);
    }
    return { contentBase64: res.data.content.replace(/\n/g, ""), sha: res.data.sha };
  } catch (err: unknown) {
    if (typeof err === "object" && err && "status" in err && (err as { status: number }).status === 404) {
      return null;
    }
    throw err;
  }
}

async function putFile(
  path: string,
  contentBase64: string,
  message: string,
  sha?: string
): Promise<void> {
  const { owner, repo, branch, octokit } = config();
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentBase64,
    sha,
    branch,
  });
}

async function readJson<T>(path: string): Promise<{ data: T; sha: string }> {
  const file = await getFile(path);
  if (!file) throw new Error(`${path} not found in repo`);
  const raw = Buffer.from(file.contentBase64, "base64").toString("utf-8");
  return { data: JSON.parse(raw) as T, sha: file.sha };
}

async function writeJson<T>(path: string, data: T, sha: string, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n", "utf-8").toString("base64");
  await putFile(path, content, message, sha);
}

export async function readProjects(): Promise<{ projects: Project[]; sha: string }> {
  const { data, sha } = await readJson<Project[]>(PROJECTS_PATH);
  return { projects: data, sha };
}

export async function writeProjects(projects: Project[], sha: string, message: string): Promise<void> {
  await writeJson(PROJECTS_PATH, projects, sha, message);
}

export async function readSiteConfig(): Promise<{ config: SiteConfig; sha: string }> {
  const { data, sha } = await readJson<SiteConfig>(SITE_CONFIG_PATH);
  return { config: data, sha };
}

export async function writeSiteConfig(cfg: SiteConfig, sha: string, message: string): Promise<void> {
  await writeJson(SITE_CONFIG_PATH, cfg, sha, message);
}

export async function readWallPosts(): Promise<{ posts: WallPost[]; sha: string }> {
  const { data, sha } = await readJson<WallPost[]>(WALL_PATH);
  return { posts: data, sha };
}

export async function writeWallPosts(posts: WallPost[], sha: string, message: string): Promise<void> {
  await writeJson(WALL_PATH, posts, sha, message);
}

const UPLOADS_PREFIX = "public/uploads/";

/**
 * Uploads a binary/base64 file under public/uploads/ — the only path admin
 * uploads are allowed to write to, so this endpoint can never overwrite
 * source code or config files in the repo.
 */
export async function uploadPublicFile(
  relativePath: string,
  contentBase64: string,
  message: string
): Promise<string> {
  const safeRelative = relativePath.replace(/^\/+/, "").replace(/\.\.+/g, "");
  const fullPath = `${UPLOADS_PREFIX}${safeRelative}`;
  const existing = await getFile(fullPath);
  await putFile(fullPath, contentBase64, message, existing?.sha);
  return `/uploads/${safeRelative}`;
}

// ---------- /tunel photo archive ----------

const TUNEL_PATH = "data/tunel.json";

export async function readTunelPhotos(): Promise<TunelPhoto[]> {
  const file = await getFile(TUNEL_PATH);
  if (!file) return [];
  const raw = JSON.parse(Buffer.from(file.contentBase64, "base64").toString("utf-8")) as unknown;
  return Array.isArray(raw) ? raw.filter(isTunelPhoto) : [];
}

/**
 * Stores an image as a git blob without committing it. The blob only becomes
 * part of the repo when commitTunel() references it, so several photos can be
 * uploaded one by one (each request stays under Vercel's body limit) and then
 * published together in a single commit / single redeploy.
 */
export async function createImageBlob(contentBase64: string): Promise<string> {
  const { owner, repo, octokit } = config();
  const res = await octokit.git.createBlob({ owner, repo, content: contentBase64, encoding: "base64" });
  return res.data.sha;
}

/**
 * Writes data/tunel.json, adds the new image blobs and deletes the images of
 * removed photos, all in one commit on the configured branch.
 */
export async function commitTunel(
  photos: TunelPhoto[],
  added: { path: string; blobSha: string }[],
  removedPaths: string[],
  message: string
): Promise<string> {
  const { owner, repo, branch, octokit } = config();
  const ref = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const headSha = ref.data.object.sha;
  const head = await octokit.git.getCommit({ owner, repo, commit_sha: headSha });

  const json = JSON.stringify(photos, null, 2) + "\n";
  const tree = await octokit.git.createTree({
    owner,
    repo,
    base_tree: head.data.tree.sha,
    tree: [
      { path: TUNEL_PATH, mode: "100644", type: "blob", content: json },
      ...added.map((a) => ({ path: a.path, mode: "100644" as const, type: "blob" as const, sha: a.blobSha })),
      ...removedPaths.map((p) => ({ path: p, mode: "100644" as const, type: "blob" as const, sha: null })),
    ],
  });
  const commit = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.data.sha,
    parents: [headSha],
  });
  // Not forced: if someone pushed in between, this fails instead of overwriting.
  await octokit.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.data.sha });
  return commit.data.sha;
}
