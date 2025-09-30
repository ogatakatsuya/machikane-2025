# Frontend開発ドキュメント

## 概要

本プロジェクトは謎解きクイズアプリケーションのフロントエンドです。Next.js + TypeScript + TailwindCSS + Biomeを使用して構築されています。

## 技術スタック

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| Framework | Next.js | 15.x | React フレームワーク (App Router) |
| Language | TypeScript | 5.x | 型安全なJavaScript |
| Styling | TailwindCSS | 4.x | ユーティリティファーストCSS |
| Package Manager | pnpm | 8.x+ | 高速なパッケージマネージャー |
| Linter/Formatter | Biome | 2.x | コード品質管理 |
| Form | React Hook Form | 7.x | フォーム管理 |
| Validation | Zod | 4.x | スキーマバリデーション |
| Icons | React Icons | 5.x | アイコンライブラリ |

## プロジェクト構成

```
frontend/
├── docs/                   # プロジェクトドキュメント
├── public/                 # 静的ファイル
│   ├── *.png              # 画像ファイル
│   └── *.svg              # SVGファイル
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # グローバルCSS
│   │   ├── layout.tsx     # ルートレイアウト
│   │   ├── page.tsx       # トップページ
│   │   └── */[param]/page.tsx  # 動的ルート
│   ├── components/        # 共通コンポーネント
│   ├── features/         # 機能別コンポーネント
│   ├── hooks/            # カスタムフック
│   └── lib/              # ユーティリティ・定数
├── biome.json            # Biome設定
├── package.json          # パッケージ依存関係
├── tailwind.config.ts    # TailwindCSS設定
└── tsconfig.json         # TypeScript設定
```

## コーディング規約

### 1. ファイル・ディレクトリ命名規則

- **コンポーネントファイル**: PascalCase (`HomePage.tsx`, `RegisterForm.tsx`)
- **フック**: camelCaseで`use`接頭辞 (`useRegisterForm.ts`)
- **ユーティリティ**: camelCase (`constants.ts`, `utils.ts`)
- **ディレクトリ**: camelCase (`components/`, `features/`)

### 2. コンポーネント設計

#### ファイル構成
```typescript
"use client"; // クライアントコンポーネントの場合のみ

import { useState } from "react";
import Link from "next/link";

// 型定義
interface ComponentProps {
  id: string;
  title: string;
}

// メインコンポーネント
const ComponentName = ({ id, title }: ComponentProps) => {
  // ロジック
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

#### Server Component vs Client Component
- **Server Component**: デフォルト（データフェッチ、SEO重要）
- **Client Component**: Hooks使用時、インタラクティブ要素に`"use client"`追加

### 3. スタイリング規約

#### TailwindCSS使用方針
```tsx
// ✅ 推奨: Tailwindユーティリティクラス使用
<div className="max-w-4xl mx-auto p-4 bg-white rounded-md shadow-lg">

// ❌ 非推奨: カスタムCSS
<div className="custom-container">
```

#### レスポンシブデザイン
```tsx
// モバイルファースト
<div className="w-full md:w-1/2 lg:w-1/3">
```

#### 色彩規則
- **プライマリ**: blue-800, blue-600
- **エラー**: red-500
- **成功**: green-500
- **背景**: gray-100, white

### 4. TypeScript規約

#### 型定義
```typescript
// Props型定義
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

// API型定義
interface QuizSet {
  id: number;
  sub_id: string;
  title: string;
  description: string;
}
```

#### フック型定義
```typescript
// カスタムフック
export const useCustomHook = (param: string) => {
  const [state, setState] = useState<Type | null>(null);
  
  return {
    state,
    actions: {
      update: setState,
    },
  };
};
```

### 5. フォーム管理

React Hook Form + Zodを使用:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "必須項目です"),
  age: z.number().min(0, "0以上を入力してください"),
});

type FormData = z.infer<typeof schema>;

const useCustomForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  return { register, handleSubmit, errors };
};
```

### 6. エラーハンドリング

```typescript
// API呼び出し
const fetchData = async () => {
  try {
    const response = await api.getData();
    // 成功処理
  } catch (error) {
    console.error("データ取得エラー:", error);
    // エラー処理
  }
};
```

### 7. パフォーマンス最適化

#### 画像最適化
```tsx
import Image from "next/image";

<Image
  src="/image.png"
  alt="説明"
  width={500}
  height={300}
  priority // 重要な画像の場合
/>
```

#### 動的インポート
```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>読み込み中...</p>,
});
```

## 開発ワークフロー

### 1. 新機能開発

1. **要件確認**: 機能要件を明確化
2. **設計**: コンポーネント設計・API設計
3. **実装**: コンポーネント・フック・ページ作成
4. **テスト**: 動作確認
5. **リント・フォーマット**: `pnpm lint && pnpm format`
6. **ドキュメント更新**: 必要に応じてドキュメント更新

### 2. コード品質管理

#### Biome設定
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

#### 実行コマンド
```bash
# リント実行
pnpm lint

# フォーマット実行
pnpm format

# 型チェック
pnpm type-check
```

## AIエージェント向けガイドライン

### 🤖 重要: コード完成後の必須チェック項目

コードを書き終わった後は、必ず以下を実行してください：

#### 1. ドキュメント更新確認
- [ ] 新しいコンポーネント・フック・機能を追加した場合、このドキュメントの更新が必要ないか確認
- [ ] プロジェクト構成に変更があった場合、README.mdの更新が必要ないか確認
- [ ] 新しい技術・ライブラリを追加した場合、技術スタック表の更新が必要ないか確認

#### 2. コード品質チェック（必須実行）
```bash
# 必ず実行: リント + フォーマット
pnpm lint && pnpm format
```

#### 3. 動作確認
```bash
# 開発サーバー起動確認
pnpm dev
```

#### 4. ビルド確認
```bash
# 本番ビルド確認
pnpm build
```

### エラー対応パターン

#### よくあるエラーと対処法

1. **"use client"エラー**
   - React Hooks使用時は`"use client"`をファイル先頭に追加

2. **TailwindCSS未反映**
   - `tailwind.config.ts`の`content`にファイルパスが含まれているか確認

3. **型エラー**
   - プロパティの型定義を確認
   - `any`型の使用は避ける

4. **リントエラー**
   - `pnpm format`で自動修正可能なものは修正
   - 手動修正が必要なものは規約に従って修正

## トラブルシューティング

### よくある問題

1. **パッケージインストール失敗**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **型エラー**
   ```bash
   pnpm type-check
   ```

3. **キャッシュ問題**
   ```bash
   pnpm dev --force
   ```

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Biome Documentation](https://biomejs.dev/)

---

**更新日**: 2024-09-30  
**バージョン**: 1.0.0
