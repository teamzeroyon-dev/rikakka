import type { QuizSet } from '@/lib/quizProblems'

// After the child balances the lever / hits the rubber-car goal (the 手を動かす
// phase), physics stages run the same normal→easy→retry quiz ladder as the chem
// and science stages. Keyed by problem id.
export const physicsQuiz: Record<string, QuizSet> = {
  'lever-01': {
    normal: {
      prompt: '同じ 重さの おもりを、支点から 同じ きょりに つるすと てこは どうなる？',
      choices: [{ id: 'A', text: '水平に つり合う' }, { id: 'B', text: '右が 下がる' }, { id: 'C', text: '左が 下がる' }],
      correctId: 'A',
    },
    easy: {
      prompt: '同じ 重さで 同じ きょりなら、てこは つり合う？',
      choices: [{ id: 'A', text: 'つり合う' }, { id: 'B', text: 'つり合わない' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'てこが つり合うのは、左右の「重さ × きょり」が どうなったとき？',
      choices: [{ id: 'A', text: '左と 右で 等しいとき' }, { id: 'B', text: '右が 大きいとき' }, { id: 'C', text: 'きょりは 関係ない' }],
      correctId: 'A',
    },
  },
  'lever-02': {
    normal: {
      prompt: '右の おもりが 左より 重いとき、水平にするには 右を どこに おく？',
      choices: [{ id: 'A', text: '支点に 近づける' }, { id: 'B', text: '支点から 遠ざける' }, { id: 'C', text: 'どこでも 同じ' }],
      correctId: 'A',
    },
    easy: {
      prompt: '重い おもりは、支点に 近い ほうが つり合いやすい？',
      choices: [{ id: 'A', text: '近い ほう' }, { id: 'B', text: '遠い ほう' }],
      correctId: 'A',
    },
    retry: {
      prompt: '10g を 支点から 6 の ところに つるしました。20g を つり合わせる きょりは？',
      choices: [{ id: 'A', text: '3' }, { id: 'B', text: '6' }, { id: 'C', text: '12' }],
      correctId: 'A',
    },
  },
  'lever-03': {
    normal: {
      prompt: 'てこが つり合う 組み合わせは、一つだけ？',
      choices: [{ id: 'A', text: 'いくつも ある' }, { id: 'B', text: '一つだけ' }, { id: 'C', text: 'つり合わない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '「重さ × きょり」が 左右で 等しければ つり合う？',
      choices: [{ id: 'A', text: '等しければ つり合う' }, { id: 'B', text: '関係ない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '15g × 4 と つり合うのは どれ？',
      choices: [{ id: 'A', text: '20g × 3' }, { id: 'B', text: '10g × 3' }, { id: 'C', text: '5g × 3' }],
      correctId: 'A',
    },
  },
  'rubber-01': {
    normal: {
      prompt: 'ゴムを 長く のばすほど、車は どうなる？',
      choices: [{ id: 'A', text: '遠くまで 進む' }, { id: 'B', text: '近くで 止まる' }, { id: 'C', text: '動かない' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'ゴムを のばして 手を はなすと、車は 進む？',
      choices: [{ id: 'A', text: '進む' }, { id: 'B', text: '進まない' }],
      correctId: 'A',
    },
    retry: {
      prompt: '車を もっと 遠くへ 進めたいとき、ゴムは どうする？',
      choices: [{ id: 'A', text: '長く のばす' }, { id: 'B', text: '短く のばす' }, { id: 'C', text: 'のばさない' }],
      correctId: 'A',
    },
  },
  'rubber-02': {
    normal: {
      prompt: '近い ゴールで ぴったり 止めるには、ゴムを どう のばす？',
      choices: [{ id: 'A', text: '短く のばす' }, { id: 'B', text: '長く のばす' }, { id: 'C', text: 'のばさない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '遠くへ 飛ばすには、ゴムを 長く のばす？',
      choices: [{ id: 'A', text: '長く のばす' }, { id: 'B', text: '短く のばす' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'のばす 長さと 進む きょりには、どんな きまりが ある？',
      choices: [{ id: 'A', text: 'のばすほど 遠くへ 進む' }, { id: 'B', text: 'のばすほど 近くで 止まる' }, { id: 'C', text: '関係ない' }],
      correctId: 'A',
    },
  },
  'rubber-03': {
    normal: {
      prompt: '同じ ゴールに 届かせるとき、ゴム 2本は 1本と くらべて どう？',
      choices: [{ id: 'A', text: '短く のばす だけで 届く' }, { id: 'B', text: 'もっと 長く のばす' }, { id: 'C', text: '同じ 長さ' }],
      correctId: 'A',
    },
    easy: {
      prompt: 'ゴムの 本数を 増やすと、車を 押す 力は?',
      choices: [{ id: 'A', text: '強く なる' }, { id: 'B', text: '弱く なる' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'ゴムを 2本に すると、同じ のばす 長さでも 車を 押す 力は？',
      choices: [{ id: 'A', text: '大きく なる' }, { id: 'B', text: '小さく なる' }, { id: 'C', text: '変わらない' }],
      correctId: 'A',
    },
  },
  'rubber-04': {
    normal: {
      prompt: 'ねらう ゴールが 遠いほど、ゴムは どう のばす？',
      choices: [{ id: 'A', text: '長く のばす' }, { id: 'B', text: '短く のばす' }, { id: 'C', text: '関係ない' }],
      correctId: 'A',
    },
    easy: {
      prompt: '近い ゴールは 短く、遠い ゴールは 長く のばす？',
      choices: [{ id: 'A', text: 'その とおり' }, { id: 'B', text: 'ぎゃく' }],
      correctId: 'A',
    },
    retry: {
      prompt: 'のばす 長さを 変えると、車の 進む きょりは どうなる？',
      choices: [{ id: 'A', text: '変わる' }, { id: 'B', text: 'いつも 同じ' }, { id: 'C', text: '止まる' }],
      correctId: 'A',
    },
  },
}

export function getPhysicsQuiz(id: string): QuizSet | undefined {
  return physicsQuiz[id]
}
