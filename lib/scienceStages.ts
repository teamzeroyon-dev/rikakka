import type { QuizQuestion } from '@/lib/quizProblems'

// Interactive activities for the chigaku / seibutsu regions. Each stage in the
// spec is "触って動かす" first and quiz second, so every kind below is a real
// manipulation rather than a picture: the child changes something and the scene
// answers back. Coordinates are percentages of the activity board.
export type ActivityConfig =
  | {
      kind: 'slider-scene'
      scene: 'sun-shadow' | 'sun-sky' | 'sunny-spot' | 'moon-phase' | 'moon-sky' | 'fault'
      control: string
      steps: number
      /** Where the slider starts; must not already satisfy `goal`. Defaults to 0. */
      start?: number
      goal: number[]
      goalHint: string
    }
  | {
      kind: 'pick-spot'
      scene: 'shadow-sun' | 'park-bugs' | 'season-park'
      goalHint: string
      needed: number
      spots: { id: string; x: number; y: number; emoji: string; label: string; correct: boolean }[]
    }
  | {
      kind: 'order-cards'
      goalHint: string
      // Listed in the correct order; the board shuffles them for the child.
      cards: { id: string; emoji: string; label: string }[]
    }
  | {
      kind: 'place-targets'
      board: 'sky' | 'volcano' | 'pond' | 'forest' | 'plant' | 'body'
      goalHint: string
      slots: { id: string; x: number; y: number; label: string }[]
      tokens: { id: string; slotId: string; emoji: string; label: string }[]
    }
  | {
      kind: 'match-pairs'
      goalHint: string
      pairs: { id: string; left: { emoji: string; label: string }; right: { emoji: string; label: string } }[]
    }
  | {
      kind: 'drag-path'
      board: 'map' | 'garden' | 'flower' | 'body-digest' | 'body-air' | 'body-blood'
      goalHint: string
      mover: { emoji: string; label: string }
      stops: { id: string; x: number; y: number; emoji: string; label: string }[]
    }
  | {
      kind: 'dig-layers'
      goalHint: string
      question: string
      // Top of the ground first, deepest last.
      layers: { id: string; label: string; color: string; find?: string }[]
      answerId: string
    }

export type ScienceRegionId = 'chigaku' | 'seibutsu'

export type ScienceStage = {
  id: string
  index: number
  regionId: ScienceRegionId
  title: string
  curriculum: { code: string; unit: string }
  // The activity description straight from the spec, shown above the board.
  activityHint: string
  activity: ActivityConfig
  // Quoted verbatim from the spec sheet.
  learningLine: string
  normal: QuizQuestion
  easy: QuizQuestion
  retry: QuizQuestion
  clearLine: string
}

