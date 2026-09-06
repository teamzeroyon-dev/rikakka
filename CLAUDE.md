# rikakka — プロジェクトメモ（Claude用）

小学生向け理科・算数の学習ゲーム（v0発）。Next.js 16 / React 19 / TypeScript / Tailwind v4 / Drizzle + Postgres。

## 作業ルール（ユーザー指定・重要）
- 返答は必ずこの3見出し構成にする：**・質問への回答 ・できなかったこと（あれば） ・提案**。冗長な説明は避ける（コンテクスト削減のため）。
- **質問は必ず AskUserQuestion ツールで**行う（本文中に散文で聞かない）。
- 困ったら・迷ったらこの CLAUDE.md を見直す。新しく分かった durable な知見は積極的にここへ追記する。
- コミットメッセージ末尾は `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。

## コマンド
- 依存: `npx pnpm@10 install`（pnpm未インストールなので npx 経由。npmは使わない＝lockfileはpnpm）
- 型: `npx pnpm@10 exec tsc --noEmit`
- ビルド: `npx pnpm@10 run build`（Turbopack, ~3s compile）
- 開発: `npx pnpm@10 run dev`（port 3000）

## デプロイ（GitHub → Vercel 自動）
- リポジトリ: `teamzeroyon-dev/rikakka`。**main へ push すると Vercel が自動デプロイ**。
- push認証: このPCの資格情報は GitHub `togarinozawa`。teamzeroyon-dev への write招待を承諾済み。
- v0 も同じ main に PR で入れてくる → **push前に必ず `git fetch` して分岐確認**。衝突したら rebase して両者の変更を残す。
- コミットメッセージ = 日本語UIだが英語で簡潔に。

## DB（本番で必須・未対応だと全ページ500）
- `lib/db/index.ts` は `process.env.DATABASE_URL` のみ参照。任意で `PG_POOL_MAX` / `PG_POOL_IDLE_MS`（未設定ならpg既定）。
- **初回に一度**：`DATABASE_URL='...' node scripts/setup-db.mjs`（CREATE + 不足カラムのALTER。冪等）。
- Neon の `neon_auth` スキーマは未使用（無視でOK）。アプリは `public` の6テーブル＋独自 `uid` クッキー認証のみ。
- Vercelの環境変数名は `DATABASE_URL`（`POSTGRES_URL`しかなければ同値で追加）。
- 直近の重要修正：`setup-db.mjs` の `problem_clears` は `count`＋`lastClearedAt`（旧 `clearedAt` はバグ）。`avatar_equipped` に `hair`/`hairColor` 追加。

## アーキテクチャ
- マップ: `components/WorldMap.tsx`（SVG島、ズーム/パン）。ノードは `lib/world.ts`。上部UIは `components/MapControls.tsx`。
- ステージ共通の流れ = **じっけん(手を動かす) → わかったこと → 例題(QuizFlow) → クリア**。枠は `components/StageShell.tsx`（テーマ: kagaku/chigaku/seibutsu/butsuri）。
  - 化学: `/chem/[id]` → `ChemStageClient` + `ChemExperiment`。データ `lib/quizProblems.ts`。
  - 地学/生物: `/s/[id]` → `ScienceStageClient` + `ScienceActivity`。データ `lib/scienceStages.ts`。
  - 物理: `/q/[id]` → `PhysicsStageClient`（Lever/LaunchCourse を手を動かす段に再利用）。データ `lib/problems.ts` + `lib/physicsQuiz.ts`。
- クイズ `components/QuizFlow.tsx`：選択肢は毎回シャッフル（正解が先頭固定だったため）。バッジは表示位置でA/B/C。
- 物体アイコン `components/ScienceIcons.tsx`：絵文字→手描きSVG（`ObjIcon`）。データは絵文字ラベルのまま、未描画は絵文字フォールバック。
- ドラッグ系アクティビティは `useDragDrop`（ゴースト追従＋elementFromPointで`[data-drop]`判定）。
- 社会とのつながり `lib/realWorld.ts` + `components/RealWorldCard.tsx`（学習フェーズに表示。`image`は`/public`に置いた自前画像用スロット）。
- 興味診断 `lib/diagnosis.ts`：**全教科**（てこ/ゴム/化学/地学/生物）のクリア数で職業判定（多数決、僅差タイブレークは順番のみ）。ホーム右上ピルに結果teaser（`CATEGORY_INFO[].nearName`、`THEME_INFO`はエイリアス）。
- 現実チャレンジ `lib/challenges.ts` + `ChallengeHub`/`ChallengeClient`（`/challenge`, `/challenge/[id]`）：現実シナリオの応用問題。物理（てこ・ゴム）のみ試作。RealWorldScene再利用＋シャッフルMC＋解説。クリアで`recordClear(challenge.id)`＝コイン付与（診断カテゴリには非該当）。ホーム右上にTargetボタンで入口。他教科は未実装。

- イントロ動画：`components/IntroOverlay.tsx`（`public/intro.mp4`）をホーム(`app/page.tsx`)で毎回全画面再生。音付き再生を試し、ブロックされたらミュート再生＋「音を出す」ボタン。スキップ/再生終了で消える。
- ランキング報酬：金額は `lib/economy.ts` の `WEEKLY_REWARD_BY_RANK=[50,30,15]`（cron `weekly-payout` と `RankingClient` で共有）。確定は毎週日曜18:00 JST（`lib/week.ts` の `nextWeekBoundary`、API `/api/ranking` が `nextResetAt`/`rewards` を返す）。

## デバッグモード（全ステージ開放）
- 入り方：ホームを `/?debug=1` で開く（`?debug=0`でOFF）。localStorageに保存（ブラウザ単位）。ONの間はマップ下に赤い「🐞 DEBUG」チップ→タップでOFF。
- 仕組み：`lib/debug.ts` + `getNodeStatus(...,debug)` がロックを無視して全ノード開放。`WorldMap`がマウント後にURL/LSを読み`MapSugoroku`と`handleNodeTap`へ渡す（SSRはfalse固定でハイドレーション回避）。
- 注意：未実装ノードは開放しても「もうすぐ/じゅんびちゅう」。ステージ自体は元々 `/chem/[id]` 等の直URLでも到達可（ゲートはマップのみ）。

## 既知の落とし穴 / 教訓
- **著作権**：ネットのGIF/画像を落として埋め込まない。自前 or 権利OKのみ（`RealWorldCard.image`）。
- **ローカルDB検証**：pglite-socketは不安定。実Postgresが必要なら `embedded-postgres` を scratchpad に立てる（port 5433, db `rikakka`）。`.env.local` に `DATABASE_URL` + `PG_POOL_MAX=1`。
- **プレビュー枠**：セッション途中でレイアウトが0pxに潰れたりスクショが古い状態を写すことがある。DOM(`get_page_text`/JS)で確認する方が確実。コード・ビルドの問題ではない。
- ドラッグの自動検証：`left_click_drag`は不安定。JSでpointer events(pointerdown→move→up、間にsleep)を投げ、`[data-drop]`の変化で判定するのが確実。
- 改行コードは CRLF（`.gitignore`/autocrlf）。tscとbuildが通ればOK。
