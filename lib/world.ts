export type Point = { x: number; y: number }

export type Island = {
  id: string
  name: string
  labelPos: Point
  fill: string
  stroke: string
  outline: Point[]
  status: 'open' | 'comingSoon'
}

export type MapRegion = {
  id: string
  islandId: string
  name: string
  labelPos: Point
  color: string
  status: 'open' | 'comingSoon'
  polygon: Point[]
}

export type ThemeId = 'chikara' | 'hikari' | 'jishaku' | 'denki' | 'kagaku'

export const themeColors: Record<ThemeId, string> = {
  chikara: '#FF9040',
  hikari: '#E8B33A',
  jishaku: '#9B72CF',
  denki: '#4E8FC5',
  kagaku: '#3AA6A0',
}

export type SugorokuNode = {
  id: string
  label: string
  grade: 3 | 4 | 5 | 6
  theme: ThemeId
  regionId: string
  x: number
  y: number
}

export const WORLD_W = 1200
export const WORLD_H = 1900

export const islands: Island[] = [
  {
    id: 'science',
    name: 'りか島',
    labelPos: { x: 630, y: 292 },
    fill: '#EADFC8',
    stroke: '#8A7A5E',
    status: 'open',
    outline: [
      { x: 288, y: 555 }, { x: 300, y: 470 }, { x: 360, y: 392 }, { x: 470, y: 350 },
      { x: 600, y: 337 }, { x: 740, y: 345 }, { x: 860, y: 380 }, { x: 945, y: 440 },
      { x: 972, y: 545 }, { x: 960, y: 660 }, { x: 910, y: 762 }, { x: 820, y: 838 },
      { x: 720, y: 868 }, { x: 645, y: 872 }, { x: 540, y: 872 }, { x: 430, y: 848 },
      { x: 345, y: 782 }, { x: 297, y: 682 },
    ],
  },
  {
    id: 'math',
    name: 'さんすう島',
    labelPos: { x: 595, y: 1108 },
    fill: '#D9E8E6',
    stroke: '#5E8A85',
    status: 'comingSoon',
    outline: [
      { x: 310, y: 1330 }, { x: 350, y: 1240 }, { x: 450, y: 1180 }, { x: 570, y: 1160 },
      { x: 700, y: 1172 }, { x: 810, y: 1215 }, { x: 880, y: 1290 }, { x: 890, y: 1390 },
      { x: 830, y: 1470 }, { x: 710, y: 1525 }, { x: 570, y: 1545 }, { x: 440, y: 1520 },
      { x: 345, y: 1450 }, { x: 308, y: 1380 },
    ],
  },
]

export const mathIslandCenter: Point = { x: 595, y: 1355 }

export const mapRegions: MapRegion[] = [
  {
    id: 'chigaku',
    islandId: 'science',
    name: '地学山',
    labelPos: { x: 432, y: 462 },
    color: '#B08050',
    status: 'comingSoon',
    polygon: [
      { x: 615, y: 590 }, { x: 288, y: 555 }, { x: 300, y: 470 }, { x: 360, y: 392 },
      { x: 470, y: 350 }, { x: 600, y: 337 },
    ],
  },
  {
    id: 'kagaku',
    islandId: 'science',
    name: '化学海岸',
    labelPos: { x: 806, y: 452 },
    color: '#4E8FC5',
    status: 'open',
    polygon: [
      { x: 615, y: 590 }, { x: 600, y: 337 }, { x: 740, y: 345 }, { x: 860, y: 380 },
      { x: 945, y: 440 }, { x: 972, y: 545 },
    ],
  },
  {
    id: 'butsuri',
    islandId: 'science',
    name: '物理岡',
    labelPos: { x: 792, y: 712 },
    color: '#FF9040',
    status: 'open',
    polygon: [
      { x: 615, y: 590 }, { x: 972, y: 545 }, { x: 960, y: 660 }, { x: 910, y: 762 },
      { x: 820, y: 838 }, { x: 720, y: 868 }, { x: 645, y: 872 },
    ],
  },
  {
    id: 'seibutsu',
    islandId: 'science',
    name: '生物森',
    labelPos: { x: 440, y: 722 },
    color: '#5FB85F',
    status: 'comingSoon',
    polygon: [
      { x: 615, y: 590 }, { x: 645, y: 872 }, { x: 540, y: 872 }, { x: 430, y: 848 },
      { x: 345, y: 782 }, { x: 297, y: 682 }, { x: 288, y: 555 },
    ],
  },
]