export const chigakuStages: ScienceStage[] = [
  {
    id: 'chigaku-01',
    index: 1,
    regionId: 'chigaku',
    title: '影を動かしてみよう',
    curriculum: { code: '理科 3年', unit: '太陽と地面のようす' },
    activityHint: '太陽を指で動かして、人や木の影が一番長くなるところを探す。',
    activity: {
      kind: 'slider-scene',
      scene: 'sun-shadow',
      control: 'たいようを うごかす',
      steps: 7,
      start: 3,
      goal: [0, 6],
      goalHint: 'かげが いちばん ながく なる ところを さがそう',
    },
    learningLine: '太陽の場所が変わると、陰の向きや長さも変わるんだよ！',
    normal: {
      prompt: '太陽が 空の 高い ところに あるとき、かげの ながさは どうなる？',
      choices: [{ id: 'A', text: 'みじかくなる' }, { id: 'B', text: 'ながくなる' }, { id: 'C', text: 'かわらない' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'かげは 太陽の 光が あたると できる？',
      choices: [{ id: 'A', text: 'できる' }, { id: 'B', text: 'できない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '太陽の ばしょが かわると、かげは どうなる？',
      choices: [{ id: 'A', text: 'むきや ながさが かわる' }, { id: 'B', text: 'ぜんぜん かわらない' }, { id: 'C', text: 'かげが きえる' }],
      correctId: 'A',
    },
    clearLine: '太陽の ばしょで、かげの むきも ながさも かわるんだね！',
  },
  {
    id: 'chigaku-02',
    index: 2,
    regionId: 'chigaku',
    title: '太陽を動かしてみよう',
    curriculum: { code: '理科 3年', unit: '太陽と地面のようす' },
    activityHint: '朝→昼→夜と太陽を動かし、午後の太陽の向きを答える。',
    activity: {
      kind: 'slider-scene',
      scene: 'sun-sky',
      control: 'じかんを すすめる',
      steps: 5,
      goal: [3],
      goalHint: 'ごごの たいようの ばしょまで すすめよう',
    },
    learningLine: '太陽は時間がたつと、動いているように見えるんだよ！',
    normal: {
      prompt: '太陽は 朝、どちらから のぼって くる？',
      choices: [{ id: 'A', text: '東' }, { id: 'B', text: '西' }, { id: 'C', text: '北' }],
      correctId: 'A',
    },
    easy: {
      prompt: '太陽は 時間が たつと 動いて 見える？',
      choices: [{ id: 'A', text: '動いて 見える' }, { id: 'B', text: 'ずっと 同じ ばしょ' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'お昼を すぎると、太陽は どちらへ すすんで いく？',
      choices: [{ id: 'A', text: '西のほう' }, { id: 'B', text: '東のほう' }, { id: 'C', text: 'うごかない' }],
      correctId: 'A',
    },
    clearLine: '太陽は 東から のぼって 西へ しずむんだね！',
  },
  {
    id: 'chigaku-03',
    index: 3,
    regionId: 'chigaku',
    title: '日向を探そう',
    curriculum: { code: '理科 3年', unit: '太陽と地面のようす' },
    activityHint: '太陽を動かすと公園の明るい場所が変化する。キャラクターが日向に立てるようにしよう。',
    activity: {
      kind: 'slider-scene',
      scene: 'sunny-spot',
      control: 'たいようを うごかす',
      steps: 7,
      goal: [3],
      goalHint: 'ひなたに 立てるように たいようを うごかそう',
    },
    learningLine: '太陽の場所によって、日なたになる場所と日かげになる場所が変わるんだよ！',
    normal: {
      prompt: '日なたと 日かげでは、どちらが あたたかい？',
      choices: [{ id: 'A', text: '日なた' }, { id: 'B', text: '日かげ' }, { id: 'C', text: 'どちらも 同じ' }],
      correctId: 'A',
    },
    easy: {
      prompt: '太陽の 光が あたって いる ところを なんと いう？',
      choices: [{ id: 'A', text: '日なた' }, { id: 'B', text: '日かげ' }],
      correctId: 'A',
    },
    retry: {
      prompt: '太陽の ばしょが かわると、日なたの ばしょは どうなる？',
      choices: [{ id: 'A', text: 'かわる' }, { id: 'B', text: 'ぜったいに かわらない' }, { id: 'C', text: 'なくなる' }],
      correctId: 'A',
    },
    clearLine: '太陽の ばしょで、日なたの ばしょも かわるんだね！',
  },
  {
    id: 'chigaku-04',
    index: 4,
    regionId: 'chigaku',
    title: '太陽を探そう',
    curriculum: { code: '理科 3年', unit: '太陽と地面のようす' },
    activityHint: '画面に人とその影がある。影の向きから太陽の位置を予想しよう。',
    activity: {
      kind: 'pick-spot',
      scene: 'shadow-sun',
      goalHint: 'かげの むきから、たいようの ばしょを えらぼう',
      needed: 1,
      spots: [
        { id: 'west', x: 16, y: 22, emoji: '☀️', label: '西の 空', correct: true },
        { id: 'top', x: 50, y: 12, emoji: '☀️', label: '真上', correct: false },
        { id: 'east', x: 84, y: 22, emoji: '☀️', label: '東の 空', correct: false },
        { id: 'ground', x: 84, y: 66, emoji: '☀️', label: '地めんの 下', correct: false },
      ],
    },
    learningLine: '影は太陽と反対の方向にできるんだよ！',
    normal: {
      prompt: 'かげが 東の ほうに のびて いるとき、太陽は どちらに ある？',
      choices: [{ id: 'A', text: '西' }, { id: 'B', text: '東' }, { id: 'C', text: '真上' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'かげは 太陽と どちらがわに できる？',
      choices: [{ id: 'A', text: 'はんたいがわ' }, { id: 'B', text: 'おなじ がわ' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'かげの むきを 見ると、何が わかる？',
      choices: [{ id: 'A', text: '太陽の ばしょ' }, { id: 'B', text: '風の つよさ' }, { id: 'C', text: '雨の りょう' }],
      correctId: 'A',
    },
    clearLine: 'かげの むきから、太陽の ばしょが わかるんだね！',
  },
  {
    id: 'chigaku-05',
    index: 5,
    regionId: 'chigaku',
    title: '月を動かしてみよう',
    curriculum: { code: '理科 4年', unit: '月と星' },
    activityHint: '太陽・地球・月を表示する。月を動かすと見える形が変わるので、満月を作ってみよう。',
    activity: {
      kind: 'slider-scene',
      scene: 'moon-phase',
      control: 'つきを うごかす',
      steps: 8,
      goal: [4],
      goalHint: 'まんげつに なる ばしょを さがそう',
    },
    learningLine: '月の場所が変わると、月の見える形も変わるんだよ！',
    normal: {
      prompt: '月の 見える 形が かわるのは なぜ？',
      choices: [
        { id: 'A', text: '太陽と 月の ばしょの かんけいが かわるから' },
        { id: 'B', text: '月が こわれて いくから' },
        { id: 'C', text: '月に 色を ぬって いるから' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '月の 形は、日に よって かわって 見える？',
      choices: [{ id: 'A', text: 'かわって 見える' }, { id: 'B', text: 'ずっと 同じ' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'まんまるに 見える 月を なんと いう？',
      choices: [{ id: 'A', text: '満月' }, { id: 'B', text: '三日月' }, { id: 'C', text: '半月' }],
      correctId: 'A',
    },
    clearLine: '月の ばしょが かわると、見える 形も かわるんだね！',
  },
  {
    id: 'chigaku-06',
    index: 6,
    regionId: 'chigaku',
    title: '月を見つけよう',
    curriculum: { code: '理科 4年', unit: '月と星' },
    activityHint: '時間を進めると月が少しずつ動く。月がどこに移動したのか見てみよう。',
    activity: {
      kind: 'slider-scene',
      scene: 'moon-sky',
      control: 'じかんを すすめる',
      steps: 5,
      goal: [4],
      goalHint: 'じかんを すすめて、つきが どこまで うごくか 見よう',
    },
    learningLine: '月は時間がたつと、少しずつ場所が変わって見えるんだよ！',
    normal: {
      prompt: '時間が たつと、月は どう 見える？',
      choices: [
        { id: 'A', text: '少しずつ ばしょが かわる' },
        { id: 'B', text: 'ずっと 同じ ばしょに ある' },
        { id: 'C', text: 'きえて しまう' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '月は 空を 動いて 見える？',
      choices: [{ id: 'A', text: '動いて 見える' }, { id: 'B', text: '動かない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '東の 空に 出た 月は、この あと どちらへ すすむ？',
      choices: [{ id: 'A', text: '西のほう' }, { id: 'B', text: '東のほう' }, { id: 'C', text: 'うごかない' }],
      correctId: 'A',
    },
    clearLine: '月も 時間が たつと、ばしょが かわって いくんだね！',
  },
  {
    id: 'chigaku-07',
    index: 7,
    regionId: 'chigaku',
    title: '星を並べて星座を作ろう',
    curriculum: { code: '理科 4年', unit: '月と星' },
    activityHint: '星をドラッグして正しい位置に置くと、線がつながって星座が完成する。',
    activity: {
      kind: 'place-targets',
      board: 'sky',
      goalHint: 'ほしを ばんごうの ばしょに おいて、せいざを かんせいさせよう',
      slots: [
        { id: 's1', x: 22, y: 62, label: '①' },
        { id: 's2', x: 38, y: 34, label: '②' },
        { id: 's3', x: 56, y: 22, label: '③' },
        { id: 's4', x: 72, y: 40, label: '④' },
        { id: 's5', x: 82, y: 68, label: '⑤' },
      ],
      tokens: [
        { id: 't1', slotId: 's1', emoji: '⭐', label: '①' },
        { id: 't2', slotId: 's2', emoji: '⭐', label: '②' },
        { id: 't3', slotId: 's3', emoji: '🌟', label: '③' },
        { id: 't4', slotId: 's4', emoji: '⭐', label: '④' },
        { id: 't5', slotId: 's5', emoji: '⭐', label: '⑤' },
      ],
    },
    learningLine: '星はバラバラに見えても、決まった並び方をしているものがあるんだよ！',
    normal: {
      prompt: '星ざとは 何の こと？',
      choices: [
        { id: 'A', text: '星の ならびに 名前を つけた もの' },
        { id: 'B', text: 'とても 大きな 星 ひとつ' },
        { id: 'C', text: '月の べつの 名前' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '星には、きまった ならび方を して いる ものが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '星ざの 星の ならび方は、日に よって どうなる？',
      choices: [{ id: 'A', text: 'ほとんど かわらない' }, { id: 'B', text: '毎日 バラバラに なる' }, { id: 'C', text: 'なくなる' }],
      correctId: 'A',
    },
    clearLine: '星は きまった ならび方を して いるんだね！',
  },
  {
    id: 'chigaku-08',
    index: 8,
    regionId: 'chigaku',
    title: '星を明るい順に並べよう',
    curriculum: { code: '理科 4年', unit: '月と星' },
    activityHint: '星を明るい順番に並べてみよう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'あかるい ほしから じゅんばんに ならべよう',
      cards: [
        { id: 'm1', emoji: '🌟', label: '1等星' },
        { id: 'm2', emoji: '⭐', label: '2等星' },
        { id: 'm3', emoji: '✨', label: '3等星' },
        { id: 'm4', emoji: '·', label: '4等星' },
      ],
    },
    learningLine: '星には、明るく見える星や暗く見える星があるんだよ！',
    normal: {
      prompt: '星の 明るさに ついて、正しいのは どれ？',
      choices: [
        { id: 'A', text: '明るい 星と くらい 星が ある' },
        { id: 'B', text: 'ぜんぶ 同じ 明るさ' },
        { id: 'C', text: '星は 光って いない' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '星には 明るさの ちがいが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '1等星と 2等星、明るく 見えるのは どっち？',
      choices: [{ id: 'A', text: '1等星' }, { id: 'B', text: '2等星' }, { id: 'C', text: 'どちらも 同じ' }],
      correctId: 'A',
    },
    clearLine: '星に よって 明るさが ちがうんだね！',
  },
  {
    id: 'chigaku-09',
    index: 9,
    regionId: 'chigaku',
    title: '雲を動かしてみよう',
    curriculum: { code: '理科 5年', unit: '天気の変化' },
    activityHint: '地図上の雲をドラッグして動かし、あしたはどこに雨が降るのか予想しよう。',
    activity: {
      kind: 'drag-path',
      board: 'map',
      goalHint: 'くもを にしから ひがしへ はこんで、あめが ふる まちを 見つけよう',
      mover: { emoji: '☁️', label: '雲' },
      stops: [
        { id: 'w', x: 20, y: 45, emoji: '🏘️', label: '西の まち' },
        { id: 'c', x: 50, y: 40, emoji: '🏙️', label: 'まんなかの まち' },
        { id: 'e', x: 80, y: 45, emoji: '🏡', label: '東の まち' },
      ],
    },
    learningLine: '雲は動いていて、雲の動きによって天気が変わることがあるんだよ！',
    normal: {
      prompt: '天気が かわって いくのは なぜ？',
      choices: [{ id: 'A', text: '雲が 動いて いくから' }, { id: 'B', text: '山が 動くから' }, { id: 'C', text: '星が ふえるから' }],
      correctId: 'A',
    },
    easy: {
      prompt: '雲は 動く？',
      choices: [{ id: 'A', text: '動く' }, { id: 'B', text: '動かない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '雲の 動く むきが わかると、何が できる？',
      choices: [{ id: 'A', text: '天気の よそう' }, { id: 'B', text: '地しんの よそう' }, { id: 'C', text: '星の かんさつ' }],
      correctId: 'A',
    },
    clearLine: '雲の 動きで 天気が かわって いくんだね！',
  },
  {
    id: 'chigaku-10',
    index: 10,
    regionId: 'chigaku',
    title: '雲と天気を組み合わせよう',
    curriculum: { code: '理科 5年', unit: '天気の変化' },
    activityHint: '雲の種類・様子を見て、そのときの天気を組み合わせよう。',
    activity: {
      kind: 'match-pairs',
      goalHint: 'くもと そのときの てんきを くみあわせよう',
      pairs: [
        { id: 'p1', left: { emoji: '🌫️', label: 'そらを おおう くろい 雲' }, right: { emoji: '🌧️', label: '雨が ふりそう' } },
        { id: 'p2', left: { emoji: '🌤️', label: '白くて 小さい 雲' }, right: { emoji: '☀️', label: 'はれ' } },
        { id: 'p3', left: { emoji: '⛈️', label: 'もくもく 大きい 入道雲' }, right: { emoji: '⚡', label: '夕立や かみなり' } },
      ],
    },
    learningLine: '空の雲を見ると、雨が降りそうか予想できることがあるよ！',
    normal: {
      prompt: 'くろっぽい 雲が 空を おおって いる とき、天気は どうなりそう？',
      choices: [{ id: 'A', text: '雨が ふりそう' }, { id: 'B', text: 'かならず はれる' }, { id: 'C', text: 'かならず 雪に なる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '雲の ようすで、天気を よそう できる ことが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '白くて 小さい 雲が すこしだけ ある 空。天気は どうなりそう？',
      choices: [{ id: 'A', text: 'はれ' }, { id: 'B', text: '大雨' }, { id: 'C', text: '台風' }],
      correctId: 'A',
    },
    clearLine: '雲を 見ると、天気が よそう できるんだね！',
  },
  {
    id: 'chigaku-11',
    index: 11,
    regionId: 'chigaku',
    title: '天気予報を完成させよう',
    curriculum: { code: '理科 5年', unit: '天気の変化' },
    activityHint: '晴れ・曇り・雨をドラッグして、予想した天気を時間順に並べよう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'てんきが かわって いく じゅんばんに ならべよう',
      cards: [
        { id: 'w1', emoji: '☀️', label: 'あさ／はれ' },
        { id: 'w2', emoji: '⛅', label: 'ひる／くもり' },
        { id: 'w3', emoji: '🌧️', label: 'ゆうがた／雨' },
      ],
    },
    learningLine: '天気は変わっていくから、明日の天気を予想することができるんだよ！',
    normal: {
      prompt: '天気よほうは、何を して いる？',
      choices: [
        { id: 'A', text: 'これからの 天気を よそう する' },
        { id: 'B', text: 'きのうの 天気を きめる' },
        { id: 'C', text: '雲を 作って いる' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '天気は かわって いく？',
      choices: [{ id: 'A', text: 'かわって いく' }, { id: 'B', text: 'ずっと 同じ' }],
      correctId: 'A',
    },
    retry: {
      prompt: '天気よほうが あたる ことが あるのは なぜ？',
      choices: [
        { id: 'A', text: '雲の 動き方に きまりが あるから' },
        { id: 'B', text: 'まぐれ だから' },
        { id: 'C', text: '天気は かわらないから' },
      ],
      correctId: 'A',
    },
    clearLine: '天気の かわり方が わかると、よそう できるんだね！',
  },
  {
    id: 'chigaku-12',
    index: 12,
    regionId: 'chigaku',
    title: '台風の進路を予想しよう',
    curriculum: { code: '理科 5年', unit: '天気の変化' },
    activityHint: '台風の進路をたどって、この後どのように進んでいくのか予想しよう。',
    activity: {
      kind: 'drag-path',
      board: 'map',
      goalHint: 'たいふうを みなみから きたひがしへ すすめよう',
      mover: { emoji: '🌀', label: '台風' },
      stops: [
        { id: 's', x: 30, y: 78, emoji: '🏝️', label: '南の 海' },
        { id: 'm', x: 52, y: 52, emoji: '🗾', label: '本州の 南' },
        { id: 'n', x: 76, y: 26, emoji: '🧭', label: '北東の 海' },
      ],
    },
    learningLine: '台風がどこへ進むかを知ると、安全に過ごすための準備ができるよ！',
    normal: {
      prompt: '台風の しんろを 知ると、何が できる？',
      choices: [
        { id: 'A', text: 'あんぜんに すごす じゅんび' },
        { id: 'B', text: '台風を けす こと' },
        { id: 'C', text: '天気を きめる こと' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '台風は 動く？',
      choices: [{ id: 'A', text: '動く' }, { id: 'B', text: '動かない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '台風が 近づく 前に する ことは？',
      choices: [{ id: 'A', text: 'あんぜんの じゅんびを する' }, { id: 'B', text: '外で あそぶ' }, { id: 'C', text: '何も しない' }],
      correctId: 'A',
    },
    clearLine: '台風の しんろを 知って、あんぜんの じゅんびが できるんだね！',
  },
  {
    id: 'chigaku-13',
    index: 13,
    regionId: 'chigaku',
    title: '地層を掘ってみよう',
    curriculum: { code: '理科 6年', unit: '土地のつくりと変化' },
    activityHint: '土を掘ると地層が出てくる。一番古い地層を選ぼう。',
    activity: {
      kind: 'dig-layers',
      goalHint: 'タップして ほって、ちそうを ぜんぶ 見つけよう',
      question: 'いちばん 古い ちそうは どれ？',
      layers: [
        { id: 'l1', label: 'くろい 土', color: '#7b5c3a' },
        { id: 'l2', label: 'すなの そう', color: '#d8bd85' },
        { id: 'l3', label: 'どろの そう', color: '#9c8567' },
        { id: 'l4', label: 'れき（小石）の そう', color: '#a8a29b' },
      ],
      answerId: 'l4',
    },
    learningLine: '地面の下には、いろいろな土や石が重なっているんだよ！',
    normal: {
      prompt: 'かさなって いる 地そうで、いちばん 古いのは どこ？',
      choices: [{ id: 'A', text: 'いちばん 下' }, { id: 'B', text: 'いちばん 上' }, { id: 'C', text: 'まんなか' }],
      correctId: 'A',
    },
    easy: {
      prompt: '地めんの 下には、土や 石が かさなって いる？',
      choices: [{ id: 'A', text: 'かさなって いる' }, { id: 'B', text: 'かさなって いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '上の ほうに ある 地そうは、下の ほうと くらべて どう？',
      choices: [{ id: 'A', text: 'あたらしい' }, { id: 'B', text: 'もっと 古い' }, { id: 'C', text: '同じ とき に できた' }],
      correctId: 'A',
    },
    clearLine: '地そうは、下に ある ほど 古いんだね！',
  },
  {
    id: 'chigaku-14',
    index: 14,
    regionId: 'chigaku',
    title: '化石を発掘しよう',
    curriculum: { code: '理科 6年', unit: '土地のつくりと変化' },
    activityHint: '地層を掘って化石を探す。見つけた化石から、昔ここはどんな場所だったのか考えよう。',
    activity: {
      kind: 'dig-layers',
      goalHint: 'タップして ほって、かせきを さがそう',
      question: '貝の かせきが 出て きた そうは どれ？',
      layers: [
        { id: 'f1', label: 'くろい 土', color: '#7b5c3a' },
        { id: 'f2', label: 'すなの そう', color: '#d8bd85', find: '🐚' },
        { id: 'f3', label: 'どろの そう', color: '#9c8567' },
        { id: 'f4', label: 'かたい 岩', color: '#8d8f93' },
      ],
      answerId: 'f2',
    },
    learningLine: '化石を調べると、むかし、そこにどんな生き物がいたのかわかるんだよ！',
    normal: {
      prompt: '貝の 化石が 見つかった ところは、むかし どんな 場所だった？',
      choices: [{ id: 'A', text: '海や 水の 中' }, { id: 'B', text: '高い 山の いただき' }, { id: 'C', text: 'さばく' }],
      correctId: 'A',
    },
    easy: {
      prompt: '化石を しらべると、むかしの 生きものが わかる？',
      choices: [{ id: 'A', text: 'わかる' }, { id: 'B', text: 'わからない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '化石から わかる ことは？',
      choices: [{ id: 'A', text: 'むかし そこに いた 生きもの' }, { id: 'B', text: 'あしたの 天気' }, { id: 'C', text: '星の 明るさ' }],
      correctId: 'A',
    },
    clearLine: '化石から、むかしの ようすが わかるんだね！',
  },
  {
    id: 'chigaku-15',
    index: 15,
    regionId: 'chigaku',
    title: '火山を作ろう',
    curriculum: { code: '理科 6年', unit: '土地のつくりと変化' },
    activityHint: 'マグマ、火山灰などを正しい位置に配置して、火山の断面を完成させよう。',
    activity: {
      kind: 'place-targets',
      board: 'volcano',
      goalHint: 'かざんの ぶひんを ただしい ばしょに おこう',
      slots: [
        { id: 'ash', x: 52, y: 12, label: '空' },
        { id: 'crater', x: 50, y: 34, label: '山の てっぺん' },
        { id: 'lava', x: 70, y: 56, label: '山の しゃめん' },
        { id: 'magma', x: 50, y: 82, label: '地めんの ずっと 下' },
      ],
      tokens: [
        { id: 'v-ash', slotId: 'ash', emoji: '🌫️', label: '火山ばい' },
        { id: 'v-crater', slotId: 'crater', emoji: '🌋', label: '火口' },
        { id: 'v-lava', slotId: 'lava', emoji: '🔥', label: 'ようがん' },
        { id: 'v-magma', slotId: 'magma', emoji: '🟠', label: 'マグマだまり' },
      ],
    },
    learningLine: '火山が噴火すると、溶岩や火山灰によって土地のようすが変わるんだよ！',
    normal: {
      prompt: '火山が ふん火すると、土地は どうなる？',
      choices: [
        { id: 'A', text: 'ようがんや 火山ばいで ようすが かわる' },
        { id: 'B', text: '何も かわらない' },
        { id: 'C', text: '土地が きえて なくなる' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '火山が ふん火すると、土地の ようすは かわる？',
      choices: [{ id: 'A', text: 'かわる' }, { id: 'B', text: 'かわらない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '火山から ふき出して くる ものは どれ？',
      choices: [{ id: 'A', text: 'ようがんや 火山ばい' }, { id: 'B', text: '雨と 雪' }, { id: 'C', text: '星' }],
      correctId: 'A',
    },
    clearLine: '火山の ふん火で、土地の ようすが かわるんだね！',
  },
  {
    id: 'chigaku-16',
    index: 16,
    regionId: 'chigaku',
    title: '地震の前後を比べよう',
    curriculum: { code: '理科 6年', unit: '土地のつくりと変化' },
    activityHint: '地面を指で動かすと断層がずれて土地が変化する。地震の前後で何が変わったのか確かめよう。',
    activity: {
      kind: 'slider-scene',
      scene: 'fault',
      control: 'じめんを うごかす',
      steps: 6,
      goal: [5],
      goalHint: 'じめんを うごかして、だんそうを ずらして みよう',
    },
    learningLine: '地震が起きると、地面が動いて土地の形が変わることがあるんだよ！',
    normal: {
      prompt: '地しんが おきると、土地は どうなる ことが ある？',
      choices: [
        { id: 'A', text: '地めんが 動いて 形が かわる' },
        { id: 'B', text: 'ぜったいに かわらない' },
        { id: 'C', text: '土地が ふえる' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '地しんで 地めんが 動く ことが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '地しんの あとに 見られる、ずれた 地そうを なんと いう？',
      choices: [{ id: 'A', text: '断層' }, { id: 'B', text: '化石' }, { id: 'C', text: 'ようがん' }],
      correctId: 'A',
    },
    clearLine: '地しんで、土地の 形が かわる ことが あるんだね！',
  },
]

export const seibutsuStages: ScienceStage[] = [
  {
    id: 'seibutsu-01',
    index: 1,
    regionId: 'seibutsu',
    title: '植物を育てよう',
    curriculum: { code: '理科 3年', unit: '身の回りの生物' },
    activityHint: '植物とじょうろを画面に配置。じょうろをドラッグして水やりしよう。',
    activity: {
      kind: 'drag-path',
      board: 'garden',
      goalHint: 'じょうろを はこんで、ぜんぶの しょくぶつに 水を あげよう',
      mover: { emoji: '🪣', label: 'じょうろ' },
      stops: [
        { id: 'p1', x: 24, y: 62, emoji: '🌱', label: 'ふたば' },
        { id: 'p2', x: 50, y: 58, emoji: '🌿', label: 'わかば' },
        { id: 'p3', x: 76, y: 62, emoji: '🌼', label: 'つぼみ' },
      ],
    },
    learningLine: '植物は水などを使って大きく育つんだよ！',
    normal: {
      prompt: '植物が 大きく そだつ ために ひつような ものは どれ？',
      choices: [{ id: 'A', text: '水' }, { id: 'B', text: 'じしゃく' }, { id: 'C', text: 'こおり' }],
      correctId: 'A',
    },
    easy: {
      prompt: '植物に 水を あげると そだつ？',
      choices: [{ id: 'A', text: 'そだつ' }, { id: 'B', text: 'そだたない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水を あげないと、植物は どうなる？',
      choices: [{ id: 'A', text: '元気が なくなる' }, { id: 'B', text: 'もっと 大きく なる' }, { id: 'C', text: '何も かわらない' }],
      correctId: 'A',
    },
    clearLine: '植物は 水を つかって 大きく そだつんだね！',
  },
  {
    id: 'seibutsu-02',
    index: 2,
    regionId: 'seibutsu',
    title: '虫を見つけよう',
    curriculum: { code: '理科 3年', unit: '昆虫と植物' },
    activityHint: '草や葉っぱを動かして、かくれている虫を探そう。',
    activity: {
      kind: 'pick-spot',
      scene: 'park-bugs',
      goalHint: 'くさや はっぱを タップして、むしを 3びき 見つけよう',
      needed: 3,
      spots: [
        { id: 'b1', x: 18, y: 58, emoji: '🐞', label: 'テントウムシ', correct: true },
        { id: 'b2', x: 40, y: 72, emoji: '🌿', label: 'くさだけ', correct: false },
        { id: 'b3', x: 58, y: 48, emoji: '🦋', label: 'モンシロチョウ', correct: true },
        { id: 'b4', x: 78, y: 66, emoji: '🦗', label: 'バッタ', correct: true },
        { id: 'b5', x: 66, y: 82, emoji: '🍃', label: 'はっぱだけ', correct: false },
      ],
    },
    learningLine: '虫はいろいろな場所にいて、それぞれ違った体のつくりをしているんだよ！',
    normal: {
      prompt: 'こん虫の あしは 何本？',
      choices: [{ id: 'A', text: '6本' }, { id: 'B', text: '4本' }, { id: 'C', text: '8本' }],
      correctId: 'A',
    },
    easy: {
      prompt: '虫は いろいろな ばしょに いる？',
      choices: [{ id: 'A', text: 'いる' }, { id: 'B', text: 'いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'こん虫の からだは、いくつに 分かれて いる？',
      choices: [{ id: 'A', text: '3つ（頭・むね・はら）' }, { id: 'B', text: '1つ' }, { id: 'C', text: '5つ' }],
      correctId: 'A',
    },
    clearLine: '虫に よって、からだの つくりが ちがうんだね！',
  },
  {
    id: 'seibutsu-03',
    index: 3,
    regionId: 'seibutsu',
    title: '葉っぱを比べよう',
    curriculum: { code: '理科 3年', unit: '身の回りの生物' },
    activityHint: '同じ仲間の葉っぱを見つけて、隣に並べてみよう。',
    activity: {
      kind: 'match-pairs',
      goalHint: 'はっぱと おなじ なかまの しょくぶつを くみあわせよう',
      pairs: [
        { id: 'lp1', left: { emoji: '🍁', label: 'ぎざぎざの 葉' }, right: { emoji: '🍂', label: 'カエデ' } },
        { id: 'lp2', left: { emoji: '🍀', label: 'まるい 葉が 3まい' }, right: { emoji: '☘️', label: 'シロツメクサ' } },
        { id: 'lp3', left: { emoji: '🌾', label: 'ほそながい 葉' }, right: { emoji: '🌾', label: 'イネ' } },
      ],
    },
    learningLine: '植物にはいろいろな種類があって、葉っぱの形も違うんだよ！',
    normal: {
      prompt: '葉っぱの 形に ついて、正しいのは どれ？',
      choices: [
        { id: 'A', text: 'しゅるいに よって ちがう' },
        { id: 'B', text: 'ぜんぶ 同じ 形' },
        { id: 'C', text: '葉っぱに 形は ない' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '植物の 葉っぱの 形は、しゅるいで ちがう？',
      choices: [{ id: 'A', text: 'ちがう' }, { id: 'B', text: '同じ' }],
      correctId: 'A',
    },
    retry: {
      prompt: '同じ なかまの 植物の 葉っぱは どう なって いる？',
      choices: [{ id: 'A', text: 'よく にて いる' }, { id: 'B', text: 'まったく ちがう' }, { id: 'C', text: '葉が 生えない' }],
      correctId: 'A',
    },
    clearLine: '葉っぱの 形で、植物の しゅるいが 分かるんだね！',
  },
  {
    id: 'seibutsu-04',
    index: 4,
    regionId: 'seibutsu',
    title: '生き物のすみかを作ろう',
    curriculum: { code: '理科 3年', unit: '身の回りの生物' },
    activityHint: '水、草、石などを動かして、その生き物に合ったすみかを作ってあげよう。',
    activity: {
      kind: 'place-targets',
      board: 'forest',
      goalHint: 'ダンゴムシが すみやすい ばしょを つくろう',
      slots: [
        { id: 'f-stone', x: 26, y: 62, label: 'じめんの うえ' },
        { id: 'f-leaf', x: 52, y: 72, label: '石の まわり' },
        { id: 'f-wet', x: 76, y: 60, label: 'かげに なる ところ' },
      ],
      tokens: [
        { id: 'k-stone', slotId: 'f-stone', emoji: '🪨', label: '石' },
        { id: 'k-leaf', slotId: 'f-leaf', emoji: '🍂', label: 'おちば' },
        { id: 'k-wet', slotId: 'f-wet', emoji: '💧', label: 'しめった 土' },
      ],
    },
    learningLine: '生き物は、それぞれ暮らしやすい場所が違うんだよ！',
    normal: {
      prompt: 'ダンゴムシが すきな ばしょは どこ？',
      choices: [
        { id: 'A', text: '石の 下の しめった ところ' },
        { id: 'B', text: 'あつい すなの うえ' },
        { id: 'C', text: '空の うえ' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '生きものに よって、すみやすい ばしょは ちがう？',
      choices: [{ id: 'A', text: 'ちがう' }, { id: 'B', text: 'みんな 同じ' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'すみかを 作る とき、大切な ことは 何？',
      choices: [
        { id: 'A', text: 'その 生きものに あった かんきょうに する' },
        { id: 'B', text: 'すきな 色に する' },
        { id: 'C', text: 'できるだけ せまく する' },
      ],
      correctId: 'A',
    },
    clearLine: '生きものに よって、すみやすい ばしょが ちがうんだね！',
  },
  {
    id: 'seibutsu-05',
    index: 5,
    regionId: 'seibutsu',
    title: '季節の植物を並べよう',
    curriculum: { code: '理科 4年', unit: '季節と生物' },
    activityHint: '植物のカードを、季節の順に並び替えよう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'はるから じゅんばんに ならべよう',
      cards: [
        { id: 'sp', emoji: '🌸', label: '春／花が さく' },
        { id: 'su', emoji: '🌳', label: '夏／葉が しげる' },
        { id: 'au', emoji: '🍁', label: '秋／葉が 赤く なる' },
        { id: 'wi', emoji: '🌲', label: '冬／葉が おちる' },
      ],
    },
    learningLine: '植物は季節によって成長したり姿を変えたりするんだよ！',
    normal: {
      prompt: 'サクラの 葉が 赤や 黄色に なるのは いつ？',
      choices: [{ id: 'A', text: '秋' }, { id: 'B', text: '春' }, { id: 'C', text: '夏' }],
      correctId: 'A',
    },
    easy: {
      prompt: '植物は、きせつに よって すがたが かわる？',
      choices: [{ id: 'A', text: 'かわる' }, { id: 'B', text: 'かわらない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '春に なると、植物は どうなる？',
      choices: [
        { id: 'A', text: 'めを 出して そだち はじめる' },
        { id: 'B', text: 'ぜんぶ かれて しまう' },
        { id: 'C', text: '何も おきない' },
      ],
      correctId: 'A',
    },
    clearLine: '植物は きせつに よって すがたを かえるんだね！',
  },
  {
    id: 'seibutsu-06',
    index: 6,
    regionId: 'seibutsu',
    title: '季節の生き物を探そう',
    curriculum: { code: '理科 4年', unit: '季節と生物' },
    activityHint: '公園の中から、その季節に活動する生き物を選ぼう。',
    activity: {
      kind: 'pick-spot',
      scene: 'season-park',
      goalHint: 'なつに かつどうする 生きものを 2ひき えらぼう',
      needed: 2,
      spots: [
        { id: 's-semi', x: 24, y: 40, emoji: '🪰', label: 'セミ', correct: true },
        { id: 's-kabuto', x: 52, y: 58, emoji: '🪲', label: 'カブトムシ', correct: true },
        { id: 's-yuki', x: 76, y: 40, emoji: '❄️', label: 'ゆきの けっしょう', correct: false },
        { id: 's-momiji', x: 40, y: 76, emoji: '🍁', label: 'もみじ', correct: false },
      ],
    },
    learningLine: '生き物の活動は季節によって変わるんだよ！',
    normal: {
      prompt: 'セミが たくさん 鳴くのは いつ？',
      choices: [{ id: 'A', text: '夏' }, { id: 'B', text: '冬' }, { id: 'C', text: '秋' }],
      correctId: 'A',
    },
    easy: {
      prompt: '生きものの かつどうは、きせつで かわる？',
      choices: [{ id: 'A', text: 'かわる' }, { id: 'B', text: 'かわらない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '冬に なると 見かける 虫が へるのは なぜ？',
      choices: [
        { id: 'A', text: 'さむさで かつどうが へるから' },
        { id: 'B', text: '虫が 空へ とんで いくから' },
        { id: 'C', text: '虫が 大きく なるから' },
      ],
      correctId: 'A',
    },
    clearLine: '生きものの かつどうは、きせつで かわるんだね！',
  },
  {
    id: 'seibutsu-07',
    index: 7,
    regionId: 'seibutsu',
    title: 'ヘチマを育てよう',
    curriculum: { code: '理科 4年', unit: '季節と生物' },
    activityHint: '種から実まで、大きくなる順番に並べよう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'たねから じゅんばんに ならべよう',
      cards: [
        { id: 'h1', emoji: '🌰', label: 'たね' },
        { id: 'h2', emoji: '🌱', label: 'め' },
        { id: 'h3', emoji: '🌼', label: '花' },
        { id: 'h4', emoji: '🥒', label: 'み' },
      ],
    },
    learningLine: '植物は種から芽を出して成長し花や実をつけるんだよ！',
    normal: {
      prompt: 'ヘチマは どの じゅんばんで そだつ？',
      choices: [
        { id: 'A', text: 'たね → め → 花 → み' },
        { id: 'B', text: 'み → 花 → め → たね' },
        { id: 'C', text: '花 → たね → み → め' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '植物は たねから めを 出す？',
      choices: [{ id: 'A', text: '出す' }, { id: 'B', text: '出さない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '花が さいた あと、そこに できる ものは？',
      choices: [{ id: 'A', text: 'みや たね' }, { id: 'B', text: 'あたらしい 根' }, { id: 'C', text: '何も できない' }],
      correctId: 'A',
    },
    clearLine: '植物は たねから そだって、花や みを つけるんだね！',
  },
  {
    id: 'seibutsu-08',
    index: 8,
    regionId: 'seibutsu',
    title: '生き物の成長を比べよう',
    curriculum: { code: '理科 3年', unit: '昆虫と植物' },
    activityHint: '卵から成虫まで、大きくなる順番に並べよう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'たまごから じゅんばんに ならべよう',
      cards: [
        { id: 'c1', emoji: '🥚', label: 'たまご' },
        { id: 'c2', emoji: '🐛', label: 'よう虫' },
        { id: 'c3', emoji: '🪺', label: 'さなぎ' },
        { id: 'c4', emoji: '🦋', label: 'せい虫' },
      ],
    },
    learningLine: '生き物は成長すると体の形が変わるものもいるんだよ！',
    normal: {
      prompt: 'モンシロチョウは どの じゅんばんで そだつ？',
      choices: [
        { id: 'A', text: 'たまご → よう虫 → さなぎ → せい虫' },
        { id: 'B', text: 'たまご → さなぎ → よう虫 → せい虫' },
        { id: 'C', text: 'せい虫 → たまご → よう虫 → さなぎ' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: 'そだつと からだの 形が かわる 生きものが いる？',
      choices: [{ id: 'A', text: 'いる' }, { id: 'B', text: 'いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'さなぎに ならずに せい虫に なる 虫も いる？',
      choices: [{ id: 'A', text: 'いる' }, { id: 'B', text: 'いない' }, { id: 'C', text: '虫は そだたない' }],
      correctId: 'A',
    },
    clearLine: '生きものは そだつと、からだの 形が かわる ものが いるんだね！',
  },
  {
    id: 'seibutsu-09',
    index: 9,
    regionId: 'seibutsu',
    title: '魚のすみかを作ろう',
    curriculum: { code: '理科 5年', unit: '生命のつながり' },
    activityHint: '水草、石、魚などを好きな場所に配置して、水そうを作ろう。',
    activity: {
      kind: 'place-targets',
      board: 'pond',
      goalHint: 'メダカが すみやすい 水そうを つくろう',
      slots: [
        { id: 'w-plant', x: 24, y: 58, label: '水そうの ひだり' },
        { id: 'w-stone', x: 50, y: 76, label: '水そうの そこ' },
        { id: 'w-fish', x: 74, y: 46, label: '水の 中' },
      ],
      tokens: [
        { id: 'w-t1', slotId: 'w-plant', emoji: '🌿', label: '水草' },
        { id: 'w-t2', slotId: 'w-stone', emoji: '🪨', label: '石' },
        { id: 'w-t3', slotId: 'w-fish', emoji: '🐟', label: 'メダカ' },
      ],
    },
    learningLine: '生き物は周りの環境とかかわりながら暮らしているんだよ！',
    normal: {
      prompt: 'メダカが すみやすい 水そうは どれ？',
      choices: [
        { id: 'A', text: '水草や 石が あって きれいな 水' },
        { id: 'B', text: '水だけ で まっくら' },
        { id: 'C', text: '水が 入って いない' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '生きものは まわりの かんきょうと かかわって いる？',
      choices: [{ id: 'A', text: 'かかわって いる' }, { id: 'B', text: 'かかわって いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水草は メダカに とって どんな やくわり？',
      choices: [
        { id: 'A', text: 'かくれ場や たまごを うむ ばしょ' },
        { id: 'B', text: 'ただの ゴミ' },
        { id: 'C', text: '水を へらす もの' },
      ],
      correctId: 'A',
    },
    clearLine: '生きものは、まわりの かんきょうと かかわって くらして いるんだね！',
  },
  {
    id: 'seibutsu-10',
    index: 10,
    regionId: 'seibutsu',
    title: '植物の成長を助けよう',
    curriculum: { code: '理科 5年', unit: '植物の発芽と成長' },
    activityHint: '水、日光、空気などをドラッグして、植物のまわりに置こう。',
    activity: {
      kind: 'place-targets',
      board: 'plant',
      goalHint: 'しょくぶつが そだつのに ひつような ものを おいて あげよう',
      slots: [
        { id: 'g-sun', x: 24, y: 22, label: '空の うえ' },
        { id: 'g-air', x: 76, y: 32, label: '植物の まわり' },
        { id: 'g-water', x: 50, y: 78, label: '根もとの 土' },
      ],
      tokens: [
        { id: 'g-t1', slotId: 'g-sun', emoji: '☀️', label: '日光' },
        { id: 'g-t2', slotId: 'g-air', emoji: '💨', label: '空気' },
        { id: 'g-t3', slotId: 'g-water', emoji: '💧', label: '水' },
      ],
    },
    learningLine: '植物は日光や水などを利用して成長しているんだよ！',
    normal: {
      prompt: '植物が そだつ ために ひつような ものは どれ？',
      choices: [
        { id: 'A', text: '日光と 水と 空気' },
        { id: 'B', text: 'こおりと 音' },
        { id: 'C', text: 'じしゃく' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '植物は 日光を つかって そだつ？',
      choices: [{ id: 'A', text: 'つかう' }, { id: 'B', text: 'つかわない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '日光の あたらない ところに おいた 植物は どうなる？',
      choices: [{ id: 'A', text: 'よく そだたない' }, { id: 'B', text: 'もっと 早く そだつ' }, { id: 'C', text: '何も かわらない' }],
      correctId: 'A',
    },
    clearLine: '植物は 日光や 水を つかって そだって いるんだね！',
  },
  {
    id: 'seibutsu-11',
    index: 11,
    regionId: 'seibutsu',
    title: '花粉を運ぼう',
    curriculum: { code: '理科 5年', unit: '植物の実や種子' },
    activityHint: 'ハチを指で動かして、花から花へ運ぼう。',
    activity: {
      kind: 'drag-path',
      board: 'flower',
      goalHint: 'ハチを うごかして、ぜんぶの 花に かふんを はこぼう',
      mover: { emoji: '🐝', label: 'ハチ' },
      stops: [
        { id: 'fl1', x: 20, y: 62, emoji: '🌻', label: '1つめの 花' },
        { id: 'fl2', x: 50, y: 44, emoji: '🌺', label: '2つめの 花' },
        { id: 'fl3', x: 80, y: 62, emoji: '🌷', label: '3つめの 花' },
      ],
    },
    learningLine: '虫などが花粉を運ぶことで植物が実や種を作ることにつながるんだよ！',
    normal: {
      prompt: 'ハチが 花から 花へ とぶと、何が おきる？',
      choices: [{ id: 'A', text: '花ふんが はこばれる' }, { id: 'B', text: '花が かれる' }, { id: 'C', text: '雨が ふる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '虫が 花ふんを はこぶ ことが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '花ふんが めしべに つくと、その あと どうなる？',
      choices: [
        { id: 'A', text: 'みや たねが できる ことに つながる' },
        { id: 'B', text: '花が もう 一つ ふえる' },
        { id: 'C', text: '葉が ぜんぶ おちる' },
      ],
      correctId: 'A',
    },
    clearLine: '虫が 花ふんを はこんで、みや たねが できるんだね！',
  },
  {
    id: 'seibutsu-12',
    index: 12,
    regionId: 'seibutsu',
    title: '食べる・食べられる関係を作ろう',
    curriculum: { code: '理科 6年', unit: '生物と環境' },
    activityHint: '植物から並び替えて、食物連鎖を作っていこう。',
    activity: {
      kind: 'order-cards',
      goalHint: 'たべられる ほうから じゅんばんに ならべよう',
      cards: [
        { id: 'fc1', emoji: '🌿', label: '植物' },
        { id: 'fc2', emoji: '🦗', label: 'バッタ' },
        { id: 'fc3', emoji: '🐸', label: 'カエル' },
        { id: 'fc4', emoji: '🐍', label: 'ヘビ' },
      ],
    },
    learningLine: '生き物は食べる・食べられるの関係でつながっているんだよ！',
    normal: {
      prompt: '食もつれんさの はじまりに いるのは どれ？',
      choices: [{ id: 'A', text: '植物' }, { id: 'B', text: '大きな 動物' }, { id: 'C', text: '石' }],
      correctId: 'A',
    },
    easy: {
      prompt: '生きものは 食べる・食べられるの かんけいで つながって いる？',
      choices: [{ id: 'A', text: 'つながって いる' }, { id: 'B', text: 'つながって いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'バッタを カエルが 食べ、カエルを ヘビが 食べる。この つながりを なんと いう？',
      choices: [{ id: 'A', text: '食もつれんさ' }, { id: 'B', text: 'きせつの 変化' }, { id: 'C', text: '天気の 変化' }],
      correctId: 'A',
    },
    clearLine: '生きものは 食べる・食べられるで つながって いるんだね！',
  },
  {
    id: 'seibutsu-13',
    index: 13,
    regionId: 'seibutsu',
    title: '人の体の中を探検しよう',
    curriculum: { code: '理科 6年', unit: '人の体のつくりとはたらき' },
    activityHint: '口をスタートとして、食べ物が通る道を指でなぞっていこう。',
    activity: {
      kind: 'drag-path',
      board: 'body-digest',
      goalHint: 'たべものを 口から じゅんばんに はこぼう',
      mover: { emoji: '🍙', label: '食べもの' },
      stops: [
        { id: 'd1', x: 50, y: 16, emoji: '👄', label: '口' },
        { id: 'd2', x: 50, y: 38, emoji: '🧵', label: '食道' },
        { id: 'd3', x: 36, y: 58, emoji: '🫘', label: 'い' },
        { id: 'd4', x: 58, y: 78, emoji: '🌀', label: '小腸' },
      ],
    },
    learningLine: '食べ物は体の中を通りながら体に必要なものに変わっていくんだよ！',
    normal: {
      prompt: '食べものが 通る じゅんばんは どれ？',
      choices: [
        { id: 'A', text: '口 → 食道 → い → 小腸' },
        { id: 'B', text: '口 → はい → 心ぞう' },
        { id: 'C', text: '鼻 → 気管 → はい' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: '食べものは からだの 中を 通る？',
      choices: [{ id: 'A', text: '通る' }, { id: 'B', text: '通らない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '食べものが 体に ひつような ものに かわる ことを なんと いう？',
      choices: [{ id: 'A', text: '消化' }, { id: 'B', text: 'こきゅう' }, { id: 'C', text: 'はいしゅつ' }],
      correctId: 'A',
    },
    clearLine: '食べものは 体の 中を 通りながら かわって いくんだね！',
  },
  {
    id: 'seibutsu-14',
    index: 14,
    regionId: 'seibutsu',
    title: '空気の通り道を見つけよう',
    curriculum: { code: '理科 6年', unit: '人の体のつくりとはたらき' },
    activityHint: '鼻・気管・肺を順番につないでみよう。',
    activity: {
      kind: 'drag-path',
      board: 'body-air',
      goalHint: 'すった 空気を 鼻から じゅんばんに はこぼう',
      mover: { emoji: '💨', label: '空気' },
      stops: [
        { id: 'a1', x: 50, y: 16, emoji: '👃', label: '鼻' },
        { id: 'a2', x: 50, y: 42, emoji: '🎋', label: '気管' },
        { id: 'a3', x: 30, y: 64, emoji: '🫁', label: '左の はい' },
        { id: 'a4', x: 70, y: 64, emoji: '🫁', label: '右の はい' },
      ],
    },
    learningLine: '吸った空気は気管を通って肺に入り体に必要な酸素を取り入れているんだよ！',
    normal: {
      prompt: 'すった 空気は どの じゅんばんで すすむ？',
      choices: [
        { id: 'A', text: '鼻 → 気管 → はい' },
        { id: 'B', text: '口 → い → 小腸' },
        { id: 'C', text: 'はい → 気管 → 鼻' },
      ],
      correctId: 'A',
    },
    easy: {
      prompt: 'すった 空気は はいに 入る？',
      choices: [{ id: 'A', text: '入る' }, { id: 'B', text: '入らない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'はいで 体に とり入れて いる ものは 何？',
      choices: [{ id: 'A', text: 'さんそ' }, { id: 'B', text: 'さとう' }, { id: 'C', text: 'すな' }],
      correctId: 'A',
    },
    clearLine: '空気は 気管を 通って はいに 入るんだね！',
  },
  {
    id: 'seibutsu-15',
    index: 15,
    regionId: 'seibutsu',
    title: '血液を運ぼう',
    curriculum: { code: '理科 6年', unit: '人の体のつくりとはたらき' },
    activityHint: '心臓から血管を通って、酸素などを体中へ運ぼう。',
    activity: {
      kind: 'drag-path',
      board: 'body-blood',
      goalHint: 'けつえきを 心ぞうから 体ぜんたいへ はこぼう',
      mover: { emoji: '🩸', label: 'けつえき' },
      stops: [
        { id: 'v1', x: 50, y: 28, emoji: '❤️', label: '心ぞう' },
        { id: 'v2', x: 22, y: 52, emoji: '🩹', label: '血管' },
        { id: 'v3', x: 50, y: 78, emoji: '🦵', label: '体の すみずみ' },
        { id: 'v4', x: 78, y: 52, emoji: '↩️', label: '心ぞうへ もどる' },
      ],
    },
    learningLine: '血液は体中をめぐって酸素や栄養を運んでいるんだよ！',
    normal: {
      prompt: 'けつえきを 送り出す ポンプの やくわりを して いるのは どこ？',
      choices: [{ id: 'A', text: '心ぞう' }, { id: 'B', text: 'い' }, { id: 'C', text: 'はい' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'けつえきは 体の 中を めぐって いる？',
      choices: [{ id: 'A', text: 'めぐって いる' }, { id: 'B', text: 'めぐって いない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'けつえきが はこんで いる ものは 何？',
      choices: [{ id: 'A', text: 'さんそや えいよう' }, { id: 'B', text: 'こおり' }, { id: 'C', text: '音' }],
      correctId: 'A',
    },
    clearLine: 'けつえきが 体中に さんそや えいようを はこんで いるんだね！',
  },
  {
    id: 'seibutsu-16',
    index: 16,
    regionId: 'seibutsu',
    title: '人の体を完成させよう',
    curriculum: { code: '理科 6年', unit: '人の体のつくりとはたらき' },
    activityHint: '心臓・肺・胃・小腸などをドラッグして、臓器を正しい位置に運ぼう。',
    activity: {
      kind: 'place-targets',
      board: 'body',
      goalHint: 'ぞうきを ただしい ばしょに はこぼう',
      slots: [
        { id: 'o-lung', x: 28, y: 34, label: 'むねの 上' },
        { id: 'o-heart', x: 58, y: 34, label: 'むねの まんなか' },
        { id: 'o-stomach', x: 34, y: 58, label: 'おなかの 上' },
        { id: 'o-intestine', x: 58, y: 78, label: 'おなかの 下' },
      ],
      tokens: [
        { id: 'o-t1', slotId: 'o-lung', emoji: '🫁', label: 'はい' },
        { id: 'o-t2', slotId: 'o-heart', emoji: '❤️', label: '心ぞう' },
        { id: 'o-t3', slotId: 'o-stomach', emoji: '🫘', label: 'い' },
        { id: 'o-t4', slotId: 'o-intestine', emoji: '🌀', label: '小腸' },
      ],
    },
    learningLine: '体の中にはそれぞれ大切な役割を持った臓器があるんだよ！',
    normal: {
      prompt: '食べものを 消化する ぞうきは どれ？',
      choices: [{ id: 'A', text: 'い' }, { id: 'B', text: 'はい' }, { id: 'C', text: '心ぞう' }],
      correctId: 'A',
    },
    easy: {
      prompt: '体の 中の ぞうきには、それぞれ やくわりが ある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気から さんそを とり入れる ぞうきは どれ？',
      choices: [{ id: 'A', text: 'はい' }, { id: 'B', text: 'い' }, { id: 'C', text: '小腸' }],
      correctId: 'A',
    },
    clearLine: 'ぞうきには それぞれ 大切な やくわりが あるんだね！',
  },
]

export const scienceStages: ScienceStage[] = [...chigakuStages, ...seibutsuStages]

export function getScienceStage(id: string) {
  return scienceStages.find((s) => s.id === id)
}

export function getScienceStagesForRegion(regionId: ScienceRegionId) {
  return scienceStages.filter((s) => s.regionId === regionId)
}

export function getNextScienceStage(id: string) {
  const stage = getScienceStage(id)
  if (!stage) return null
  const inRegion = getScienceStagesForRegion(stage.regionId)
  const index = inRegion.findIndex((s) => s.id === id)
  return inRegion[index + 1] ?? null
}
