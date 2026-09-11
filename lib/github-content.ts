import { Octokit } from "@octokit/rest";
import type { Project } from "@/lib/projects";

const DATA_PATH = "data/projects.json";

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

export async function readProjects(): Promise<{ projects: Project[]; sha: string }> {
  const { owner, repo, branch, octokit } = config();
  const res = await octokit.repos.getContent({ owner, repo, path: DATA_PATH, ref: branch });
  if (Array.isArray(res.data) || res.data.type !== "file" || !res.data.content) {
    throw new Error(`${DATA_PATH} is not a readable file`);
  }
  const raw = Buffer.from(res.data.content, "base64").toString("utf-8");
  return { projects: JSON.parse(raw) as Project[], sha: res.data.sha };
}

export async function writeProjects(
  projects: Project[],
  sha: string,
  message: string
): Promise<void> {
  const { owner, repo, branch, octokit } = config();
  const content = Buffer.from(JSON.stringify(projects, null, 2) + "\n", "utf-8").toString(
    "base64"
  );
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: DATA_PATH,
    message,
    content,
    sha,
    branch,
  });
}
