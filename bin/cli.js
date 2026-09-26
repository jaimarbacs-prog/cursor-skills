#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const PKG = require('../package.json');
const TEMPLATES_ROOT = path.join(__dirname, '..', 'templates');
const AI_NAMES = ['cursor', 'claude', 'windsurf'];

function help()
{
    console.log(`
${PKG.name} v${PKG.version}

Install Cursor skills globally (all projects, nothing extra to git-push).

  npx --yes . init --ai cursor --global

Skills
  review       @review / @review -t   (diff safety review)
  tr           @tr -e / @tr -t        (professional engineering translation)
  gs           /gs                    (professional English client reply)
  professional-client-communication   (rewrite informal notes for clients)

Commands
  init         Copy skill(s) into Cursor (or Claude / Windsurf)
  uninstall    Remove the installed skill(s)
  help         Show this help

Options
  --ai <type>     cursor | claude | windsurf | all     (default: cursor)
  --skill <name>  review | tr | gs | professional-client-communication | all  (default: all)
  --global        Install under the home folder (~/)   (recommended)
  --force         Overwrite if the skill already exists

Examples
  npx --yes . init --ai cursor --global
  npx --yes . init --ai cursor --global --skill tr --force
  npx --yes . init --ai cursor --global --force
  npx --yes . uninstall --ai cursor --global --skill tr
`.trim());
}

function parse_args(argv)
{
    const args = argv.slice(2);
    const out = {
        command: args[0] || 'help',
        ai: 'cursor',
        skill: 'all',
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
        else if((a === '--skill' || a === '-s') && args[i + 1])
        {
            out.skill = String(args[++i]).toLowerCase();
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

function list_skills()
{
    if(!fs.existsSync(TEMPLATES_ROOT))
    {
        throw new Error(`Missing templates at ${TEMPLATES_ROOT}`);
    }

    return fs.readdirSync(TEMPLATES_ROOT).filter((name) =>
    {
        return fs.statSync(path.join(TEMPLATES_ROOT, name)).isDirectory();
    });
}

function resolve_skills(skill)
{
    const available = list_skills();
    if(skill === 'all') return available;
    if(!available.includes(skill))
    {
        throw new Error(`Unknown --skill "${skill}". Use: ${available.join(', ')}, all`);
    }
    return [skill];
}

function ai_skill_path(ai, skill)
{
    if(ai === 'cursor') return ['.cursor', 'skills', skill];
    if(ai === 'claude') return ['.claude', 'skills', skill];
    if(ai === 'windsurf') return ['.codeium', 'windsurf', 'skills', skill];
    return null;
}

function resolve_targets(ai, skills, is_global)
{
    const ais = ai === 'all' ? AI_NAMES : [ai];
    const root = is_global ? os.homedir() : process.cwd();
    const targets = [];

    for(const ai_name of ais)
    {
        for(const skill of skills)
        {
            const parts = ai_skill_path(ai_name, skill);
            if(!parts)
            {
                throw new Error(`Unknown --ai "${ai_name}". Use: cursor, claude, windsurf, all`);
            }
            targets.push({
                name: ai_name,
                skill,
                dir: path.join(root, ...parts),
                src: path.join(TEMPLATES_ROOT, skill),
            });
        }
    }

    return targets;
}

function hint_after_install(skills)
{
    const names = skills.join(', ');
    if(skills.includes('tr') && skills.includes('review'))
    {
        return 'Next: restart Cursor or open a new chat. Type @review for diffs, @tr -e "text" to translate, or /gs plus a client message.';
    }
    if(skills.includes('tr'))
    {
        return 'Next: restart Cursor or open a new chat, then type @tr -e "your text".';
    }
    return `Next: restart Cursor or open a new chat, then type @${names}.`;
}

function init(opts)
{
    const skills = resolve_skills(opts.skill);
    const targets = resolve_targets(opts.ai, skills, opts.global);

    for(const t of targets)
    {
        if(!fs.existsSync(t.src))
        {
            throw new Error(`Missing templates at ${t.src}`);
        }
        if(fs.existsSync(t.dir) && !opts.force)
        {
            console.log(`Exists: ${t.dir}`);
            console.log(`Use --force to overwrite.`);
            continue;
        }
        copy_dir(t.src, t.dir);
        console.log(`Installed ${t.skill} (${t.name}${opts.global ? ', global' : ', project'}): ${t.dir}`);
    }

    console.log('');
    console.log(hint_after_install(skills));
}

function uninstall(opts)
{
    const skills = resolve_skills(opts.skill);
    const targets = resolve_targets(opts.ai, skills, opts.global);

    for(const t of targets)
    {
        if(!fs.existsSync(t.dir))
        {
            console.log(`Not found: ${t.dir}`);
            continue;
        }
        remove_dir(t.dir);
        console.log(`Removed ${t.skill} (${t.name}): ${t.dir}`);
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
