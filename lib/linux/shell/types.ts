/**
 * Simulated Linux shell — pure in-memory model.
 * NEVER executes real commands, never touches the network, the repo,
 * or the learner's actual machine. All state lives in a Map.
 */

export type NodeKind = "file" | "dir" | "symlink";

export interface VNode {
  kind: NodeKind;
  /** File content (files only). Shared object reference when hard-linked. */
  content?: string;
  /** Symlink target, exactly as written (resolved against cwd when relative). */
  target?: string;
  /** Unix-style mode bits, e.g. 0o644. Directory exec bit = access. */
  mode: number;
  owner: string;
  /** Stable id shared by hard links to the same file. */
  inode: number;
}

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ShellState {
  /** path ("/..") -> node. Directories exist implicitly: parents are guaranteed. */
  nodes: Map<string, VNode>;
  cwd: string;
  env: Record<string, string>;
  user: string;
  /** Command history (inputs), oldest first. */
  history: string[];
  /** stdout of the most recent command (fed to the next pipeline stage). */
  lastOutput: string;
  /** Logical clear flag for the UI to reset the screen. */
  cleared: boolean;
  inodeSeq: number;
}
