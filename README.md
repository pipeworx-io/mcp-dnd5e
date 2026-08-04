# mcp-dnd5e

D&D 5e MCP — wraps the D&D 5th Edition API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_spell` | Get spell details including damage, range, duration, components, and effects. Provide spell index (e.g., "fireball", "magic-missile", "cure-wounds"). Returns damage dice, range, casting time, and effect descriptions. |
| `get_monster` | Get monster stats including AC, HP, abilities, skills, senses, and actions. Provide monster index (e.g., "aboleth", "dragon-red-adult", "goblin"). Returns ability scores, skill bonuses, and attack/action details. |
| `get_class` | Get class features, hit dice, proficiencies, and advancement tables. Provide class index (e.g., "barbarian", "wizard", "rogue"). Returns feature progression, proficiency gains, and subclass options. |
| `list_spells` | Search D&D 5e spells by name or level. Returns spell indices, names, and levels for use with get_spell to fetch full details. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "dnd5e": {
      "url": "https://gateway.pipeworx.io/dnd5e/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Dnd5e data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
