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
  | { kind: 'linear-push'; label: string; compareWater?: boolean }
  | {
      kind: 'dissolve'
      cups: { label: string; items: { label: string; behavior: 'dissolve' | 'sink' | 'float'; limit?: number }[] }[]
    }
  | { kind: 'heat-cool'; mode: 'heat-water' | 'freeze-water' | 'expand-metal' | 'shrink-metal' | 'heat-air'; itemLabel: string }
  | { kind: 'sweep'; mode: 'evaporate' | 'magnet'; targets: { label: string; reacts: boolean }[] }
  | { kind: 'condense' }
  | { kind: 'filter' }
  | { kind: 'circuit'; materials: { label: string; conducts: boolean }[] }
  | { kind: 'three-state' }
  | { kind: 'evaporate-salt' }
  | { kind: 'combustion' }
  | { kind: 'litmus'; solutions: { label: string; nature: 'acid' | 'neutral' | 'alkali' }[] }
  | { kind: 'metal-acid'; solutions: { label: string; reacts: boolean }[] }

// The three-tier ladder every stage runs on: normal -> easy -> retry. Both the
// chem stages and the chigaku/seibutsu stages feed this shape to QuizFlow.
export type QuizSet = {
  normal: QuizQuestion
  easy: QuizQuestion
  retry: QuizQuestion
}

