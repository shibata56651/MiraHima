# Nodeバージョン
16.13.0

# webpackバージョン
webpack5

# gulpバージョン
v4
gulpのバージョンが古い場合は、グローバルと案件ディレクトリのgulpをv4系にインストールし直してください。

# 処理内容
* babel
* polifill
* 各js→main.jsへバンドル
* scss→cssコンパイル
* ejs→htmlコンパイル

# コマンド
## _install.bat
Nodeのバージョンとnpmのバージョンを合わせてください。
Nodistが入っている場合は、ローカルに.node-versionと.npm-versionがあるので対応不要です。

## _ejsCompile.bat
ejs→HTMLへコンパイルします。（gulpを使用）
監視状態に入るので、対応が済んだらctrl+cで処理から出てください。

## _lint-css.bat
cssをリンターにかけます。

## _lint-html.bat
htmlファイルをリンターにかけます。

## _start.bat
npm run build を実行し、product版のソースを吐き出します。
→製品版として圧縮をかけます。（js圧縮、css圧縮、mapの書き出し）

## _startDev.bat
npm run dev を実行し、developer用のソースを吐き出します。
→ 開発段階版として監視状態になり、視認性のあるソースを吐き出します。


## jestについて
### _startJest.bat
### _startJestTest.bat
### _startJestUpdate.bat

テンプレートページについてはHTMLスナップショットテストとビジュアルスナップショットテストを導入してあります。

たとえば`_dev/ejs/inc`内の.ejsファイルを編集すると、意図しない部分にも影響が及んでしまう場合があります。
たとえば`_dev/sass/mocules`内のスタイルを編集すると、意図しない部分の表示が崩れてしまう場合があります。

スナップショットテストはそれを気付かせてくれるツールです。実装ページのテストも欲しければ`__test__`フォルダにテストケースが入ってるので参考にしながら追加してください。

### 使い方

プロジェクトのルートに`.env`というファイルを生成してベーシック認証の情報を記載します。（これはコミットしてはいけない情報なので、.gitignoreに指定しています）

```env
USERNAME=ベーシック認証のユーザー名
PASSWORD=ベーシック認証のパスワード
```

あとは`npm test`を実行すれば、ビルド後にテストが走ります。

### jest.config.js

`_dev/jest.config.js`にはいくつか設定があります。

*   `isCompareDemo`: リポジトリに保存されているスナップショットのテスト対象をローカルにするかデモにするかを指定します。
*   `domain`: ビジュアルスナップショットで開くページのドメインを指定します。ローカルホストはhostsの設定によって変わるため、適宜変更ください。
*   `windowSize`: ビジュアルスナップショットテスト実行時のウインドウサイズを指定します。適宜変更ください。

##### テンプレート使用時のjs中身の説明
主に使用するものの説明しかしません。

###### modules > jsonGetData.js
jsonファイルを静的ページに反映します。
中のcreatElm系を任意のタグに変更してください。
現状はul>liに吐き出すようになっています。

###### modules > modal.js
modalに関しての機能が記載されています。
a11y対応済み。

###### modules > SmoothScroll.js
スムーススクロールの機能が記載されています。
アンカーリンクとページトップの機能があります。

###### modules > swiper.js
カルーセル機能（スワイパー）のライブラリの調整が記載されています。
バージョンによって記載を変更してください。

###### modules > tab.js
タブ機能が記載されています。

###### modules > xmlGetData.js
xmlファイルを静的ページに反映します。
中のcreatElm系を任意のタグに変更してください。
現状はul>liに吐き出すようになっています。

###### init.js
js有効時に付与する機能です。

###### utility > config.js
tabindexをいじる際のタグを指定しています。
CUSTOM_EVENT_NAMESは勉強しようとしている箇所なので削除してもらって構いません。

###### utility > OffsetTop.js
SmoothScrollでスクロール量を取得する機能です。

###### utility > UserAgent.js
ブラウザごとに表示を切り替えたい場合に、使用してください。
