---
name: gs
description: >-
  Generate a professional English client reply from a pasted client question.
  Use when the user types /gs or pastes a client message to answer.
disable-model-invocation: true
---

# /gs — Generate Client Reply

The user typed `/gs` and will paste the client's question or message.

Read and follow [professional-client-communication](../professional-client-communication/SKILL.md).

## Workflow

1. Treat everything after `/gs` (and any following user text, screenshot, or quoted chat) as the **client's message**.
2. Use the current chat and codebase only if needed to keep the reply accurate.
3. Do not claim a fix, deploy, or timeline unless the user already confirmed it.
4. If the client message is unclear, ask the developer one short clarifying question. Do not invent details.

## Output

Return only the final client-facing reply.

- No intro such as "Here is your message."
- No quotation marks around the reply
- Short paragraph by default
- Simple, polite, professional English
- No client first name unless the user included one