// Butsuri and kagaku nodes sit on a Momotetsu-style square grid (cell = GRID_CELL)
// so consecutive nodes in a region always differ by exactly one step in x or y,
// and the connecting roads drawn in MapSugoroku are pure horizontal/vertical segments.
export const GRID_CELL = 54

export const sugorokuNodes: SugorokuNode[] = [
  { id: 'rubber-01', label: 'ゴムの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 680, y: 580 },
  { id: 'rubber-02', label: 'ゴムの力 ②', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 734, y: 580 },
  { id: 'rubber-03', label: 'ゴムの力 ③', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 788, y: 580 },
  { id: 'rubber-04', label: 'ゴムの力 ④', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 842, y: 580 },
  { id: 'wind-01', label: 'かぜの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 896, y: 580 },
  { id: 'light-01', label: 'ひかり ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 896, y: 634 },
  { id: 'mirror-01', label: 'かがみ ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 842, y: 634 },
  { id: 'sound-01', label: 'おと ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 788, y: 634 },
  { id: 'magnet-01', label: 'じしゃく ①', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 734, y: 634 },
  { id: 'magnet-02', label: 'じしゃく ②', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 680, y: 634 },
  { id: 'circuit-01', label: 'でんきの とおり道', grade: 3, theme: 'denki', regionId: 'butsuri', x: 680, y: 688 },
  { id: 'current-01', label: '電流の はたらき', grade: 4, theme: 'denki', regionId: 'butsuri', x: 734, y: 688 },
  { id: 'pendulum-01', label: 'ふりこ ①', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 788, y: 688 },
  { id: 'pendulum-02', label: 'ふりこ ②', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 842, y: 688 },
  { id: 'emag-01', label: '電流が つくる磁力', grade: 5, theme: 'denki', regionId: 'butsuri', x: 896, y: 688 },
  { id: 'lever-01', label: 'てこ ①', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 896, y: 742 },
  { id: 'lever-02', label: 'てこ ②', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 842, y: 742 },
  { id: 'lever-03', label: 'てこ ③', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 788, y: 742 },
  { id: 'elec-use-01', label: '電気の りよう', grade: 6, theme: 'denki', regionId: 'butsuri', x: 734, y: 742 },
  { id: 'chem-01', label: 'ものの重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 660, y: 380 },
  { id: 'chem-02', label: '形と重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 714, y: 380 },
  { id: 'chem-03', label: '体積と重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 768, y: 380 },
  { id: 'chem-04', label: '空気って重い？', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 822, y: 380 },
  { id: 'chem-05', label: '空気の性質', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 876, y: 380 },
  { id: 'chem-06', label: '空気は縮む！', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 930, y: 380 },
  { id: 'chem-07', label: '水は縮む？', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 930, y: 434 },
  { id: 'chem-08', label: 'あたためると', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 876, y: 434 },
  { id: 'chem-09', label: '水の三態変化', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 822, y: 434 },
  { id: 'chem-10', label: '水に入れよう', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 768, y: 434 },
  { id: 'chem-11', label: 'とけたものは', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 714, y: 434 },
  { id: 'chem-12', label: 'とけても重さ', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 660, y: 434 },
  { id: 'chem-13', label: 'どこまでとける', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 660, y: 488 },
  { id: 'chem-14', label: '温度で変わる？', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 714, y: 488 },
  { id: 'chem-15', label: 'ものが燃える！', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 768, y: 488 },
  { id: 'chem-16', label: '水溶液ってなんだ', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 822, y: 488 },
  { id: 'chem-17', label: '酸性？中性？', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 876, y: 488 },
  { id: 'chem-18', label: '水溶液と金属', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 930, y: 488 },
]

export const getIsland = (id: string) => islands.find((i) => i.id === id)
export const getMapRegion = (id: string) => mapRegions.find((r) => r.id === id)
export const getRegionsForIsland = (islandId: string) => mapRegions.filter((r) => r.islandId === islandId)
export const getNodesForRegion = (regionId: string) => sugorokuNodes.filter((n) => n.regionId === regionId)
export const getSugorokuNode = (id: string) => sugorokuNodes.find((n) => n.id === id)
export const getNodeIndex = (id: string) => sugorokuNodes.findIndex((n) => n.id === id)
export const getPrevNode = (id: string) => sugorokuNodes[getNodeIndex(id) - 1] ?? null
export const getPrevNodeInRegion = (id: string): SugorokuNode | null => {
  const node = getSugorokuNode(id)
  if (!node) return null
  const regionNodes = getNodesForRegion(node.regionId)
  const idx = regionNodes.findIndex((n) => n.id === id)
  return regionNodes[idx - 1] ?? null
}
