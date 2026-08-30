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

export type ThemeId = 'chikara' | 'hikari' | 'jishaku' | 'denki'

export const themeColors: Record<ThemeId, string> = {
  chikara: '#FF9040',
  hikari: '#E8B33A',
  jishaku: '#9B72CF',
  denki: '#4E8FC5',
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
    status: 'comingSoon',
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

export const sugorokuNodes: SugorokuNode[] = [
  { id: 'rubber-01', label: 'ゴムの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 700, y: 630 },
  { id: 'rubber-02', label: 'ゴムの力 ②', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 775, y: 622 },
  { id: 'rubber-03', label: 'ゴムの力 ③', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 655, y: 600 },
  { id: 'rubber-04', label: 'ゴムの力 ④', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 650, y: 668 },
  { id: 'wind-01', label: 'かぜの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 850, y: 626 },
  { id: 'light-01', label: 'ひかり ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 920, y: 642 },
  { id: 'mirror-01', label: 'かがみ ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 918, y: 694 },
  { id: 'sound-01', label: 'おと ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 845, y: 682 },
  { id: 'magnet-01', label: 'じしゃく ①', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 772, y: 686 },
  { id: 'magnet-02', label: 'じしゃく ②', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 700, y: 696 },
  { id: 'circuit-01', label: 'でんきの とおり道', grade: 3, theme: 'denki', regionId: 'butsuri', x: 700, y: 752 },
  { id: 'current-01', label: '電流の はたらき', grade: 4, theme: 'denki', regionId: 'butsuri', x: 772, y: 742 },
  { id: 'pendulum-01', label: 'ふりこ ①', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 842, y: 748 },
  { id: 'pendulum-02', label: 'ふりこ ②', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 902, y: 762 },
  { id: 'emag-01', label: '電流が つくる磁力', grade: 5, theme: 'denki', regionId: 'butsuri', x: 856, y: 806 },
  { id: 'lever-01', label: 'てこ ①', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 786, y: 812 },
  { id: 'lever-02', label: 'てこ ②', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 716, y: 818 },
  { id: 'lever-03', label: 'てこ ③', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 722, y: 852 },
  { id: 'elec-use-01', label: '電気の りよう', grade: 6, theme: 'denki', regionId: 'butsuri', x: 790, y: 848 },
]

export const getIsland = (id: string) => islands.find((i) => i.id === id)
export const getMapRegion = (id: string) => mapRegions.find((r) => r.id === id)
export const getRegionsForIsland = (islandId: string) => mapRegions.filter((r) => r.islandId === islandId)
export const getNodesForRegion = (regionId: string) => sugorokuNodes.filter((n) => n.regionId === regionId)
export const getSugorokuNode = (id: string) => sugorokuNodes.find((n) => n.id === id)
export const getNodeIndex = (id: string) => sugorokuNodes.findIndex((n) => n.id === id)
export const getPrevNode = (id: string) => sugorokuNodes[getNodeIndex(id) - 1] ?? null
