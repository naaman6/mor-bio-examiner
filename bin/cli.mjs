#!/usr/bin/env node
/**
 * mor-bio-examiner CLI
 * Installs the SKILL.md and references/ into the user's AI agent skills directory.
 */
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdir, cp, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = resolve(__dirname, "..");
const SKILL_SRC = join(PACKAGE_ROOT, "skill");
const SKILL_NAME = "mor-bio-examiner";

const TARGETS = {
  "claude-code":  { path: ".claude/skills",  label: "Claude Code" },
  "claude":       { path: ".claude/skills",  label: "Claude Desktop / Code" },
  "cursor":       { path: ".cursor/skills",  label: "Cursor" },
  "codex":        { path: ".codex/skills",   label: "Codex" },
  "opencode":     { path: ".opencode/skills",label: "OpenCode" },
  "perplexity":   { path: "skills/user",     label: "Perplexity Computer (workspace)" },
};

const COLORS = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  cyan: "\x1b[36m", green: "\x1b[32m", yellow: "\x1b[33m", red: "\x1b[31m",
};
const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

function parseArgs(argv) {
  const args = { command: argv[0] || "install", agent: null, scope: "project", help: false };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-a" || a === "--agent") args.agent = argv[++i];
    else if (a === "-g" || a === "--global") args.scope = "global";
    else if (a === "-p" || a === "--project") args.scope = "project";
    else if (a === "-h" || a === "--help") args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`
${c("bold", "mor-bio-examiner")} — Hebrew Medical School Biographical Examiner Skill

${c("bold", "Usage:")}
  npx mor-bio-examiner ${c("cyan", "install")} [options]
  npx mor-bio-examiner ${c("cyan", "info")}
  npx mor-bio-examiner ${c("cyan", "list")}

${c("bold", "Options:")}
  -a, --agent <agent>    Target agent: claude-code, claude, cursor, codex, opencode, perplexity
                         (default: interactive prompt; or all common agents)
  -g, --global           Install to user home directory (~/...) instead of current project
  -p, --project          Install to current directory (default)
  -h, --help             Show this help

${c("bold", "Examples:")}
  ${c("dim", "# Install to all detected agents in current project")}
  npx mor-bio-examiner install

  ${c("dim", "# Install specifically for Claude Code, globally")}
  npx mor-bio-examiner install -a claude-code --global

  ${c("dim", "# Show what would be installed")}
  npx mor-bio-examiner info
`);
}

async function isDir(p) {
  try { return (await stat(p)).isDirectory(); } catch { return false; }
}

async function copyRecursive(src, dest) {
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true, force: true });
}

async function installToTarget(targetKey, scope) {
  const target = TARGETS[targetKey];
  if (!target) throw new Error(`Unknown agent: ${targetKey}`);
  const base = scope === "global" ? homedir() : process.cwd();
  const destDir = join(base, target.path, SKILL_NAME);

  await copyRecursive(SKILL_SRC, destDir);
  return destDir;
}

async function detectAgents(scope) {
  const base = scope === "global" ? homedir() : process.cwd();
  const detected = [];
  for (const [key, t] of Object.entries(TARGETS)) {
    const parentDir = join(base, dirname(t.path));
    if (existsSync(parentDir)) detected.push(key);
  }
  return [...new Set(detected)];
}

async function cmdInstall(args) {
  console.log(c("bold", `\n📦 Installing ${SKILL_NAME}\n`));

  let targets = args.agent ? [args.agent] : null;
  if (!targets) {
    const detected = await detectAgents(args.scope);
    if (detected.length > 0) {
      targets = detected;
      console.log(c("dim", `Auto-detected agents: ${detected.join(", ")}\n`));
    } else {
      targets = ["claude-code", "cursor"];
      console.log(c("yellow", `No agents auto-detected. Installing defaults: ${targets.join(", ")}\n`));
    }
  }

  const installed = [];
  for (const t of targets) {
    try {
      const dest = await installToTarget(t, args.scope);
      console.log(c("green", "✓") + ` ${TARGETS[t].label}: ${c("dim", dest)}`);
      installed.push({ agent: t, path: dest });
    } catch (err) {
      console.log(c("red", "✗") + ` ${TARGETS[t]?.label || t}: ${err.message}`);
    }
  }

  if (installed.length > 0) {
    console.log(c("bold", `\n✅ Installed successfully to ${installed.length} location(s).`));
    console.log(c("dim", `\nThe skill is now available. Trigger words: ביוגרפי, מיונים, רפואה, מור, מרקם, מרב, שאלון אישי\n`));
  } else {
    console.log(c("red", "\n✗ No installations succeeded."));
    process.exit(1);
  }
}

async function cmdInfo() {
  console.log(c("bold", `\n📋 ${SKILL_NAME}\n`));
  const entries = await readdir(SKILL_SRC, { withFileTypes: true });
  console.log(c("bold", "Files included:"));
  for (const e of entries) {
    if (e.isDirectory()) {
      const sub = await readdir(join(SKILL_SRC, e.name));
      console.log(`  📁 ${e.name}/  ${c("dim", `(${sub.length} files)`)}`);
      for (const s of sub) console.log(c("dim", `     └── ${s}`));
    } else {
      console.log(`  📄 ${e.name}`);
    }
  }
  console.log();
}

async function cmdList(args) {
  console.log(c("bold", "\n🎯 Supported agents:\n"));
  for (const [key, t] of Object.entries(TARGETS)) {
    console.log(`  ${c("cyan", key.padEnd(14))} → ${t.path}  ${c("dim", `(${t.label})`)}`);
  }
  console.log();
  const detected = await detectAgents("project");
  if (detected.length) console.log(c("green", `Detected in current dir: ${detected.join(", ")}\n`));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();

  switch (args.command) {
    case "install": return cmdInstall(args);
    case "info":    return cmdInfo();
    case "list":    return cmdList(args);
    case "help":    return printHelp();
    default:
      console.error(c("red", `Unknown command: ${args.command}`));
      printHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(c("red", `\n✗ Error: ${err.message}\n`));
  process.exit(1);
});
