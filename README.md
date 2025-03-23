# MeetChain

MeetChainは、NFCタグを使って大切な人（友人、恋人、家族など）との出会いを記録するアプリです。ユーザーは特定の人に関連付けられたNFCタグをスキャンすることで、出会いの回数をカウントし、関係の深まりを可視化できます。

## 主な機能

- NFC技術を活用した人との出会いの記録
- 人ごとの出会った回数のカウントと記録
- 人との関係性の管理（友達、パートナー、家族）
- 思い出の保存機能
- ビジュアルに優れたカードUIで人との繋がりを表現

## 技術スタック

- React Native (0.72.6)
- TypeScript
- Redux Toolkit
- AsyncStorage
- react-native-nfc-manager
- React Navigation

## プロジェクト構造

```
MeetChain/
├── src/
│   ├── components/        # 再利用可能なUIコンポーネント
│   │   └── cards/         # カードUI関連コンポーネント
│   ├── navigation/        # 画面遷移の設定
│   ├── screens/           # アプリ画面
│   │   ├── home/          # メイン画面
│   │   ├── profile/       # プロフィール管理画面
│   │   └── nfc/           # NFCスキャン画面
│   ├── services/          # APIやNFC操作などのサービス
│   ├── store/             # Reduxストア設定
│   │   └── slices/        # Reduxスライス
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   └── App.tsx            # アプリルートコンポーネント
```

## セットアップ手順

### 必要条件

- Node.js v18.x以上（推奨: v20.x）
- npm v9.x以上またはYarn v1.22.x以上
- Android Studio（Androidの実機テスト用）
- Xcode（iOSの実機テスト用、Macのみ）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/kaim1005kaim/mcp_test.git

# プロジェクトディレクトリに移動
cd mcp_test

# 依存関係をインストール
npm install

# iOSの依存関係をインストール（Macのみ）
cd ios && pod install && cd ..
```

### 実行方法

```bash
# 開発サーバーを起動
npm start

# Androidアプリを実行
npm run android

# iOSアプリを実行（Macのみ）
npm run ios
```

## NFCの設定

### Android

1. 設定アプリを開く
2. 「接続」または「接続済みのデバイス」を選択
3. 「NFC」をオンにする

### iOS

1. iOS 13以降では、バックグラウンドNFCスキャンをサポート
2. アプリのInfo.plistに適切な権限が必要
3. 設定 > NFC > MeetChainを有効にする

## 開発者向け情報

### テスト

```bash
# テストを実行
npm test
```

### パフォーマンス最適化とデバッグのヒント

- 大きなリストにはVirtualizedListまたはFlatListを使用
- AsyncStorageの使用を最小限に抑える
- NPCスキャン時のエラーハンドリングを適切に行う

## ライセンス

MITライセンス