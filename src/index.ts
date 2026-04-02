/**
 * D&D 5e MCP — wraps the D&D 5th Edition API (free, no auth)
 *
 * Tools:
 * - get_spell: Get details for a D&D 5e spell by index name
 * - get_monster: Get details for a D&D 5e monster by index name
 * - get_class: Get details for a D&D 5e class by index name
 * - list_spells: List all available spells
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://www.dnd5eapi.co/api/2014';

type RawApiRef = {
  index: string;
  name: string;
  url: string;
};

type RawSpell = {
  index: string;
  name: string;
  desc: string[];
  higher_level?: string[];
  range: string;
  components: string[];
  material?: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: RawApiRef;
  classes: RawApiRef[];
  subclasses: RawApiRef[];
};

type RawMonster = {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: Array<{ value: number; type: string }>;
  hit_points: number;
  hit_dice: string;
  speed: Record<string, string>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  challenge_rating: number;
  xp: number;
};

type RawClass = {
  index: string;
  name: string;
  hit_die: number;
  proficiency_choices: unknown[];
  proficiencies: RawApiRef[];
  saving_throws: RawApiRef[];
  starting_equipment: unknown[];
  class_levels: string;
  subclasses: RawApiRef[];
};

type RawListResponse = {
  count: number;
  results: RawApiRef[];
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_spell',
    description:
      'Get full details for a D&D 5e spell by its index name (e.g. "fireball", "magic-missile", "cure-wounds").',
    inputSchema: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: 'Spell index name in kebab-case (e.g. "fireball", "magic-missile").',
        },
      },
      required: ['index'],
    },
  },
  {
    name: 'get_monster',
    description:
      'Get full details for a D&D 5e monster by its index name (e.g. "aboleth", "dragon-red-adult", "goblin").',
    inputSchema: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: 'Monster index name in kebab-case (e.g. "goblin", "dragon-red-adult").',
        },
      },
      required: ['index'],
    },
  },
  {
    name: 'get_class',
    description:
      'Get details for a D&D 5e character class by its index name (e.g. "barbarian", "wizard", "rogue").',
    inputSchema: {
      type: 'object',
      properties: {
        index: {
          type: 'string',
          description: 'Class index name in lowercase (e.g. "wizard", "fighter", "cleric").',
        },
      },
      required: ['index'],
    },
  },
  {
    name: 'list_spells',
    description: 'List all available D&D 5e spells with their index names.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_spell':
      return getSpell(args.index as string);
    case 'get_monster':
      return getMonster(args.index as string);
    case 'get_class':
      return getClass(args.index as string);
    case 'list_spells':
      return listSpells();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getSpell(index: string) {
  const res = await fetch(`${BASE_URL}/spells/${encodeURIComponent(index)}`);
  if (!res.ok) throw new Error(`D&D 5e API error: ${res.status}`);

  const data = (await res.json()) as RawSpell;
  return {
    index: data.index,
    name: data.name,
    level: data.level,
    school: data.school.name,
    casting_time: data.casting_time,
    range: data.range,
    duration: data.duration,
    concentration: data.concentration,
    ritual: data.ritual,
    components: data.components,
    material: data.material,
    description: data.desc,
    higher_level: data.higher_level,
    classes: data.classes.map((c) => c.name),
  };
}

async function getMonster(index: string) {
  const res = await fetch(`${BASE_URL}/monsters/${encodeURIComponent(index)}`);
  if (!res.ok) throw new Error(`D&D 5e API error: ${res.status}`);

  const data = (await res.json()) as RawMonster;
  return {
    index: data.index,
    name: data.name,
    size: data.size,
    type: data.type,
    alignment: data.alignment,
    armor_class: data.armor_class,
    hit_points: data.hit_points,
    hit_dice: data.hit_dice,
    speed: data.speed,
    ability_scores: {
      str: data.strength,
      dex: data.dexterity,
      con: data.constitution,
      int: data.intelligence,
      wis: data.wisdom,
      cha: data.charisma,
    },
    challenge_rating: data.challenge_rating,
    xp: data.xp,
  };
}

async function getClass(index: string) {
  const res = await fetch(`${BASE_URL}/classes/${encodeURIComponent(index)}`);
  if (!res.ok) throw new Error(`D&D 5e API error: ${res.status}`);

  const data = (await res.json()) as RawClass;
  return {
    index: data.index,
    name: data.name,
    hit_die: data.hit_die,
    saving_throws: data.saving_throws.map((s) => s.name),
    proficiencies: data.proficiencies.map((p) => p.name),
    subclasses: data.subclasses.map((s) => s.name),
  };
}

async function listSpells() {
  const res = await fetch(`${BASE_URL}/spells`);
  if (!res.ok) throw new Error(`D&D 5e API error: ${res.status}`);

  const data = (await res.json()) as RawListResponse;
  return {
    count: data.count,
    spells: data.results.map((s) => ({ index: s.index, name: s.name })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
