# web2023-partial

開発中サイトの動画組み込みページ向けの制御スクリプトです。

## スクリプトの概要
- すべての動画について、表示領域に応じて自動的に再生・停止を行います。
- スポンジ硬度説明動画は、再生タイムフレーム同期を行います。

## 組み込み方法

### スポンジ硬度説明

- `dist/asset` 以下の動画ファイルをコピーします。
- 対象`video`タグに下記の属性を付与します。
```
muted loop preload data-artisan-sync-play
```

### エイムスタイル説明
- `dist/asset` 以下の動画ファイルをコピーします。
- 対象`video`タグに下記の属性を付与します。
```
muted loop preload data-artisan-autopause
```
- 該当Rowの下に下記のようなコピーライト表記を追記してください。デザインはお任せします。
```
<div>
    &copy;
    <a href="https://www.diabotical.com/" target="_blank" rel="noopener noreferrer">
        Diabotical
    </a>, courtesy and copyright of <a href="http://www.thegdstudio.com/" target="_blank" rel="noopener noreferrer">GD Studio</a>.
</div>
```

## スクリプトのロード
- `<script defer>` タグを用いて`body`内でスクリプトを読み込んでください。

注意: 現時点ではdefer属性または明示的にDOM構築後に実行する必要があります。\
ソースをそのままHTML上に記述する必要がある場合は、書き換えますのでお申し付けください。


## ファイル構成

- `dist/index.js` \
スクリプト本体

- `dist/assets/videos/*.webm` \
動画ファイル

- `dist/index.html` \
実装例

- `src/index.ts` \
スクリプトソースファイル

## ビルド

1. yarn install
2. yarn build