export type ChemStage = {
  id: string
  index: number
  title: string
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
      curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '木・金属・プラスチックなど、大きさが同じくらいでも重さはちがうんだよ！',
    experiment: { kind: 'balance', itemA: { label: '木', grams: 10, color: '#c98a4b' }, itemB: { label: '金属', grams: 26, color: '#8b95a1' } },
    normal: {
      prompt: '大きさが同じ木と金属があります。はかりに乗せてどちらが重いか比べました。重さは、木のほうが重いでしょうか。金属のほうが重いでしょうか。もしくはどちらも同じでしょうか。',
      choices: [{ id: 'A', text: '木のほうが重い' }, { id: 'B', text: '金属のほうが重い' }, { id: 'C', text: '同じ重さ' }],
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
      curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '粘土の形を変えても、粘土そのものは何も変わっていないよ。重さはどうなるかな？',
    experiment: { kind: 'clay-press', label: '粘土', grams: 40 },
    normal: {
      prompt: '粘土を丸い形から平らな形に変えました。粘土の重さは変わるでしょうか。',
      choices: [{ id: 'A', text: '重くなる' }, { id: 'B', text: '軽くなる' }, { id: 'C', text: '変わらない' }],
      correctId: 'C',
    },
    easy: {
      prompt: '粘土の形をかえても、形を変えている粘土はなにも変わっていません。では、重さはどうなるでしょうか。',
      choices: [{ id: 'A', text: '変わらない' }, { id: 'B', text: '重くなる' }, { id: 'C', text: '軽くなる' }],
      correctId: 'A',
    },
    retry: {
      prompt: '粘土を3つの小さなかたまりに分けました。3つ全部を合わせた重さは、分ける前と比べてどうなる？',
      choices: [{ id: 'A', text: 'かわらない' }, { id: 'B', text: '軽くなる' }, { id: 'C', text: '重くなる' }],
      correctId: 'A',
    },
    clearLine: '形が変わっても、重さは変わらないんだね！',
  },
  {
    id: 'chem-03',
    index: 3,
    title: '体積と重さ',
      curriculum: { code: '理科 3年', unit: 'ものと重さ' },
    learningLine: '同じくらいの大きさ（体積）でも、金属の方がぎゅっと重いんだよ！',
    experiment: { kind: 'balance', itemA: { label: '木', grams: 10, color: '#c98a4b' }, itemB: { label: '金属', grams: 26, color: '#8b95a1' } },
    normal: {
      prompt: '同じくらいの大きさの木と金属があります。重さを比べると金属の方が重かったです。このことから分かることは？',
      choices: [{ id: 'A', text: '同じ体積でも重さが違うことがある' }, { id: 'B', text: '同じ体積なら必ず同じ重さになる' }, { id: 'C', text: '木には重さがない' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'ものには、同じ大きさでも重さが違うことがある？',
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
      curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '目には見えない空気にも、実は重さがあるんだよ！',
    experiment: { kind: 'balance', itemA: { label: 'ぬいた風船', grams: 5, color: '#e2596b' }, itemB: { label: '空気入り風船', grams: 6, color: '#e2596b' } },
    normal: {
      prompt: '空気を入れた風船と、空気を抜いた風船を比べました。空気を入れた風船の方が少し重くなりました。これは、なぜでしょうか。',
      choices: [{ id: 'A', text: '空気にも重さがあるから' }, { id: 'B', text: '風船が厚くなったから' }, { id: 'C', text: '風船がなぜかおもくなったから' }],
      correctId: 'A',
    },
    easy: {
      prompt: '風船の中には何が入っている？',
      choices: [{ id: 'A', text: '空気' }, { id: 'B', text: '砂' }, { id: 'C', text: '石' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気を入れる前と後で風船の重さを比べました。空気を入れた後の方が重くなりました。なぜでしょうか。',
      choices: [{ id: 'A', text: '空気にも重さがあるから' }, { id: 'B', text: '風船が大きくなったから' }, { id: 'C', text: '風船が重くなったから' }],
      correctId: 'A',
    },
    clearLine: '空気にも重さがあることが分かったね！',
  },
  {
    id: 'chem-05',
    index: 5,
    title: '空気の性質',
      curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '注射器に閉じ込めた空気を押すと、体積が小さくなるよ！',
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
      prompt: '注射器に閉じ込めた空気を、もっと強く押しました。空気の体積はどうなる？',
      choices: [{ id: 'A', text: 'もっと小さくなる' }, { id: 'B', text: '大きくなる' }, { id: 'C', text: '変わらない' }],
      correctId: 'A',
    },
    clearLine: '空気は押すと体積が小さくなることが分かったね！',
  },
  {
    id: 'chem-06',
    index: 6,
    title: '空気は縮む！',
      curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '注射器に閉じ込めた空気を押すと体積が小さくなり、手を離すと元に戻ろうとするよ！',
    experiment: { kind: 'linear-push', label: '空気' },
    normal: {
      prompt: '閉じ込めた空気を強く押すと、空気の体積はどうなる？',
      choices: [{ id: 'A', text: '小さくなる' }, { id: 'B', text: '大きくなる' }, { id: 'C', text: 'なくなる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '注射器の中に空気は入っている？',
      choices: [{ id: 'A', text: '入っている' }, { id: 'B', text: '入っていない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気を押したあと、手を離すと、空気はどうなる？',
      choices: [{ id: 'A', text: '元の大きさに戻ろうとする' }, { id: 'B', text: '完全になくなる' }, { id: 'C', text: '水になる' }],
      correctId: 'A',
    },
    clearLine: '空気は縮んでも、元に戻ろうとすることが分かったね！',
  },
  {
    id: 'chem-07',
    index: 7,
    title: '水は縮む？',
      curriculum: { code: '理科 4年', unit: '空気と水の性質' },
    learningLine: '空気と水を同じように押すと、空気はよく縮むけど、水はほとんど縮まないんだよ！',
    experiment: { kind: 'linear-push', label: '空気と水', compareWater: true },
    normal: {
      prompt: '注射器に空気と水を入れて押してみました。より深くまで押し込めたのはどっち？',
      choices: [{ id: 'A', text: '空気' }, { id: 'B', text: '水' }, { id: 'C', text: 'どちらも同じ' }],
      correctId: 'A',
    },
    easy: {
      prompt: '空気は押すと縮む？',
      choices: [{ id: 'A', text: '縮む' }, { id: 'B', text: '縮まない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気と水を同じように押して比べました。水は空気と比べてどうだった？',
      choices: [{ id: 'A', text: '縮みにくかった' }, { id: 'B', text: '空気より大きく縮んだ' }, { id: 'C', text: '完全に消えた' }],
      correctId: 'A',
    },
    clearLine: '空気はよく縮むけど、水はほとんど縮まないんだね！',
  },
  {
    id: 'chem-08',
    index: 8,
    title: 'あたためるとどうなる？',
      curriculum: { code: '理科 4年', unit: 'もののあたたまり方' },
    learningLine: '空気はあたためると体積が大きくなり、冷やすと小さくなるよ！',
    experiment: { kind: 'heat-cool', mode: 'heat-air', itemLabel: '空気' },
    normal: {
      prompt: '空気を温めると、空気の体積はどうなる？',
      choices: [{ id: 'A', text: '大きくなる' }, { id: 'B', text: '小さくなる' }, { id: 'C', text: '必ずなくなる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '温度が高いのはどっち？',
      choices: [{ id: 'A', text: 'あたたかいもの' }, { id: 'B', text: 'つめたいもの' }],
      correctId: 'A',
    },
    retry: {
      prompt: '空気を温めたり冷やしたりすると、空気の体積はどうなる？',
      choices: [{ id: 'A', text: '温度によって変化する' }, { id: 'B', text: '絶対に変化しない' }, { id: 'C', text: '空気がなくなる' }],
      correctId: 'A',
    },
    clearLine: '空気は温度によって体積が変わることが分かったね！',
  },
  {
    id: 'chem-09',
    index: 9,
    title: '水の三態変化',
      curriculum: { code: '理科 4年', unit: '水のすがた' },
    learningLine: '水は、冷やすと氷に、温めると水蒸気に、温度によって姿を変えるんだよ！',
    experiment: { kind: 'three-state' },
    normal: {
      prompt: '氷を温め続けると、どうなる？',
      choices: [{ id: 'A', text: '水になる' }, { id: 'B', text: '金属になる' }, { id: 'C', text: '消える' }],
      correctId: 'A',
    },
    easy: {
      prompt: '氷は何？',
      choices: [{ id: 'A', text: '水が固まったもの' }, { id: 'B', text: '金属' }, { id: 'C', text: '空気' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水を冷やすと氷になり、温めると水蒸気になります。このことから分かることは？',
      choices: [{ id: 'A', text: '水は温度によって姿を変える' }, { id: 'B', text: '氷と水はまったく別の物質' }, { id: 'C', text: '水は温度で変化しない' }],
      correctId: 'A',
    },
    clearLine: '水は温度によって、氷・水・水蒸気に姿を変えるんだね！',
  },
  {
    id: 'chem-10',
    index: 10,
    title: 'ものを水に入れよう！',
      curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩は水にとけて見えなくなるけど、砂は水にとけないで底に残るよ！',
    experiment: {
      kind: 'dissolve',
      cups: [
        {
          label: '水',
          items: [
            { label: '食塩', behavior: 'dissolve' },
            { label: '砂', behavior: 'sink' },
          ],
        },
      ],
    },
    normal: {
      prompt: '食塩と砂をそれぞれ水に入れました。食塩は見えなくなりましたが、砂は底に残りました。この違いは何？',
      choices: [{ id: 'A', text: '食塩は水に溶けた' }, { id: 'B', text: '砂は水になった' }, { id: 'C', text: '食塩が消えた' }],
      correctId: 'A',
    },
    easy: {
      prompt: '食塩は水に溶ける？',
      choices: [{ id: 'A', text: '溶ける' }, { id: 'B', text: '溶けない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水に入れた食塩が見えなくなりました。食塩はどうなった？',
      choices: [{ id: 'A', text: '水に溶けた' }, { id: 'B', text: '消えてなくなった' }, { id: 'C', text: '空気になった' }],
      correctId: 'A',
    },
    clearLine: '水にとけるものと、とけないものがあることが分かったね！',
  },
  {
    id: 'chem-11',
    index: 11,
    title: 'とけたものはどこ？',
      curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩水から水を蒸発させると、とけていた食塩が出てくるよ。食塩は消えたわけじゃないんだ！',
    experiment: { kind: 'evaporate-salt' },
    normal: {
      prompt: '食塩を水に溶かした後、水を蒸発させると食塩が残りました。このことから何が分かる？',
      choices: [{ id: 'A', text: '食塩は消えたのではなく、水に溶けていた' }, { id: 'B', text: '食塩は水になった' }, { id: 'C', text: '食��は空気になった' }],
      correctId: 'A',
    },
    easy: {
      prompt: '食塩水の中には食塩が入っている？',
      choices: [{ id: 'A', text: '入っている' }, { id: 'B', text: '入っていない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '食塩水から水をなくすと食塩��出てきました。なぜ？',
      choices: [{ id: 'A', text: '水に溶けていた食塩が残ったから' }, { id: 'B', text: '新しい食塩が生まれたから' }, { id: 'C', text: '水が食塩に変わったから' }],
      correctId: 'A',
    },
    clearLine: 'とけて見えなくなっても、食塩はちゃんと残っているんだね！',
  },
  {
    id: 'chem-12',
    index: 12,
    title: 'とけても重さは変わらない？',
      curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '食塩を水にとかしても、全体の重さは水と食塩を合わせた重さのまま変わらないよ！',
    experiment: { kind: 'conserve-weight', itemA: { label: '水', grams: 50 }, itemB: { label: '食塩', grams: 10 } },
    normal: {
      prompt: '水と食塩をそれぞれ測った後、食塩を水に溶かして食塩水にしました。全体の重さはどうなる？',
      choices: [{ id: 'A', text: '基本的に変わらない' }, { id: 'B', text: '必ず軽くなる' }, { id: 'C', text: '必ず重くなる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '食塩を水に溶かしたら、食塩はなくなった？',
      choices: [{ id: 'A', text: 'なくなっていない' }, { id: 'B', text: 'なくなった' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水50gと食塩10gを混ぜて溶かしました。できた食塩水の重さは、およそ何g？',
      choices: [{ id: 'A', text: '60g' }, { id: 'B', text: '50g' }, { id: 'C', text: '10g' }],
      correctId: 'A',
    },
    clearLine: 'とかしても、重さは合わせたぶんのまま変わらないんだね！',
  },
  {
    id: 'chem-13',
    index: 13,
    title: 'どこまでとける？',
      curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: '水にとける食塩の量には限りがあるよ。水の量を増やすと、もっととけるようになるんだ！',
    experiment: { kind: 'dissolve', cups: [{ label: '水100mL', items: [{ label: '食塩', behavior: 'dissolve', limit: 6 }] }] },
    normal: {
      prompt: '水に食塩を少しずつ入れていくと、あるところから食塩が溶け残るようになりました。なぜ？',
      choices: [{ id: 'A', text: '水に溶ける量には限度があるから' }, { id: 'B', text: '食塩がなくなったから' }, { id: 'C', text: '水が消えたから' }],
      correctId: 'A',
    },
    easy: {
      prompt: '食塩は水に溶ける量に限界がある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '同じ温度の水なら、水の量を増やすと溶ける食塩の量はどうなる？',
      choices: [{ id: 'A', text: '増える' }, { id: 'B', text: '必ず減る' }, { id: 'C', text: '変わらない' }],
      correctId: 'A',
    },
    clearLine: '水にとける量には限りがあることが分かったね！',
  },
  {
    id: 'chem-14',
    index: 14,
    title: '温度で変わる？',
      curriculum: { code: '理科 5年', unit: 'もののとけ方' },
    learningLine: 'あたたかい水は、冷たい水よりも食塩をたくさんとかせるよ。温度で溶ける量が変わるんだ！',
    experiment: {
      kind: 'dissolve',
      cups: [
        { label: '冷たい水', items: [{ label: '食塩', behavior: 'dissolve', limit: 4 }] },
        { label: 'あたたかい水', items: [{ label: '食塩', behavior: 'dissolve', limit: 8 }] },
      ],
    },
    normal: {
      prompt: '同じ量の水に食塩を溶かしました。温度によって溶ける量に違いがありました。このことから何が分かる？',
      choices: [{ id: 'A', text: '温度によって溶ける量が変化することがある' }, { id: 'B', text: '温度は関係ない' }, { id: 'C', text: '食塩は水に溶けない' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'あたたかい水と冷たい水では、温度が違う？',
      choices: [{ id: 'A', text: '違う' }, { id: 'B', text: '同じ' }],
      correctId: 'A',
    },
    retry: {
      prompt: '水の温度を変えると、物の溶け方はどうなる？',
      choices: [{ id: 'A', text: '変化することがある' }, { id: 'B', text: '絶対に変わらない' }, { id: 'C', text: '物が消える' }],
      correctId: 'A',
    },
    clearLine: '水の温度で、とける量が変わることが分かったね！',
  },
  {
    id: 'chem-15',
    index: 15,
    title: 'ものが燃える！',
      curriculum: { code: '理科 6年', unit: 'ものの燃え方と空気' },
    learningLine: '燃えている物にふたをして空気を止めると、火は消えてしまうよ。燃えるには空気が必要なんだ！',
    experiment: { kind: 'combustion' },
    normal: {
      prompt: '燃えている物を容器で覆って空気を遮ると、燃え続けることができなくなりました。このことから何が分かる？',
      choices: [{ id: 'A', text: '燃えることには空気が関係している' }, { id: 'B', text: '空気は燃えるために必要ない' }, { id: 'C', text: '物は永遠に燃え続ける' }],
      correctId: 'A',
    },
    easy: {
      prompt: '物が燃えることには空気が関係している？',
      choices: [{ id: 'A', text: '関係している' }, { id: 'B', text: '関係していない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '物が燃えるとき、空気はどのような役割をしている？',
      choices: [{ id: 'A', text: '燃焼に関係している' }, { id: 'B', text: 'まったく関係しない' }, { id: 'C', text: '物を冷やしている' }],
      correctId: 'A',
    },
    clearLine: 'ものが燃えるには、空気が関係していることが分かったね！',
  },
  {
    id: 'chem-16',
    index: 16,
    title: '水溶液ってなんだ？',
      curriculum: { code: '理科 6年', unit: '水溶液の性質' },
    learningLine: '食塩が水にとけて、すきとおった液になったものを「水溶液」というんだよ！',
    experiment: { kind: 'dissolve', cups: [{ label: '水', items: [{ label: '食塩', behavior: 'dissolve' }] }] },
    normal: {
      prompt: '食塩を水に溶かした食塩水について、正しい説明はどれ？',
      choices: [{ id: 'A', text: '食塩が水に溶けた水溶液' }, { id: 'B', text: '食塩が消えた水' }, { id: 'C', text: '水だけの液体' }],
      correctId: 'A',
    },
    easy: {
      prompt: '食塩水には食塩が溶けている？',
      choices: [{ id: 'A', text: 'はい' }, { id: 'B', text: 'いいえ' }],
      correctId: 'A',
    },
    retry: {
      prompt: '透明な食塩水をどこから取っても、基本的に同じような濃さになっています。これはなぜでしょうか？',
      choices: [{ id: 'A', text: '食塩が水全体に溶けているから' }, { id: 'B', text: '食塩が底にだけあるから' }, { id: 'C', text: '食塩が消えたから' }],
      correctId: 'A',
    },
    clearLine: '水にものがとけた液を水溶液ということが分かったね！',
  },
  {
    id: 'chem-17',
    index: 17,
    title: '酸性？中性？アルカリ性？',
      curriculum: { code: '理科 6年', unit: '水溶液の性質' },
    learningLine: '水溶液には酸性・中性・アルカリ性があり、リトマス紙の色の変化で調べられるよ！',
    experiment: {
      kind: 'litmus',
      solutions: [
        { label: 'レモン水', nature: 'acid' },
        { label: '食塩水', nature: 'neutral' },
        { label: '石けん水', nature: 'alkali' },
      ],
    },
    normal: {
      prompt: '水溶液には「酸性・中性・アルカリ性」という性質があります。リトマス紙などを使うと、水溶液の性質を調べることができます。正しいものはどれ？',
      choices: [{ id: 'A', text: '水溶液には性質の違いがある' }, { id: 'B', text: 'すべての水溶液は同じ性質' }, { id: 'C', text: '水溶液には性質がない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '水溶液には性質の違いがある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'ある水溶液を調べたところ、酸性を示す結果になりました。この水溶液は何性？',
      choices: [{ id: 'A', text: '酸性' }, { id: 'B', text: '中性' }, { id: 'C', text: 'アルカリ性' }],
      correctId: 'A',
    },
    clearLine: '水溶液には酸性・中性・アルカリ性があることが分かったね！',
  },
  {
    id: 'chem-18',
    index: 18,
    title: '水溶液と金属',
      curriculum: { code: '理科 6年', unit: '水溶液の性質' },
    learningLine: '水溶液の中には、金属を入れるとあわを出して金属を変化させるものがあるんだよ！',
    experiment: {
      kind: 'metal-acid',
      solutions: [
        { label: '塩酸', reacts: true },
        { label: '水', reacts: false },
        { label: '食塩水', reacts: false },
      ],
    },
    normal: {
      prompt: 'いろいろな水溶液に金属を入れて変化を調べました。水溶液によって金属に変化が起こるものがありました。このことから何が分かる？',
      choices: [{ id: 'A', text: '水溶液には金属を変化させるものがある' }, { id: 'B', text: 'すべての水溶液は金属を同じように変化させる' }, { id: 'C', text: '水溶液は金属にまったく関係しない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '水溶液によっては、金属を変化させるものがある？',
      choices: [{ id: 'A', text: 'ある' }, { id: 'B', text: 'ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '金属を水溶液に入れて観察すると、金属の様子が変化することがありました。このことから考えられることは？',
      choices: [{ id: 'A', text: '水溶液には金属を変化させる働きを持つものがある' }, { id: 'B', text: '金属はどんな水溶液でも必ず同じになる' }, { id: 'C', text: '水溶液には何も性質がない' }],
      correctId: 'A',
    },
    clearLine: '水溶液には金属を変化させるものがあることが分かったね！',
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
