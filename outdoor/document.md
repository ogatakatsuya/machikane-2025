## 🎯 概要

- **目的**：屋外区分の回遊を促し、参加者がストーリー性のある謎解きを体験できるようにする。
- **形式**：受付で支払い後、ビラに記載されたURL（またはQRコード）からアクセスして遊ぶ。
- **構成**：全4章構成（共通棟 → かさね前 → 法経棟 → 共通棟）。

---

## 💡 基本ルール

| 項目 | 内容 |
| --- | --- |
| 参加方法 | 受付で支払い → ビラ受け取り（URL or QRコード記載） |
| チーム人数 | 制限なし（1人〜複数人でOK） |
| 制限時間 | なし（自由に進行可能） |
| 想定デバイス | スマートフォン |
| ヒント | 基本的には**なし**。分からない場合は「A101のスタッフに聞くと教えてくれるかも…？」という形で案内予定（ビラに記載） |
| 進行方式 | 各章の問題を順に解き進める形式（1章につき3〜4問程度） |

---

## 🗺️ 章構成とルート

| 章 | 場所 | 想定問題数 | 特徴 |
| --- | --- | --- | --- |
| 第1章 | 共通棟前 | 3〜4問 | スタート地点。最後の答えで「かさね前へ」誘導。 |
| 第2章 | かさね前 | 3〜4問 | 次の目的地として「法経棟へ」。 |
| 第3章 | 法経棟 | 3〜4問 | 次の目的地として「共通棟へ」。 |
| 第4章 | 共通棟前 | 3〜4問 | 最終ゴール。完走画面へ。 |

---

## 📱 想定される流れ（参加者体験）

1. **受付で参加登録**
    
    支払い → ビラ配布（URL/QR付き）
    
2. **アクセス＆スタート**
    
    スマホでURLを開き、チーム名を入力して開始。
    
3. **第1章（共通棟前）**
    
    画面上に「まずは共通棟前で謎を解こう」とポップアップ表示。
    
    → 問題を順に解く（3〜4問）。
    
    → 最後の問題は「次の場所へ向かおう」的な問題の想定
    
4. **章クリア画面**
    
    「第1章クリア！」の文字と、下部に「はんナビ」広告枠。
    
    「新たな謎に進む」ボタンを押すと次の章へ。
    
5. **第2章・第3章・第4章**
    
    各章の冒頭で「次は◯◯で謎を解こう」というポップアップと、
    
    簡単なマップ画像（ピン付き）を表示。
    
    右上のバツで閉じられるほか、下部のマップボタンから再表示可能。
    
6. **最終章クリア後**
    
    お祝いのメッセージと「完走画面」へ。
    
    ここでも「はんナビ」やSNSリンクを配置予定。
    

---

## 🗺️ マップ表示の想定

- 画像ベースの簡易マップ（例：共通棟周辺を写真＋ピンで示す）
- GPS連動はなし。
- 章の冒頭で「◯◯に移動しよう」と表示。
- 右下ボタンなどからいつでも再表示できる。

---

## 🧾 ビラ掲載内容（案）

> 🧩 屋外謎解きに挑戦しよう！
> 
> 
> 受付で受け取ったこのビラにあるQRコードからアクセス！
> 
> チーム名を決めて、4つのエリアを巡る謎に挑戦しよう。
> 
> 💡 **ヒントは基本なし！**
> 
> 分からないときは、**A101のスタッフに聞くと教えてくれるかも…？**
> 
> 📱 スマホ1台あればOK！
> 
> 制限時間もチーム人数も自由です。気軽にチャレンジしてみよう！
> 
> 🔗 はんナビでも他の企画をチェック！
> 
> https://www.i-maker.org/
> 

## sample implementation

