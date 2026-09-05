import type { RealWorldVisual } from '@/lib/problems'

// 現実チャレンジ — a separate section of real-world scenario problems that apply
// what the stages teach. Prototyped for physics (lever / rubber). Each question
// sets up a real situation and asks the child to apply the idea.
export type ChallengeChoiceId = 'A' | 'B' | 'C'

export type ChallengeQuestion = {
  scenario: string
  visual?: RealWorldVisual // reuses RealWorldScene when it fits
  emoji?: string // fallback illustration via ObjIcon
  prompt: string
  choices: { id: ChallengeChoiceId; text: string }[]
  correctId: ChallengeChoiceId
  explain: string
}

export type Challenge = {
  id: string
  category: 'lever' | 'rubber'
  title: string
  intro: string
  questions: ChallengeQuestion[]
}

export const challenges: Challenge[] = [
  {
    id: 'challenge-lever',
    category: 'lever',
    title: 'てこの 現実チャレンジ',
    intro: 'みの まわりの「てこ」を つかった どうぐで、学んだ ことを ためそう！',
    questions: [
      {
        scenario: '体重の おもい お兄さんと、かるい 妹が シーソーに のったよ。',
        visual: 'seesaw',
        prompt: 'シーソーを 水平に するには、どうすれば いい？',
        choices: [
          { id: 'A', text: 'お兄さんが まん中（支点）に 近づく' },
          { id: 'B', text: '妹が まん中に 近づく' },
          { id: 'C', text: 'できない' },
        ],
        correctId: 'A',
        explain: 'おもい ほうを 支点に 近づけると、「重さ × きょり」が つり合うんだ。',
      },
      {
        scenario: 'かたい くぎを、バール（くぎぬき）で ぬきたい。',
        visual: 'nail-puller',
        prompt: '小さな 力で ぬくには、どこを 持つと いい？',
        choices: [
          { id: 'A', text: 'くぎから 遠い、はしの ほう' },
          { id: 'B', text: 'くぎに 近い ところ' },
          { id: 'C', text: 'どこでも 同じ' },
        ],
        correctId: 'A',
        explain: '支点から 遠い ところを 持つほど、小さな 力で 大きな 力を 出せるんだ。',
      },
      {
        scenario: 'あつい 紙を はさみで 切るよ。',
        emoji: '🪨',
        prompt: 'かたい ものは、はさみの どこで 切ると 楽？',
        choices: [
          { id: 'A', text: 'ねもと（支点に 近い ところ）' },
          { id: 'B', text: '先っぽ' },
          { id: 'C', text: 'まん中' },
        ],
        correctId: 'A',
        explain: 'はさみも てこ。支点に 近い ねもとで 切ると、大きな 力が かかるんだ。',
      },
      {
        scenario: 'お店の はかり（てんびん）で、くだものの 重さを はかるよ。',
        visual: 'scale',
        prompt: 'てんびんが 水平で 止まったとき、左右の 重さは？',
        choices: [
          { id: 'A', text: '同じ' },
          { id: 'B', text: '右が おもい' },
          { id: 'C', text: '左が おもい' },
        ],
        correctId: 'A',
        explain: 'てんびんは てこの つり合いで 重さを くらべる どうぐ。水平＝左右 同じ 重さだよ。',
      },
    ],
  },
  {
    id: 'challenge-rubber',
    category: 'rubber',
    title: 'ゴムの 現実チャレンジ',
    intro: 'ゴムや バネの 力を つかう どうぐで、学んだ ことを ためそう！',
    questions: [
      {
        scenario: 'パチンコ（スリングショット）で、遠くの まとを ねらうよ。',
        visual: 'slingshot',
        prompt: '遠くまで とばすには、ゴムを どうする？',
        choices: [
          { id: 'A', text: '長く 引っぱる' },
          { id: 'B', text: '短く 引っぱる' },
          { id: 'C', text: '引っぱらない' },
        ],
        correctId: 'A',
        explain: 'ゴムを 長く のばすほど、もとに もどる 力が 大きく なって 遠くへ とぶんだ。',
      },
      {
        scenario: '輪ゴム鉄砲で、近くの まとに そっと あてたい。',
        visual: 'slingshot',
        prompt: 'ゴムは どう すれば いい？',
        choices: [
          { id: 'A', text: '短く 引く' },
          { id: 'B', text: 'めいっぱい 引く' },
          { id: 'C', text: '引かない' },
        ],
        correctId: 'A',
        explain: '近い まとには 短く。のばす 長さで とぶ きょりを 調整できるんだ。',
      },
      {
        scenario: 'ゴム動力の もけい飛行機を、もっと 遠くへ とばしたい。',
        emoji: '💨',
        prompt: 'プロペラの ゴムは どう する？',
        choices: [
          { id: 'A', text: 'たくさん まいて 強く する' },
          { id: 'B', text: 'ゆるく する' },
          { id: 'C', text: 'はずす' },
        ],
        correctId: 'A',
        explain: 'ゴムを たくさん まくほど、ためた 力が 大きく なって 長く 飛ぶんだ。',
      },
      {
        scenario: 'アーチェリーで、弓を ぐっと 強く 引いたよ。',
        visual: 'archery',
        prompt: '弓を 強く 引くほど、矢は どうなる？',
        choices: [
          { id: 'A', text: '速く、遠くへ とぶ' },
          { id: 'B', text: '近くで おちる' },
          { id: 'C', text: 'とばない' },
        ],
        correctId: 'A',
        explain: '弓も「もとに もどろうと する 力」。強く 引くほど 矢に つたわる 力が 大きいんだ。',
      },
    ],
  },
]

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}
