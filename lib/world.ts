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

export type ThemeId = 'chikara' | 'hikari' | 'jishaku' | 'denki' | 'kagaku' | 'chigaku' | 'seibutsu'

export const themeColors: Record<ThemeId, string> = {
  chikara: '#FF9040',
  hikari: '#E8B33A',
  jishaku: '#9B72CF',
  denki: '#4E8FC5',
  kagaku: '#3AA6A0',
  chigaku: '#C07A3E',
  seibutsu: '#5FB85F',
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
export const WORLD_H = 1000

export const islands: Island[] = [
  {
    id: 'science',
    name: 'りか島',
    labelPos: { x: 630, y: 198 },
    fill: '#EADFC8',
    stroke: '#8A7A5E',
    status: 'open',
    outline: [
      { x: 185, y: 540 }, { x: 201, y: 430 }, { x: 279, y: 328 }, { x: 422, y: 274 },
      { x: 591, y: 257 }, { x: 773, y: 267 }, { x: 929, y: 313 }, { x: 1040, y: 391 },
      { x: 1075, y: 527 }, { x: 1059, y: 677 }, { x: 994, y: 809 }, { x: 877, y: 908 },
      { x: 747, y: 947 }, { x: 650, y: 952 }, { x: 513, y: 952 }, { x: 370, y: 921 },
      { x: 260, y: 835 }, { x: 197, y: 705 },
    ],
  },
]

export const mapRegions: MapRegion[] = [
  {
    id: 'chigaku',
    islandId: 'science',
    name: '地学山',
    labelPos: { x: 373, y: 419 },
    color: '#B08050',
    status: 'open',
    polygon: [
      { x: 611, y: 586 }, { x: 185, y: 540 }, { x: 201, y: 430 }, { x: 279, y: 328 },
      { x: 422, y: 274 }, { x: 591, y: 257 },
    ],
  },
  {
    id: 'kagaku',
    islandId: 'science',
    name: '化学海岸',
    labelPos: { x: 859, y: 406 },
    color: '#4E8FC5',
    status: 'open',
    polygon: [
      { x: 611, y: 586 }, { x: 591, y: 257 }, { x: 773, y: 267 }, { x: 929, y: 313 },
      { x: 1040, y: 391 }, { x: 1075, y: 527 },
    ],
  },
  {
    id: 'butsuri',
    islandId: 'science',
    name: '物理岡',
    labelPos: { x: 841, y: 744 },
    color: '#FF9040',
    status: 'open',
    polygon: [
      { x: 611, y: 586 }, { x: 1075, y: 527 }, { x: 1059, y: 677 }, { x: 994, y: 809 },
      { x: 877, y: 908 }, { x: 747, y: 947 }, { x: 650, y: 952 },
    ],
  },
  {
    id: 'seibutsu',
    islandId: 'science',
    name: '生物森',
    labelPos: { x: 383, y: 757 },
    color: '#5FB85F',
    status: 'open',
    polygon: [
      { x: 611, y: 586 }, { x: 650, y: 952 }, { x: 513, y: 952 }, { x: 370, y: 921 },
      { x: 260, y: 835 }, { x: 197, y: 705 }, { x: 185, y: 540 },
    ],
  },
]

// Butsuri and kagaku nodes sit on a Momotetsu-style square grid (cell = GRID_CELL)
// so consecutive nodes in a region always differ by exactly one step in x or y,
// and the connecting roads drawn in MapSugoroku are pure horizontal/vertical segments.
export const GRID_CELL = 54

export const sugorokuNodes: SugorokuNode[] = [
  { id: 'rubber-01', label: 'ゴムの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 683, y: 579 },
  { id: 'rubber-02', label: 'ゴムの力 ②', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 742, y: 579 },
  { id: 'rubber-03', label: 'ゴムの力 ③', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 800, y: 579 },
  { id: 'rubber-04', label: 'ゴムの力 ④', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 860, y: 579 },
  { id: 'wind-01', label: 'かぜの力 ①', grade: 3, theme: 'chikara', regionId: 'butsuri', x: 919, y: 579 },
  { id: 'light-01', label: 'ひかり ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 919, y: 638 },
  { id: 'mirror-01', label: 'かがみ ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 860, y: 638 },
  { id: 'sound-01', label: 'おと ①', grade: 3, theme: 'hikari', regionId: 'butsuri', x: 800, y: 638 },
  { id: 'magnet-01', label: 'じしゃく ①', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 742, y: 638 },
  { id: 'magnet-02', label: 'じしゃく ②', grade: 3, theme: 'jishaku', regionId: 'butsuri', x: 683, y: 638 },
  { id: 'circuit-01', label: 'でんきの とおり道', grade: 3, theme: 'denki', regionId: 'butsuri', x: 683, y: 697 },
  { id: 'current-01', label: '電流の はたらき', grade: 4, theme: 'denki', regionId: 'butsuri', x: 742, y: 697 },
  { id: 'pendulum-01', label: 'ふりこ ①', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 800, y: 697 },
  { id: 'pendulum-02', label: 'ふりこ ②', grade: 5, theme: 'chikara', regionId: 'butsuri', x: 860, y: 697 },
  { id: 'emag-01', label: '電流が つくる磁力', grade: 5, theme: 'denki', regionId: 'butsuri', x: 919, y: 697 },
  { id: 'lever-01', label: 'てこ ①', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 919, y: 756 },
  { id: 'lever-02', label: 'てこ ②', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 860, y: 756 },
  { id: 'lever-03', label: 'てこ ③', grade: 6, theme: 'chikara', regionId: 'butsuri', x: 800, y: 756 },
  { id: 'elec-use-01', label: '電気の りよう', grade: 6, theme: 'denki', regionId: 'butsuri', x: 742, y: 756 },
  { id: 'chem-01', label: 'ものの重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 661, y: 361 },
  { id: 'chem-02', label: '形と重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 720, y: 361 },
  { id: 'chem-03', label: '体積と重さ', grade: 3, theme: 'kagaku', regionId: 'kagaku', x: 780, y: 361 },
  { id: 'chem-04', label: '空気って重い？', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 838, y: 361 },
  { id: 'chem-05', label: '空気の性質', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 897, y: 361 },
  { id: 'chem-06', label: '空気は縮む！', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 956, y: 361 },
  { id: 'chem-07', label: '水は縮む？', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 956, y: 419 },
  { id: 'chem-08', label: 'あたためると', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 897, y: 419 },
  { id: 'chem-09', label: '水の三態変化', grade: 4, theme: 'kagaku', regionId: 'kagaku', x: 838, y: 419 },
  { id: 'chem-10', label: '水に入れよう', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 780, y: 419 },
  { id: 'chem-11', label: 'とけたものは', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 720, y: 419 },
  { id: 'chem-12', label: 'とけても重さ', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 661, y: 419 },
  { id: 'chem-13', label: 'どこまでとける', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 661, y: 479 },
  { id: 'chem-14', label: '温度で変わる？', grade: 5, theme: 'kagaku', regionId: 'kagaku', x: 720, y: 479 },
  { id: 'chem-15', label: 'ものが燃える！', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 780, y: 479 },
  { id: 'chem-16', label: '水溶液ってなんだ', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 838, y: 479 },
  { id: 'chem-17', label: '酸性？中性？', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 897, y: 479 },
  { id: 'chem-18', label: '水溶液と金属', grade: 6, theme: 'kagaku', regionId: 'kagaku', x: 956, y: 479 },
  { id: 'chigaku-01', label: 'かげを うごかそう', grade: 3, theme: 'chigaku', regionId: 'chigaku', x: 373, y: 378 },
  { id: 'chigaku-02', label: 'たいようを うごかそう', grade: 3, theme: 'chigaku', regionId: 'chigaku', x: 432, y: 378 },
  { id: 'chigaku-03', label: 'ひなたを さがそう', grade: 3, theme: 'chigaku', regionId: 'chigaku', x: 491, y: 378 },
  { id: 'chigaku-04', label: 'たいようを さがそう', grade: 3, theme: 'chigaku', regionId: 'chigaku', x: 549, y: 378 },
  { id: 'chigaku-05', label: 'つきを うごかそう', grade: 4, theme: 'chigaku', regionId: 'chigaku', x: 549, y: 437 },
  { id: 'chigaku-06', label: 'つきを 見つけよう', grade: 4, theme: 'chigaku', regionId: 'chigaku', x: 491, y: 437 },
  { id: 'chigaku-07', label: 'せいざを 作ろう', grade: 4, theme: 'chigaku', regionId: 'chigaku', x: 432, y: 437 },
  { id: 'chigaku-08', label: 'ほしの 明るさ', grade: 4, theme: 'chigaku', regionId: 'chigaku', x: 373, y: 437 },
  { id: 'chigaku-09', label: 'くもを うごかそう', grade: 5, theme: 'chigaku', regionId: 'chigaku', x: 373, y: 496 },
  { id: 'chigaku-10', label: 'くもと 天気', grade: 5, theme: 'chigaku', regionId: 'chigaku', x: 432, y: 496 },
  { id: 'chigaku-11', label: '天気よほう', grade: 5, theme: 'chigaku', regionId: 'chigaku', x: 491, y: 496 },
  { id: 'chigaku-12', label: '台風の しんろ', grade: 5, theme: 'chigaku', regionId: 'chigaku', x: 549, y: 496 },
  { id: 'chigaku-13', label: 'ちそうを ほろう', grade: 6, theme: 'chigaku', regionId: 'chigaku', x: 549, y: 554 },
  { id: 'chigaku-14', label: 'かせきを ほろう', grade: 6, theme: 'chigaku', regionId: 'chigaku', x: 491, y: 554 },
  { id: 'chigaku-15', label: '火山を 作ろう', grade: 6, theme: 'chigaku', regionId: 'chigaku', x: 432, y: 554 },
  { id: 'chigaku-16', label: '地しんの 前と 後', grade: 6, theme: 'chigaku', regionId: 'chigaku', x: 373, y: 554 },
  { id: 'seibutsu-01', label: '植物を そだてよう', grade: 3, theme: 'seibutsu', regionId: 'seibutsu', x: 378, y: 656 },
  { id: 'seibutsu-02', label: 'むしを 見つけよう', grade: 3, theme: 'seibutsu', regionId: 'seibutsu', x: 436, y: 656 },
  { id: 'seibutsu-03', label: 'はっぱを くらべよう', grade: 3, theme: 'seibutsu', regionId: 'seibutsu', x: 495, y: 656 },
  { id: 'seibutsu-04', label: 'すみかを 作ろう', grade: 3, theme: 'seibutsu', regionId: 'seibutsu', x: 555, y: 656 },
  { id: 'seibutsu-05', label: 'きせつの 植物', grade: 4, theme: 'seibutsu', regionId: 'seibutsu', x: 555, y: 714 },
  { id: 'seibutsu-06', label: 'きせつの 生きもの', grade: 4, theme: 'seibutsu', regionId: 'seibutsu', x: 495, y: 714 },
  { id: 'seibutsu-07', label: 'ヘチマを そだてよう', grade: 4, theme: 'seibutsu', regionId: 'seibutsu', x: 436, y: 714 },
  { id: 'seibutsu-08', label: 'せい長を くらべよう', grade: 4, theme: 'seibutsu', regionId: 'seibutsu', x: 378, y: 714 },
  { id: 'seibutsu-09', label: '魚の すみか', grade: 5, theme: 'seibutsu', regionId: 'seibutsu', x: 378, y: 773 },
  { id: 'seibutsu-10', label: 'せい長を たすけよう', grade: 5, theme: 'seibutsu', regionId: 'seibutsu', x: 436, y: 773 },
  { id: 'seibutsu-11', label: '花ふんを はこぼう', grade: 5, theme: 'seibutsu', regionId: 'seibutsu', x: 495, y: 773 },
  { id: 'seibutsu-12', label: '食べる・食べられる', grade: 5, theme: 'seibutsu', regionId: 'seibutsu', x: 555, y: 773 },
  { id: 'seibutsu-13', label: '体の中を たんけん', grade: 6, theme: 'seibutsu', regionId: 'seibutsu', x: 555, y: 833 },
  { id: 'seibutsu-14', label: '空気の とおり道', grade: 6, theme: 'seibutsu', regionId: 'seibutsu', x: 495, y: 833 },
  { id: 'seibutsu-15', label: 'けつえきを はこぼう', grade: 6, theme: 'seibutsu', regionId: 'seibutsu', x: 436, y: 833 },
  { id: 'seibutsu-16', label: '体を かんせいさせよう', grade: 6, theme: 'seibutsu', regionId: 'seibutsu', x: 378, y: 833 },
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