```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>屋外謎解きゲーム デモ V3</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            overscroll-behavior: none;
        }
        .min-h-screen-ios {
            min-height: 100vh;
            min-height: -webkit-fill-available;
        }
        .fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        .fade-out {
            animation: fadeOut 0.3s ease-in forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .question-unlock {
            animation: unlock 0.5s ease-out forwards;
        }
        @keyframes unlock {
            0% { opacity: 0.6; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        /* 画面切り替え時のちらつき防止 */
        .screen {
            display: none;
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-800">

    <!-- アプリ全体のコンテナ -->
    <div id="app-container" class="max-w-lg mx-auto bg-gray-50 min-h-screen-ios shadow-lg relative overflow-hidden">

        <!-- 1. スタート画面 (初期表示) -->
        <div id="start-screen" class="screen p-8 flex flex-col justify-center min-h-screen-ios fade-in" style="display: flex;">
            <h1 class="text-3xl font-bold text-center text-blue-600 mb-10">大学探索謎解きゲーム</h1>
            <div class="space-y-6">
                <div>
                    <label for="team-name" class="block text-sm font-medium text-gray-700 mb-2">チーム名</label>
                    <input type="text" id="team-name" class="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" placeholder="例：謎解き探偵団">
                </div>
                <div>
                    <label for="team-size" class="block text-sm font-medium text-gray-700 mb-2">人数</label>
                    <select id="team-size" class="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-lg">
                        <option value="1">1人</option>
                        <option value="2">2人</option>
                        <option value="3">3人</option>
                        <option value="4">4人</option>
                        <option value="5">5人以上</option>
                    </select>
                </div>
            </div>
            <button id="start-button" class="w-full bg-blue-600 text-white font-bold py-5 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all mt-12 text-xl">
                ゲームスタート
            </button>
        </div>

        <!-- 2. 章（謎解き）画面 (初期非表示) -->
        <div id="chapter-screen" class="screen min-h-screen-ios" style="display: none;">
            <!-- ヘッダー -->
            <header class="bg-white shadow-md p-4 sticky top-0 z-10">
                <div class="flex justify-between items-center">
                    <span id="chapter-progress" class="text-sm font-semibold text-gray-500">第1章 / 全4章</span>
                    <span id="chapter-location" class="text-xl font-bold text-blue-600">共通棟前</span>
                </div>
            </header>
            
            <!-- 問題コンテナ (フッターの分だけ底上げ) -->
            <main id="question-container" class="p-4 md:p-6 space-y-4 pb-24">
                <!-- JavaScriptによって問題がここに挿入されます -->
            </main>

            <!-- マップ確認用フッター -->
            <footer class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
                <button id="show-map-button" class="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all text-base">
                    マップを確認する
                </button>
            </footer>
        </div>

        <!-- 3. 最終クリア画面 (初期非表示) -->
        <div id="final-clear-screen" class="screen p-6 flex-col justify-center items-center min-h-screen-ios text-center" style="display: none;">
            <h2 class="text-4xl font-bold text-amber-500 mb-4">完全クリア！</h2>
            <p class="text-xl font-semibold text-gray-800 mb-6">おめでとうございます！</p>
            <p class="text-lg text-gray-700 mb-10">すべての謎を解き明かしました！</p>
            
            <!-- ... 広告やSNSリンク ... -->
            <div class="w-full max-w-sm border border-gray-300 rounded-lg p-4 mb-6 shadow-lg mx-auto">
                <a href="https://www.i-maker.org/" target="_blank" rel="noopener noreferrer" class="block group">
                    <p class="text-sm font-bold text-blue-700 group-hover:underline">阪大生の「やりたい」が見つかる！【はんナビ】</p>
                    <p class="text-xs text-gray-600 mt-1">イベント情報やサークル探しはこちらから</p>
                </a>
            </div>

            <!-- SNS共有ボタン -->
            <div class="w-full max-w-sm mx-auto mt-8">
                <p class="text-sm text-gray-600 mb-4">クリアをシェアしよう！</p>
                <div class="flex justify-center space-x-5">
                    <!-- X (Twitter) -->
                    <a href="https://twitter.com/intent/tweet?text=大学探索謎解きゲームをクリアしました！%0A&hashtags=大学探索謎解き" target="_blank" rel="noopener noreferrer" class="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-3xl shadow-md hover:opacity-80 transition-opacity" aria-label="Xでシェア">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
                    </a>
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" class="w-14 h-14 bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl shadow-md hover:opacity-80 transition-opacity" aria-label="Instagramでシェア">
                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.227-1.669 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.669 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.142 0-3.504.012-4.726.068-2.759.126-3.951 1.319-4.077 4.077-.056 1.222-.068 1.583-.068 4.726s.012 3.504.068 4.726c.126 2.759 1.318 3.951 4.077 4.077 1.222.056 1.584.068 4.726.068s3.504-.012 4.726-.068c2.759-.126 3.951-1.318 4.077-4.077.056-1.222.068-1.584.068-4.726s-.012-3.504-.068-4.726c-.126-2.758-1.318-3.951-4.077-4.077-1.222-.056-1.584-.068-4.726-.068zM12 6.873c-2.825 0-5.127 2.302-5.127 5.127s2.302 5.127 5.127 5.127 5.127-2.302 5.127-5.127-2.302-5.127-5.127-5.127zm0 8.812c-2.031 0-3.685-1.654-3.685-3.685s1.654-3.685 3.685-3.685 3.685 1.654 3.685 3.685-1.654 3.685-3.685 3.685zm6.406-9.15c-.71 0-1.284.574-1.284 1.284s.574 1.284 1.284 1.284 1.284-.574 1.284-1.284-.574-1.284-1.284-1.284z"/></svg>
                </a>
            </div>
        </div>

            <button id="restart-button" class="w-full max-w-sm bg-gray-500 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:bg-gray-600 transition-all text-md mt-12 mx-auto">
                最初からやり直す
            </button>
        </div>


        <!-- ========== モーダル（ポップアップ）エリア ========== -->
        <div id="modal-overlay" class="fixed inset-0 bg-black/60 z-40 fade-in" style="display: none;"></div>
        
        <!-- (A) 場所案内モーダル -->
        <div id="location-modal" class="modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2.5rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 text-center fade-in" style="display: none;">
            <h3 id="location-modal-title" class="text-2xl font-bold text-gray-900 mb-5">次は「◯◯」で謎を解こう</h3>
            <div class="w-full h-48 md:h-64 overflow-hidden rounded-lg border border-gray-200 mb-5 shadow-inner">
                <!-- マップ画像（ダミーまたは指定画像） -->
                <img src="image_311d60.jpg" alt="マップ" class="w-full h-full object-cover object-center" onerror="this.src='https://placehold.co/400x300/cccccc/999999?text=Map+Image+Not+Found'">
            </div>
            <p class="text-gray-600 mb-6 text-sm">マップを参考に移動してください。</p>
            <!-- 閉じるボタン（共通クラス） -->
            <button class="modal-close-button w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all text-lg">
                閉じる
            </button>
        </div>

        <!-- (B) 章クリアモーダル -->
        <div id="chapter-clear-modal" class="modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2.5rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 text-center fade-in" style="display: none;">
            <h3 id="chapter-clear-title" class="text-3xl font-bold text-blue-600 mb-6">第1章クリア！</h3>
            <p class="text-lg text-gray-700 mb-8">おめでとうございます！</p>

            <!-- はんナビ広告枠 -->
            <div class="w-full border border-gray-300 rounded-lg p-4 mb-8 shadow-sm">
                <p class="text-xs text-gray-500 text-left mb-2">SPONSORED</p>
                <a href="https://www.i-maker.org/" target="_blank" rel="noopener noreferrer" class="block">
                    <img src="https://placehold.co/300x100/3B82F6/FFFFFF?text=はんナビ+(広告)&font=noto+sans+jp" alt="はんナビ 広告" class="w-full rounded-md">
                    <p class="text-sm font-semibold text-blue-700 mt-2 hover:underline">阪大生の「やりたい」が見つかる！ | はんナビ</p>
                </a>
            </div>

            <button id="next-chapter-button" class="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg">
                新たな謎に挑戦
            </button>
        </div>


    </div>

    <script>
        // --- ゲームデータ --------------------------------------------------
        const gameData = [
            {
                chapter: 1,
                title: "共通棟前",
                locationPopupText: "まずは「共通棟前」で謎を解こう",
                questions: [
                    { id: "1-1", title: "第1問", text: "共通棟前の謎その1。答えは「test」です。", answer: "test", image: "https://placehold.co/600x400/E0E7FF/4338CA?text=謎1の画像" },
                    { id: "1-2", title: "第2問", text: "共通棟前の謎その2。これも「test」。", answer: "test", image: "https://placehold.co/600x400/DBEAFE/1D4ED8?text=謎2の画像" },
                    { id: "1-3", title: "第3問", text: "共通棟最後の謎。次の場所へ向かうため、「test」と入力しよう。", answer: "test", image: "https://placehold.co/600x400/D1FAE5/047857?text=謎3の画像" },
                ]
            },
            {
                chapter: 2,
                title: "かさね前",
                locationPopupText: "次は「かさね前」で謎を解こう",
                questions: [
                    { id: "2-1", title: "第4問", text: "かさね前の謎その1。答えは「test」です。", answer: "test", image: "https://placehold.co/600x400/FEF3C7/B45309?text=謎4の画像" },
                    { id: "2-2", title: "第5問", text: "かさね前の謎その2。もちろん「test」。", answer: "test", image: "https://placehold.co/600x400/FEE2E2/B91C1C?text=謎5の画像" },
                    { id: "2-3", title: "第6問", text: "かさね最後の謎。次の場所へ行くために「test」と入力。", answer: "test", image: "https://placehold.co/600x400/F3E8FF/6B21A8?text=謎6の画像" },
                ]
            },
            {
                chapter: 3,
                title: "法経棟",
                locationPopupText: "次は「法経棟」で謎を解こう",
                questions: [
                    { id: "3-1", title: "第7問", text: "法経棟の謎その1。答えは「test」。", answer: "test", image: "https://placehold.co/600x400/ECFCCB/4D7C0F?text=謎7の画像" },
                    { id: "3-2", title: "第8問", text: "法経棟の謎その2。やっぱり「test」。", answer: "test", image: "https://placehold.co/600x400/CFFAFE/0E7490?text=謎8の画像" },
                    { id: "3-3", title: "第9問", text: "法経棟最後の謎。「test」と入力して最終章へ。", answer: "test", image: "https://placehold.co/600x400/E5E7EB/1F2937?text=謎9の画像" },
                ]
            },
            {
                chapter: 4,
                title: "共通棟前（最終）",
                locationPopupText: "最後は「共通棟」に戻って謎を解こう",
                questions: [
                    { id: "4-1", title: "第10問", text: "最終章の謎その1。「test」です。", answer: "test", image: "https://placehold.co/600x400/FFF7ED/D97706?text=謎10の画像" },
                    { id: "4-2", title: "第11問", text: "最終章の謎その2。あと少し！「test」。", answer: "test", image: "https://placehold.co/600x400/EFF6FF/1E40AF?text=謎11の画像" },
                    { id: "4-3", title: "第12問", text: "これが最後の謎だ！「test」と入力してクリアしよう！", answer: "test", image: "https://placehold.co/600x400/FDF4F4/E11D48?text=最後の謎の画像" },
                ]
            }
        ];

        // --- ゲーム状態 --------------------------------------------------
        const state = {
            currentChapter: 0, // 0: スタート画面, 1-4: ゲーム中
            teamName: "",
            teamSize: 1
        };

        // --- DOM要素 -----------------------------------------------------
        const $ = (selector) => document.querySelector(selector);
        const $$ = (selector) => document.querySelectorAll(selector);

        const screens = {
            start: $("#start-screen"),
            chapter: $("#chapter-screen"),
            finalClear: $("#final-clear-screen")
        };

        const modals = {
            overlay: $("#modal-overlay"),
            location: $("#location-modal"),
            chapterClear: $("#chapter-clear-modal")
        };

        const buttons = {
            start: $("#start-button"),
            nextChapter: $("#next-chapter-button"),
            restart: $("#restart-button"),
            closeModal: $$(".modal-close-button"),
            showMap: $("#show-map-button") // マップ確認ボタン
        };

        const textElements = {
            chapterProgress: $("#chapter-progress"),
            chapterLocation: $("#chapter-location"),
            locationModalTitle: $("#location-modal-title"),
            chapterClearTitle: $("#chapter-clear-title"),
        };

        const containers = {
            question: $("#question-container")
        };

        // --- 関数 --------------------------------------------------------

        /**
         * 画面を切り替える
         * @param {HTMLElement} showScreen 表示するスクリーン要素
         */
        function switchScreen(showScreen) {
            Object.values(screens).forEach(screen => {
                // 強制的に非表示に
                screen.style.display = "none";
                screen.classList.remove("fade-in");
            });

            // 対象のスクリーンだけ表示方法を分けて設定
            if (screen === screens.start || screen === screens.finalClear) {
                showScreen.style.display = "flex"; // flexboxレイアウト
            } else {
                showScreen.style.display = "block"; // 通常のブロックレイアウト
            }
            showScreen.classList.add("fade-in");
        }
        
        /**
         * モーダルを表示
         * @param {HTMLElement} modal - 表示するモーダル要素
         */
        function showModal(modal) {
            modals.overlay.style.display = "block";
            modal.style.display = "block";
        }

        /**
         * すべてのモーダルを閉じる
         */
        function closeModal() {
            modals.overlay.style.display = "none";
            Object.values(modals).forEach(modal => {
                if (modal !== modals.overlay) modal.style.display = "none";
            });
        }

        /**
         * 指定された章の問題をHTMLにロードする
         * @param {number} chapterNum - 章番号 (1-indexed)
         */
        function loadChapter(chapterNum) {
            const chapterData = gameData[chapterNum - 1];
            
            textElements.chapterProgress.textContent = `第${chapterData.chapter}章 / 全${gameData.length}章`;
            textElements.chapterLocation.textContent = chapterData.title;

            containers.question.innerHTML = ""; // コンテナをクリア

            chapterData.questions.forEach((q, index) => {
                const isLocked = index > 0; // 最初の問題以外はロック
                containers.question.innerHTML += createQuestionHTML(q, isLocked);
            });

            attachQuestionListeners();
        }

        /**
         * 問題カードのHTML文字列を生成
         * @param {object} qData - 問題データ
         * @param {boolean} isLocked - ロック状態か
         */
        function createQuestionHTML(qData, isLocked) {
            const lockIcon = `
                <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>`;
            
            if (isLocked) {
                return `
                <div id="q-block-${qData.id}" class="question-block locked bg-gray-100 rounded-xl shadow-md p-6 border border-gray-200 opacity-70 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gray-200/50 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        ${lockIcon}
                        <span class="ml-3 font-semibold text-gray-700">上の問題を解くとアンロックされます</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-500 mb-3">${qData.title}</h3>
                    <p class="text-gray-500 mb-4 select-none">（問題はロックされています）</p>
                </div>`;
            } else {
                // アクティブな問題のHTML (画像挿入)
                return `
                <div id="q-block-${qData.id}" class="question-block active bg-white rounded-xl shadow-lg p-6 border border-gray-200 question-unlock">
                    <h3 class="text-xl font-bold text-blue-600 mb-4">${qData.title}</h3>
                    <p class="text-gray-700 mb-5 leading-relaxed">${qData.text}</p>
                    
                    <!-- 画像表示エリア -->
                    <div class="my-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src="${qData.image}" alt="謎の画像" class="w-full h-auto object-cover">
                    </div>
                    
                    <!-- 回答フォームエリア -->
                    <div class="space-y-3 pt-4">
                        <input type="text" class="answer-input w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg" placeholder="答えを入力" data-question-id="${qData.id}">
                        <button class="submit-q-button w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all text-lg" data-question-id="${qData.id}">
                            回答する
                        </button>
                    </div>
                    <div class="message-area mt-3 text-sm min-h-[1.25rem]"></div>
                </div>`;
            }
        }

        /**
         * '.submit-q-button' と '.answer-input' にイベントリスナーを設定
         */
        function attachQuestionListeners() {
            $$('.submit-q-button').forEach(button => {
                button.onclick = handleAnswerSubmit;
            });

            $$('.answer-input').forEach(input => {
                input.onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        $(`.submit-q-button[data-question-id="${input.dataset.questionId}"]`).click();
                    }
                };
            });
        }

        /**
         * 回答ボタンが押された時の処理
         * @param {Event} event 
         */
        function handleAnswerSubmit(event) {
            const questionId = event.target.dataset.questionId;
            const block = $(`#q-block-${questionId}`);
            const input = $(`input[data-question-id="${questionId}"]`);
            const messageArea = block.querySelector('.message-area');
            const button = event.target;
            
            const [chapterIdx, qIdx] = questionId.split('-').map(n => parseInt(n));
            const qData = gameData[chapterIdx - 1].questions[qIdx - 1];

            if (input.value.trim().toLowerCase() === qData.answer.toLowerCase()) { // 答えを小文字に統一して比較
                // 正解
                messageArea.textContent = "正解！";
                messageArea.classList.add("text-green-600", "font-bold");
                messageArea.classList.remove("text-red-600");
                
                input.disabled = true;
                button.disabled = true;
                button.textContent = "クリア！";
                button.classList.add("bg-green-600", "hover:bg-green-600");
                block.classList.remove("active");
                block.classList.add("cleared");
                
                const nextBlock = block.nextElementSibling;
                if (nextBlock && nextBlock.classList.contains('locked')) {
                    // 次の問題をアンロック
                    const nextQId = nextBlock.id.replace('q-block-', '');
                    const [nextChapterIdx, nextQIdx] = nextQId.split('-').map(n => parseInt(n));
                    const nextQData = gameData[nextChapterIdx - 1].questions[nextQIdx - 1];
                    
                    nextBlock.outerHTML = createQuestionHTML(nextQData, false);
                    attachQuestionListeners(); // 新しい要素にリスナーを再設定
                } else if (!nextBlock) {
                    // この章の最後の問題だった
                    setTimeout(handleChapterClear, 500);
                }

            } else {
                // 不正解
                messageArea.textContent = "不正解...もう一度考えてみよう。";
                messageArea.classList.add("text-red-600", "font-bold");
                messageArea.classList.remove("text-green-600");
                if (navigator.vibrate) navigator.vibrate(100);
            }
        }
        
        /**
         * 章クリア時の処理
         */
        function handleChapterClear() {
            const chapterNum = state.currentChapter;
            if (chapterNum === gameData.length) {
                switchScreen(screens.finalClear);
            } else {
                textElements.chapterClearTitle.textContent = `第${chapterNum}章クリア！`;
                showModal(modals.chapterClear);
            }
        }
        
        /**
         * ゲームを初期化（リスタート）
         */
        function initGame() {
            state.currentChapter = 0;
            $(`#team-name`).value = "";
            $(`#team-size`).value = "1";
            switchScreen(screens.start);
        }


        // --- 初期化・イベントリスナー設定 ------------------------------------------

        // ゲームスタートボタン
        buttons.start.addEventListener("click", () => {
            state.teamName = $(`#team-name`).value || "名無しの探偵";
            state.teamSize = $(`#team-size`).value;
            state.currentChapter = 1;
            
            loadChapter(1); // 最初の章をロード
            
            const firstChapterData = gameData[0];
            textElements.locationModalTitle.textContent = firstChapterData.locationPopupText;
            showModal(modals.location);
            // 閉じるボタン（.modal-close-button）で章画面に遷移
        });

        // 「新たな謎に挑戦」ボタン（章クリアモーダル内）
        buttons.nextChapter.addEventListener("click", () => {
            closeModal(); // 章クリアモーダルを閉じる
            
            state.currentChapter++;
            loadChapter(state.currentChapter); // 次の章をロード
            
            const nextChapterData = gameData[state.currentChapter - 1];
            textElements.locationModalTitle.textContent = nextChapterData.locationPopupText;
            showModal(modals.location); // 次の場所案内モーダルを表示
        });
        
        // 「マップを確認する」ボタン（章画面フッター）
        buttons.showMap.addEventListener("click", () => {
            // 現在の章の場所案内テキストを取得してモーダルに設定
            const currentChapterData = gameData[state.currentChapter - 1];
            textElements.locationModalTitle.textContent = currentChapterData.locationPopupText;
            showModal(modals.location);
            // 閉じるボタン（.modal-close-button）で閉じるだけ
        });

        // モーダルを閉じるボタン（共通）
        buttons.closeModal.forEach(button => {
            button.addEventListener("click", () => {
                const wasLocationModalOpen = modals.location.style.display === "block";
                
                closeModal();
                
                // 場所案内モーダルが閉じられ、かつ、章画面がまだ表示されていない場合（＝ゲーム開始時や章移動時）のみ、章画面に切り替える
                if (wasLocationModalOpen && screens.chapter.style.display === 'none') {
                    switchScreen(screens.chapter);
                }
                // (マップ確認で開いた場合は、章画面はすでに 'block' なので、このifはfalseになり、画面遷移は起きない)
            });
        });

        // 最初からやり直すボタン
        buttons.restart.addEventListener("click", initGame);

        // 実行開始時
        // (CSSとHTMLのstyle属性により、#start-screen のみ表示される)

    </script>

</body>
</html>
```