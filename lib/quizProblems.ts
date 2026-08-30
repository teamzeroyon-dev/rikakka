export type QuizChoiceId = 'A' | 'B' | 'C'
export type QuizQuestion = {
  prompt: string
  choices: { id: QuizChoiceId; text: string }[]
  correctId: QuizChoiceId
}

export type ChemExperimentConfig =
  | { kind: 'balance'; itemA: { label: string; grams: number; color: string }; itemB: { label: string; grams: number; color: string } }
  | { kind: 'conserve-weight'; itemA: { label: string; grams: number }; itemB: { label: string; grams: number } }
  | { kind: 'clay-press'; label: string; grams: number }
  | { kind: 'linear-push'; label: string }
  | {
      kind: 'dissolve'
      cups: { label: string; items: { label: string; behavior: 'dissolve' | 'sink' | 'float'; limit?: number }[] }[]
    }
  | { kind: 'heat-cool'; mode: 'heat-water' | 'freeze-water' | 'expand-metal' | 'shrink-metal'; itemLabel: string }
  | { kind: 'sweep'; mode: 'evaporate' | 'magnet'; targets: { label: string; reacts: boolean }[] }
  | { kind: 'condense' }
  | { kind: 'filter' }
  | { kind: 'circuit'; materials: { label: string; conducts: boolean }[] }

export type ChemStage = {
  id: string
  index: number
  title: string
  emoji: string
  curriculum: { code: string; unit: string }
  learningLine: string
  experiment: ChemExperimentConfig
  normal: QuizQuestion
  easy: QuizQuestion
  retry: QuizQuestion
  clearLine: string
}

