# mcp-dnd5e

MCP server for D&D 5th Edition spells, monsters, and classes via [dnd5eapi.co](https://www.dnd5eapi.co). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `get_spell` | Get full details for a D&D 5e spell by index name |
| `get_monster` | Get full details for a D&D 5e monster by index name |
| `get_class` | Get details for a D&D 5e character class by index name |
| `list_spells` | List all available D&D 5e spells |

## Quickstart via Pipeworx Gateway

Call any tool through the hosted gateway with zero setup:

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "dnd5e_get_spell",
      "arguments": { "index": "fireball" }
    }
  }'
```

## License

MIT
