// export class EventDispatcher {
//   // イベントタイプ -> リスナ配列のマップ
//   #listenerMap;

//   constructor() {
//     this.#listenerMap = {};
//   }

//   #getListeners = function(eventType) {
//     // イベントタイプに対するリスナ配列が存在しなかったら作成する
//     if(!this.#listenerMap[eventType]) {
//       this.#listenerMap[eventType] = [];
//     }

//     return this.#listenerMap[eventType];
//   }

//   // イベントタイプに対してコールバックを登録する
//   addEventListener(eventType, callback, options = {}) {
//     // リスナ情報を作る
//     const listener = {
//       once: !!options.once,
//       callback
//     };

//     // イベントのリスナを登録する
//     this.#getListeners(eventType).push(listener);
//   }

//   // コールバック関数をリスナ配列から削除する
//   removeEventListener(eventType, callback) {
//     const listenerList = this.#getListeners(eventType);
//     const index = listenerList.findIndex((lsn) => lsn.callback === callback);
//     if(index >= 0) {
//       listenerList.splice(index, 1);
//     }
//   }

//   // イベントを送出する
//   // イベントは
//   //     { type: 'test', message: 'Hello' }
//   // のようなオブジェクト
//   dispatchEvent(event) {
//     // イベントタイプに登録されている各リスナを呼び出す
//     // 呼び出し時には一応イベントオブジェクトも渡しておく
//     const listenerList = this.#getListeners(event.type);
//     for(const listener of listenerList) {
//       listener.callback(event); // 呼び出す
//     }

//     // onceリスナを削除する
//     const filtered = listenerList.filter((lsn) => !lsn.once);
//     this.#listenerMap[event.type] = filtered;
//   }
// }