export const chemStages: ChemStage[] = [
  {
    id: 'chem-01',
    index: 1,
    title: 'ものの重さ',
    emoji: '⚖️',
    curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '木と金属、同じくらいの大きさでも、のせてみると重さがちがうんだよ！',
    experiment: { kind: 'balance', itemA: { label: '木', grams: 10, color: '#c98a4b' }, itemB: { label: '金属', grams: 26, color: '#8b95a1' } },
    normal: {
      prompt: '大きさが同じくらいの木と金属があります。どちらが重いか比べました。この実験から分かることは？',
      choices: [{ id: 'A', text: '大きいものは必ず重い' }, { id: 'B', text: '物によって重さは違う' }, { id: 'C', text: 'どんな物も重さは同じ' }],
      correctId: 'B',
    },
    easy: {
      prompt: '物の重さを測る道具はどれ？',
      choices: [{ id: 'A', text: 'はかり' }, { id: 'B', text: '時計' }, { id: 'C', text: '定規' }],
      correctId: 'A',
    },
    retry: {
      prompt: '同じくらいの大きさの木と金属を比べたら、金属の方が重かったです。このことから分かることは？',
      choices: [{ id: 'A', text: '物によって重さが違う' }, { id: 'B', text: '木には重さがない' }, { id: 'C', text: '金属は必ず大きい' }],
      correctId: 'A',
    },
    clearLine: '物によって重さがちがうことが分かったね！',
  },
  {
    id: 'chem-02',
    index: 2,
    title: '形を変えたら重さは変わる？',
    emoji: '🧱',
    curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '粘土は形を変えても、粘土そのものはなくならないよ。重さはどうなるかな？',
    experiment: { kind: 'clay-press', label: '粘土', grams: 40 },
    normal: {
      prompt: '粘土を丸い形から平らな形に変えました。粘土の重さはどうなる？',
      choices: [{ id: 'A', text: '重くなる' }, { id: 'B', text: '軽くなる' }, { id: 'C', text: '基本的に変わらない' }],
      correctId: 'C',
    },
    easy: {
      prompt: '粘土の形を変えても、粘土そのものがなくなるわけではありません。重さはどうなる？',
      choices: [{ id: 'A', text: '基本的に変わらない' }, { id: 'B', text: '必ずなくなる' }],
      correctId: 'A',
    },
    retry: {
      prompt: '粘土を3つの小さなかたまりに分けました。3つ全部を合わせた重さは、分ける前と比べてどうなる？',
      choices: [{ id: 'A', text: '基本的に同じ' }, { id: 'B', text: '必ず軽くなる' }, { id: 'C', text: '必ず重くなる' }],
      correctId: 'A',
    },
    clearLine: '形が変わっても、重さは変わらないんだね！',
  },
  {
    id: 'chem-03',
    index: 3,
    title: '体積と重さ',
    emoji: '📦',
    curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '同じくらいの大きさ（体積）でも、金属の方がぎゅっと重いんだよ！',
    experiment: { kind: 'balance', itemA: { label: '木', grams: 10, color: '#c98a4b' }, itemB: { label: '金属', grams: 26, color: '#8b95a1' } },
    normal: {
      prompt: '同じくらいの大きさの木と金属があります。重さを比べると金属の方が重かったです。このことから分かることは？',
      choices: [{ id: 'A', text: '同じ体積でも重さが違うことがある' }, { id: 'B', text: '同じ体積なら必ず同じ重さ' }, { id: 'C', text: '木には重さがない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '物には「重さ」がある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '同じくらいの体積のプラスチックと金属があります。重さは必ず同じ？',
      choices: [{ id: 'A', text: '必ず同じ' }, { id: 'B', text: '物によって違う' }, { id: 'C', text: 'どちらも重さがない' }],
      correctId: 'B',
    },
    clearLine: '同じ大きさでも、物によって重さがちがうことが分かったね！',
  },
  {
    id: 'chem-04',
    index: 4,
    title: '空気って重い？',
    emoji: '🎈',
    curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '目には見えない空気にも、実は重さがあるんだよ！',
    experiment: { kind: 'balance', itemA: { label: 'からの風船', grams: 5, color: '#e2596b' }, itemB: { label: '空気を入れた風船', grams: 6, color: '#e2596b' } },
    normal: {
      prompt: '空気を入れた風船と、空気を抜いた風船を比べました。空気を入れた風船の方が少し重くなりました。ここから何が分かる？',
      choices: [{ id: 'A', text: '空気にも重さがある' }, { id: 'B', text: '空気には重さがない' }, { id: 'C', text: '風船だけが重くなった' }],
      correctId: 'A',
    },
    easy: {
      prompt: '風船の中には何が入っている？',
      choices: [{ id: 'A', text: '空気' }, { id: 'B', text: '砂' }, { id: 'C', text: '石' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気を入れる前と後で風船の重さを比べました。空気を入れた後の方が重くなりました。なぜ？',
      choices: [{ id: 'A', text: '空気にも重さがあるから' }, { id: 'B', text: '風船が大きくなったから' }, { id: 'C', text: '空気は重さを持たないから' }],
      correctId: 'A',
    },
    clearLine: '空気にも重さがあることが分かったね！',
  },
  {
    id: 'chem-05',
    index: 5,
    title: '空気の性質',
    emoji: '💉',
    curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '空気は、ぎゅっと押すとちぢむよ。水は押してもちぢまないんだ！',
    experiment: { kind: 'linear-push', label: '空気' },
    normal: {
      prompt: '注射器の中に空気を閉じ込めて押しました。すると、空気の体積はどうなった？',
      choices: [{ id: 'A', text: '小さくなった' }, { id: 'B', text: '大きくなった' }, { id: 'C', text: '何も変わらなかった' }],
      correctId: 'A',
    },
    easy: {
      prompt: '空気は押すことができる？',
      choices: [{ id: 'A', text: 'できる' }, { id: 'B', text: 'できない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'ペットボトルの中に空気を閉じ込めてふたをして、上から押しました。空気の体積はどうなる？',
      choices: [{ id: 'A', text: '小さくなる' }, { id: 'B', text: '大きくなる' }, { id: 'C', text: '変わらない' }],
      correctId: 'A',
    },
    clearLine: '空気はぎゅっと押しちぢめられることが分かったね！',
  },
  {
    id: 'chem-06',
    index: 6,
    title: '食塩は水にとける？',
    emoji: '🧂',
    curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩を水に入れてかき混ぜると、つぶが見えなくなって水にとけるよ！',
    experiment: { kind: 'dissolve', cups: [{ label: '水100mL', items: [{ label: '食塩', behavior: 'dissolve', limit: 6 }] }] },
    normal: {
      prompt: '水100mLに食塩をどんどん入れていくと、どうなる？',
      choices: [{ id: 'A', text: '永遠に溶け続ける' }, { id: 'B', text: 'あるところで溶けなくなる' }, { id: 'C', text: '水がなくなる' }],
      correctId: 'B',
    },
    easy: {
      prompt: '食塩は水に溶ける？',
      choices: [{ id: 'A', text: '溶ける' }, { id: 'B', text: '溶けない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水100mLに砂糖をどんどん入れていくと、どうなる？',
      choices: [{ id: 'A', text: '永遠に溶け続ける' }, { id: 'B', text: 'あるところで溶けなくなる' }, { id: 'C', text: '水が砂糖にかわる' }],
      correctId: 'B',
    },
    clearLine: '水にとける量にはかぎりがあることが分かったね！',
  },
  {
    id: 'chem-07',
    index: 7,
    title: 'とけた食塩はどこにいった？',
    emoji: '🧪',
    curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩は見えなくなっても水の中にあるよ。重さをはかると、食塩水の重さは水と食塩を合わせた重さになるんだ！',
    experiment: { kind: 'conserve-weight', itemA: { label: '水', grams: 100 }, itemB: { label: '食塩', grams: 10 } },
    normal: {
      prompt: '水100gに食塩10gを入れて、よくかき混ぜて溶かしました。できた食塩水の重さは？',
      choices: [{ id: 'A', text: '90g' }, { id: 'B', text: '100g' }, { id: 'C', text: '110g' }],
      correctId: 'C',
    },
    easy: {
      prompt: '食塩を水に溶かすと、食塩はなくなってしまう？',
      choices: [{ id: 'A', text: 'なくなってしまう' }, { id: 'B', text: '水の中にまだある' }],
      correctId: 'B',
    },
    retry: {
      prompt: '水50gに食塩5gを入れて溶かしました。できた食塩水の重さは？',
      choices: [{ id: 'A', text: '45g' }, { id: 'B', text: '50g' }, { id: 'C', text: '55g' }],
      correctId: 'C',
    },
    clearLine: '見えなくなっても、食塩の重さはちゃんと残っているんだね！',
  },
  {
    id: 'chem-08',
    index: 8,
    title: '水にとけないもの',
    emoji: '🏖️',
    curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩は水にとけるけど、砂や油は水にとけないんだよ！',
    experiment: {
      kind: 'dissolve',
      cups: [
        {
          label: '水',
          items: [
            { label: '食塩', behavior: 'dissolve' },
            { label: '砂', behavior: 'sink' },
            { label: '油', behavior: 'float' },
          ],
        },
      ],
    },
    normal: {
      prompt: '食塩、砂、油を水に入れてかき混ぜました。水にとけて見えなくなったのはどれ？',
      choices: [{ id: 'A', text: '食塩' }, { id: 'B', text: '砂' }, { id: 'C', text: '油' }],
      correctId: 'A',
    },
    easy: {
      prompt: '砂を水に入れてかき混ぜると、砂は水にとける？',
      choices: [{ id: 'A', text: 'とける' }, { id: 'B', text: 'とけない' }],
      correctId: 'B',
    },
    retry: {
      prompt: '食塩、砂、油を水に入れてかき混ぜました。かき混ぜても水の中で見えたままなのはどれとどれ？',
      choices: [{ id: 'A', text: '食塩と砂' }, { id: 'B', text: '砂と油' }, { id: 'C', text: '食塩と油' }],
      correctId: 'B',
    },
    clearLine: '水にとけるものと、とけないものがあることが分かったね！',
  },
  {
    id: 'chem-09',
    index: 9,
    title: 'とける量にはかぎりがある',
    emoji: '🌡️',
    curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: 'あたたかい水は、冷たい水よりも食塩をたくさんとかせるんだよ！',
    experiment: {
      kind: 'dissolve',
      cups: [
        { label: '冷たい水', items: [{ label: '食塩', behavior: 'dissolve', limit: 4 }] },
        { label: 'あたたかい水', items: [{ label: '食塩', behavior: 'dissolve', limit: 8 }] },
      ],
    },
    normal: {
      prompt: '冷たい水とあたたかい水に、同じ量の食塩を入れていきました。どちらがたくさん食塩をとかせる？',
      choices: [{ id: 'A', text: '冷たい水' }, { id: 'B', text: 'あたたかい水' }, { id: 'C', text: 'どちらも同じ' }],
      correctId: 'B',
    },
    easy: {
      prompt: '水の温度が変わると、食塩がとける量は変わる？',
      choices: [{ id: 'A', text: '変わる' }, { id: 'B', text: '変わらない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '冷たい水とあたたかい水があります。もっとたくさん食塩をとかしたいとき、どちらの水を使うといい？',
      choices: [{ id: 'A', text: '冷たい水' }, { id: 'B', text: 'あたたかい水' }, { id: 'C', text: 'どちらでも同じ' }],
      correctId: 'B',
    },
    clearLine: '水の温度で、とける量が変わることが分かったね！',
  },
  {
    id: 'chem-10',
    index: 10,
    title: '水を熱すると？',
    emoji: '🔥',
    curriculum: { code: '理科 4年', unit: '水のすがた' },
    learningLine: '水を熱していくと、あわが出てぐらぐらとふっとうし、湯気（水蒸気）になるよ！',
    experiment: { kind: 'heat-cool', mode: 'heat-water', itemLabel: '水' },
    normal: {
      prompt: '水を熱し続けると、100℃くらいでぐらぐらとあわが出てきました。これは何が起きている？',
      choices: [{ id: 'A', text: '水がふっとうして水蒸気になっている' }, { id: 'B', text: '水が氷になっている' }, { id: 'C', text: '何も変わっていない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '水を熱していくと、温度はどうなる？',
      choices: [{ id: 'A', text: '上がる' }, { id: 'B', text: '下がる' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'なべの水を熱していくと、湯気が出てきました。この湯気は何？',
      choices: [{ id: 'A', text: '水が姿を変えた水蒸気' }, { id: 'B', text: '空気だけ' }, { id: 'C', text: '氷のつぶ' }],
      correctId: 'A',
    },
    clearLine: '水は熱すると水蒸気になることが分かったね！',
  },
  {
    id: 'chem-11',
    index: 11,
    title: '冷やすと氷になる',
    emoji: '🧊',
    curriculum: { code: '理科 4年', unit: '水のすがた' },
    learningLine: '水は冷やすと氷になって、体積が少し大きくなるよ！',
    experiment: { kind: 'heat-cool', mode: 'freeze-water', itemLabel: '水' },
    normal: {
      prompt: '水を冷やしていくと、氷になりました。氷になった水の体積はどうなる？',
      choices: [{ id: 'A', text: '少し大きくなる' }, { id: 'B', text: '少し小さくなる' }, { id: 'C', text: '変わらない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '水を冷やしていくと、何になる？',
      choices: [{ id: 'A', text: '氷' }, { id: 'B', text: '水蒸気' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'コップいっぱいの水を冷やして氷にしました。氷の高さはコップの水の高さと比べてどうなる？',
      choices: [{ id: 'A', text: '少し高くなる' }, { id: 'B', text: '少し低くなる' }, { id: 'C', text: '同じ' }],
      correctId: 'A',
    },
    clearLine: '水は凍ると少しふくらむことが分かったね！',
  },
  {
    id: 'chem-12',
    index: 12,
    title: '水はどこへいく？',
    emoji: '☀️',
    curriculum: { code: '理科 4年', unit: '水のすがた' },
    learningLine: '水たまりに日光を当てると、水は水蒸気になって空気の中に出ていくよ！',
    experiment: { kind: 'sweep', mode: 'evaporate', targets: [{ label: '水たまり', reacts: true }] },
    normal: {
      prompt: '晴れた日、外にできた水たまりが数時間後になくなっていました。水はどうなった？',
      choices: [{ id: 'A', text: '水蒸気になって空気の中に出ていった' }, { id: 'B', text: '地面の下に固まりのまま残っている' }, { id: 'C', text: '氷になった' }],
      correctId: 'A',
    },
    easy: {
      prompt: '日光に当てると、水は少しずつどうなる？',
      choices: [{ id: 'A', text: '蒸発してへっていく' }, { id: 'B', text: 'ふえていく' }],
      correctId: 'A',
    },
    retry: {
      prompt: '洗たくした服を外に干しておくと、だんだんかわいていきます。服の中の水はどうなった？',
      choices: [{ id: 'A', text: '水蒸気になって空気中に出ていった' }, { id: 'B', text: '服の中で氷になった' }, { id: 'C', text: '服の色に変わった' }],
      correctId: 'A',
    },
    clearLine: '水は蒸発して空気の中に出ていくことが分かったね！',
  },
  {
    id: 'chem-13',
    index: 13,
    title: '空気の中の水',
    emoji: '💧',
    curriculum: { code: '理科 4年', unit: '水のすがた' },
    learningLine: '冷たいものを空気の中に置くと、空気の中の水蒸気が水てきになって表面につくよ！',
    experiment: { kind: 'condense' },
    normal: {
      prompt: '冷たい水を入れたコップを部屋に置いておくと、コップの外側に水てきがつきました。これは何？',
      choices: [{ id: 'A', text: '空気中の水蒸気が冷やされて水になった' }, { id: 'B', text: 'コップの中の水がしみ出た' }, { id: 'C', text: '何もない、ただのよごれ' }],
      correctId: 'A',
    },
    easy: {
      prompt: '空気の中には、目に見えない水蒸気が入っている？',
      choices: [{ id: 'A', text: '入っている' }, { id: 'B', text: '入っていない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '冬に、窓ガラスの内側に水てきがつくことがあります。これはなぜ？',
      choices: [{ id: 'A', text: '空気中の水蒸気が冷たいガラスで冷やされたから' }, { id: 'B', text: '外の雨が窓を通りぬけたから' }, { id: 'C', text: 'ガラスがとけたから' }],
      correctId: 'A',
    },
    clearLine: '見えない空気の中にも、水蒸気がかくれていることが分かったね！',
  },
  {
    id: 'chem-14',
    index: 14,
    title: '金属をあたためると',
    emoji: '🔧',
    curriculum: { code: '理科 4年', unit: 'もののあたたまり方' },
    learningLine: '金属の玉をあたためると、少しだけふくらんで大きくなるよ！',
    experiment: { kind: 'heat-cool', mode: 'expand-metal', itemLabel: '金属の玉' },
    normal: {
      prompt: '金属の玉を輪っかにぎりぎり通せていました。玉をあたためると、輪っかを通り抜けられるようになる？',
      choices: [{ id: 'A', text: '通り抜けられなくなる（玉が大きくなる）' }, { id: 'B', text: 'もっと楽に通り抜けられる' }, { id: 'C', text: '何も変わらない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '金属をあたためると、大きさはどうなる？',
      choices: [{ id: 'A', text: '少し大きくなる' }, { id: 'B', text: '少し小さくなる' }],
      correctId: 'A',
    },
    retry: {
      prompt: '金属のふたが固くて開かないとき、ふたをお湯であたためると開きやすくなります。これはなぜ？',
      choices: [{ id: 'A', text: 'あたためた金属がふくらんでゆるむから' }, { id: 'B', text: 'あたためた金属がちぢむから' }, { id: 'C', text: 'ふたの重さが変わるから' }],
      correctId: 'A',
    },
    clearLine: '金属もあたためるとふくらむことが分かったね！',
  },
  {
    id: 'chem-15',
    index: 15,
    title: '金属を冷やすと',
    emoji: '❄️',
    curriculum: { code: '理科 4年', unit: 'もののあたたまり方' },
    learningLine: 'あたためてふくらんだ金属の玉も、冷やせばまたもとの大きさにちぢむよ！',
    experiment: { kind: 'heat-cool', mode: 'shrink-metal', itemLabel: '金属の玉' },
    normal: {
      prompt: 'あたためてふくらんだ金属の玉を輪っかに通せなくなっていました。玉を冷やすとどうなる？',
      choices: [{ id: 'A', text: 'ちぢんで輪っかを通れるようになる' }, { id: 'B', text: 'もっと大きくなる' }, { id: 'C', text: '何も変わらない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '金属を冷やすと、大きさはどうなる？',
      choices: [{ id: 'A', text: '少し小さくなる（ちぢむ）' }, { id: 'B', text: '少し大きくなる' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'あたためてふくらんだ金属のふたを冷たい水につけると、開けやすくなることがあります。なぜ？',
      choices: [{ id: 'A', text: '金属が冷えてちぢむから' }, { id: 'B', text: '金属が冷えてふくらむから' }, { id: 'C', text: '水でぬれて軽くなるから' }],
      correctId: 'A',
    },
    clearLine: '金属は冷やすとちぢむことが分かったね！',
  },
  {
    id: 'chem-16',
    index: 16,
    title: '混ぜ物を分けよう',
    emoji: '🧫',
    curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '砂が混じった水をろ紙でこすと、砂はろ紙に残って、すきとおった水だけが下に落ちるよ！',
    experiment: { kind: 'filter' },
    normal: {
      prompt: '砂が混じった水を、ろ紙を使ってこしました。ろ紙の上には何が残る？',
      choices: [{ id: 'A', text: '砂' }, { id: 'B', text: '水' }, { id: 'C', text: '何も残らない' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'ろ紙を使うと、水の中の砂を取りのぞくことができる？',
      choices: [{ id: 'A', text: 'できる' }, { id: 'B', text: 'できない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '砂が混じった水をろ紙でこしました。ろ紙を通り抜けて下に落ちてくるのは何？',
      choices: [{ id: 'A', text: 'すきとおった水' }, { id: 'B', text: '砂だけ' }, { id: 'C', text: '砂と水がまざったまま' }],
      correctId: 'A',
    },
    clearLine: 'ろ紙を使えば、水と砂を分けられることが分かったね！',
  },
  {
    id: 'chem-17',
    index: 17,
    title: '磁石につくもの',
    emoji: '🧲',
    curriculum: { code: '理科 3年', unit: '磁石の性質' },
    learningLine: '磁石は鉄にはつくけど、アルミやプラスチックにはつかないんだよ！',
    experiment: {
      kind: 'sweep',
      mode: 'magnet',
      targets: [
        { label: '鉄のくぎ', reacts: true },
        { label: 'アルミかん', reacts: false },
        { label: 'プラスチックの板', reacts: false },
      ],
    },
    normal: {
      prompt: '磁石を鉄のくぎ、アルミかん、プラスチックの板に近づけました。磁石につくのはどれ？',
      choices: [{ id: 'A', text: '鉄のくぎ' }, { id: 'B', text: 'アルミかん' }, { id: 'C', text: 'プラスチックの板' }],
      correctId: 'A',
    },
    easy: {
      prompt: '磁石は鉄につく？',
      choices: [{ id: 'A', text: 'つく' }, { id: 'B', text: 'つかない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '磁石を10円玉（銅）と鉄のクリップに近づけました。磁石につくのはどっち？',
      choices: [{ id: 'A', text: '鉄のクリップ' }, { id: 'B', text: '10円玉' }, { id: 'C', text: 'どちらもつく' }],
      correctId: 'A',
    },
    clearLine: '磁石につく物とつかない物があることが分かったね！',
  },
  {
    id: 'chem-18',
    index: 18,
    title: '電気を通すもの',
    emoji: '💡',
    curriculum: { code: '理科 3年', unit: '電気の通り道' },
    learningLine: '金属は電気を通すから豆電球が光るよ。プラスチックやガラスは電気を通さないんだ！',
    experiment: {
      kind: 'circuit',
      materials: [
        { label: '鉄のスプーン', conducts: true },
        { label: 'プラスチックの下じき', conducts: false },
        { label: 'ガラスのコップ', conducts: false },
        { label: 'アルミホイル', conducts: true },
      ],
    },
    normal: {
      prompt: '豆電球と電池をつないだ回路のとちゅうに、鉄のスプーンをつなぎました。豆電球はどうなる？',
      choices: [{ id: 'A', text: '光る' }, { id: 'B', text: '光らない' }, { id: 'C', text: '電池がなくなる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '金属は電気を通す？',
      choices: [{ id: 'A', text: '通す' }, { id: 'B', text: '通さない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '豆電球と電池をつないだ回路のとちゅうに、プラスチックの下じきをつなぎました。豆電球はどうなる？',
      choices: [{ id: 'A', text: '光らない' }, { id: 'B', text: '光る' }, { id: 'C', text: 'もっと明るく光る' }],
      correctId: 'A',
    },
    clearLine: '金属は電気を通し、プラスチックは通さないことが分かったね！',
  },
]

export function getChemStage(id: string) {
  return chemStages.find((s) => s.id === id)
}
export function getChemStageIndex(id: string) {
  return chemStages.findIndex((s) => s.id === id)
}
export function getNextChemStage(id: string) {
  const index = getChemStageIndex(id)
  if (index === -1) return null
  return chemStages[index + 1] ?? null
}
