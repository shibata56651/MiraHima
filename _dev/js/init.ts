(function (doc) {
  const html = doc.documentElement;
  const isJsEnabled = html && 1 === html.nodeType; // JSの有効・無効判定

  if (isJsEnabled) {
    html.setAttribute('data-script-enabled', 'true');
  }
}(document));
