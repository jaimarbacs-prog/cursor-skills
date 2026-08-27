#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const PKG = require('../package.json');
const TEMPLATES = path.join(__dirname, '..', 'templates', 'review');
const SKILL_NAME = 'review';

const AI_PATHS = {
  cursor: ['.cursor', 'skills', SKILL_NAME],
  claude: ['.claude', 'skills', SKILL_NAME],
  windsurf: ['.codeium', 'windsurf', 'skills', SKILL_NAME],
};

function help()
{
    console.log(`
${PKG.name} v${PKG.version}

Install the @review skill globally (all Cursor projects, nothing to git-push).

  npx --yes cursor-review-skill init --ai cursor --global

Commands
  init         Copy the skill into Cursor (or Claude / Windsurf)
  uninstall    Remove the installed skill
  help         Show this help

Options
  --ai <type>  cursor | claude | windsurf | all     (default: cursor)
  --global     Install under the home folder (~/)   (recommended)
  --force      Overwrite if the skill already exists

Examples
  npx --yes cursor-review-skill init --ai cursor --global
  npx --yes cursor-review-skill init --ai cursor --global --force
  npx --yes cursor-review-skill uninstall --ai cursor --global
`.trim());
}

function parse_args(argv)
{
    const args = argv.slice(2);
    const out = {
        command: args[0] || 'help',
        ai: 'cursor',
        global: false,
        force: false,
    };

    for(let i = 1; i < args.length; i++)
    {
        const a = args[i];
        if(a === '--global' || a === '-g') out.global = true;
        else if(a === '--force' || a === '-f') out.force = true;
        else if((a === '--ai' || a === '-a') && args[i + 1])
        {
            out.ai = String(args[++i]).toLowerCase();
        }
    }

    return out;
}

function copy_dir(src, dest)
{
    fs.mkdirSync(dest, { recursive: true });
    for(const name of fs.readdirSync(src))
    {
        const from = path.join(src, name);
        const to = path.join(dest, name);
        const stat = fs.statSync(from);
        if(stat.isDirectory()) copy_dir(from, to);
        else fs.copyFileSync(from, to);
    }
}

function remove_dir(dir)
{
    fs.rmSync(dir, { recursive: true, force: true });
}

function resolve_targets(ai, is_global)
{
    const names = ai === 'all' ? Object.keys(AI_PATHS) : [ai];
    const root = is_global ? os.homedir() : process.cwd();

    return names.map((name) =>
    {
        const parts = AI_PATHS[name];
        if(!parts)
        {
            throw new Error(`Unknown --ai "${name}". Use: cursor, claude, windsurf, all`);
        }
        return { name, dir: path.join(root, ...parts) };
    });
}

function init(opts)
{
    if(!fs.existsSync(TEMPLATES))
    {
        throw new Error(`Missing templates at ${TEMPLATES}`);
    }

    const targets = resolve_targets(opts.ai, opts.global);
    for(const t of targets)
    {
        if(fs.existsSync(t.dir) && !opts.force)
        {
            console.log(`Exists: ${t.dir}`);
            console.log(`Use --force to overwrite.`);
            continue;
        }
        copy_dir(TEMPLATES, t.dir);
        console.log(`Installed (${t.name}${opts.global ? ', global' : ', project'}): ${t.dir}`);
    }

    console.log('');
    console.log('Next: restart Cursor or open a new chat, then type @review and paste a git diff.');
}

function uninstall(opts)
{
    const targets = resolve_targets(opts.ai, opts.global);
    for(const t of targets)
    {
        if(!fs.existsSync(t.dir))
        {
            console.log(`Not found: ${t.dir}`);
            continue;
        }
        remove_dir(t.dir);
        console.log(`Removed (${t.name}): ${t.dir}`);
    }
}

try
{
    const opts = parse_args(process.argv);
    if(opts.command === 'help' || opts.command === '--help' || opts.command === '-h')
    {
        help();
        process.exit(0);
    }
    if(opts.command === 'init') init(opts);
    else if(opts.command === 'uninstall') uninstall(opts);
    else
    {
        console.error(`Unknown command: ${opts.command}`);
        help();
        process.exit(1);
    }
}
catch(err)
{
    console.error(err.message || err);
    process.exit(1);
}
