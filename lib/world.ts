export type Node = { id: string; areaId: string; label: string; emoji: string; grade: 3 | 4 | 5 | 6; x: number; y: number; prerequisites: string[]; bridges: string[]; isMainPath: boolean }
export type Area = { id: string; regionId: string; name: string; emoji: string }
export type Region = { id: string; continentId: string; name: string; emoji: string; themeColor: string; unlockCost: number }
export type Continent = { id: string; name: string; emoji: string; accent: string }

export const continents: Continent[] = [
  { id: 'science', name: 'りか大陸', emoji: '🌋', accent: '#FF9040' },
  { id: 'math', name: 'さんすう大陸', emoji: '🗻', accent: '#4EC5C1' },
]
export const regions: Region[] = [
  { id: 'physics', continentId: 'science', name: 'ぶつり地方', emoji: '⚙️', themeColor: '#FF9040', unlockCost: 0 },
  { id: 'life', continentId: 'science', name: 'せいめい地方', emoji: '🌱', themeColor: '#5FB85F', unlockCost: 40 },
  { id: 'earth', continentId: 'science', name: 'ちきゅう地方', emoji: '🪨', themeColor: '#B08050', unlockCost: 60 },
  { id: 'change', continentId: 'math', name: '変化と関係地方', emoji: '📈', themeColor: '#4EC5C1', unlockCost: 0 },
  { id: 'shape', continentId: 'math', name: 'かたち地方', emoji: '🔷', themeColor: '#6C7BE0', unlockCost: 30 },
  { id: 'number', continentId: 'math', name: 'かずと計算地方', emoji: '🔢', themeColor: '#E06C9F', unlockCost: 30 },
  { id: 'data', continentId: 'math', name: 'データ地方', emoji: '📊', themeColor: '#E0A030', unlockCost: 50 },
]
export const areas: Area[] = [
  { id: 'lever', regionId: 'physics', name: 'てこ', emoji: '⚖️' }, { id: 'pendulum', regionId: 'physics', name: 'ふりこ', emoji: '🕰️' }, { id: 'circuit', regionId: 'physics', name: 'でんき', emoji: '💡' },
  { id: 'ratio', regionId: 'change', name: 'ひれい', emoji: '📈' }, { id: 'percent', regionId: 'change', name: 'わりあい', emoji: '🥧' }, { id: 'area', regionId: 'shape', name: 'めんせき', emoji: '🔷' },
]
export const nodes: Node[] = [
  { id: 'lever-01', areaId: 'lever', label: 'てこ ①', emoji: '⚖️', grade: 6, x: 50, y: 80, prerequisites: [], bridges: [], isMainPath: true },
  { id: 'lever-02', areaId: 'lever', label: 'てこ ②', emoji: '⚖️', grade: 6, x: 50, y: 220, prerequisites: ['lever-01'], bridges: [], isMainPath: true },
  { id: 'lever-03', areaId: 'lever', label: 'てこ ③', emoji: '🔍', grade: 6, x: 50, y: 360, prerequisites: ['lever-02'], bridges: ['ratio-02'], isMainPath: true },
  { id: 'pendulum-01', areaId: 'pendulum', label: 'ふりこ ①', emoji: '🕰️', grade: 5, x: 22, y: 300, prerequisites: [], bridges: [], isMainPath: false },
  { id: 'pendulum-02', areaId: 'pendulum', label: 'ふりこ ②', emoji: '🕰️', grade: 5, x: 22, y: 440, prerequisites: ['pendulum-01'], bridges: [], isMainPath: false },
  { id: 'circuit-01', areaId: 'circuit', label: 'でんき ①', emoji: '💡', grade: 3, x: 78, y: 300, prerequisites: [], bridges: [], isMainPath: false },
  { id: 'ratio-01', areaId: 'ratio', label: 'ひれい ①', emoji: '📈', grade: 6, x: 50, y: 80, prerequisites: [], bridges: [], isMainPath: true },
  { id: 'ratio-02', areaId: 'ratio', label: 'ひれい ②', emoji: '📈', grade: 6, x: 50, y: 220, prerequisites: ['ratio-01'], bridges: [], isMainPath: true },
  { id: 'percent-01', areaId: 'percent', label: 'わりあい ①', emoji: '🥧', grade: 5, x: 22, y: 300, prerequisites: ['ratio-01'], bridges: [], isMainPath: false },
  { id: 'area-01', areaId: 'area', label: 'めんせき ①', emoji: '🔷', grade: 5, x: 50, y: 80, prerequisites: [], bridges: [], isMainPath: true },
  { id: 'area-02', areaId: 'area', label: 'めんせき ②', emoji: '🔷', grade: 6, x: 50, y: 220, prerequisites: ['area-01'], bridges: [], isMainPath: true },
]
export const getRegion = (id: string) => regions.find((r) => r.id === id)
export const getContinent = (id: string) => continents.find((c) => c.id === id)
export const getArea = (id: string) => areas.find((a) => a.id === id)
export const getNodesForRegion = (regionId: string) => { const areaIds = areas.filter((a) => a.regionId === regionId).map((a) => a.id); return nodes.filter((n) => areaIds.includes(n.areaId)) }
export const getNode = (id: string) => nodes.find((n) => n.id === id)
export const getRegionForNode = (id: string) => { const node = getNode(id); const area = node && getArea(node.areaId); return area && getRegion(regions.find((r) => r.id === area.regionId)?.id || '') }
