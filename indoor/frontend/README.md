# 謎解きクイズアプリ Frontend

Next.js + TypeScript + TailwindCSS + pnpm + Biomeで構築されたクイズアプリケーションのフロントエンドです。

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Package Manager**: pnpm
- **Linter/Formatter**: Biome
- **Form Management**: React Hook Form + Zod
- **UI Components**: React Icons

## 起動方法

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてアプリケーションを確認できます。

### 3. その他のコマンド

```bash
# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント実行
pnpm lint

# フォーマット実行
pnpm format
```

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ (/)
│   ├── home/[quiz_set_id]/page.tsx    # ホーム画面
│   ├── register/[quiz_set_id]/page.tsx # 登録画面
│   └── quiz/[quiz_set_id]/page.tsx    # クイズ画面
├── components/            # 共通コンポーネント
│   ├── QuizIndex.tsx     # 問題セット一覧
│   └── RegisterForm.tsx  # 登録フォーム
├── features/             # 機能別コンポーネント
│   ├── Home.tsx         # ホーム画面
│   ├── Register.tsx     # 登録画面
│   └── Quiz.tsx         # クイズ画面
├── hooks/               # カスタムフック
│   └── useRegisterForm.ts
└── lib/                 # ユーティリティ
    └── constants.ts     # 定数定義
```

## 主要機能

- 問題セット一覧表示
- ユーザー登録（チーム名・メンバー数）
- クイズ実行画面
- レスポンシブデザイン対応

## 開発環境

- Node.js 18+
- pnpm 8+
- TypeScript 5+

## コードスタイル

プロジェクトではBiomeを使用してコードの品質を管理しています。コミット前に以下を実行してください：

```bash
pnpm lint    # リント実行
pnpm format  # フォーマット実行
```