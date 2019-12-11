(function() {
  let $options = {
    accentTileSelector: 'accent',
    customTileSelector: 'custom',
    keyTileSelector: '.keyboard span',
    keyTiles: document.querySelectorAll('.keyboard span'),
    textPreview: document.querySelector('.keyboard-control .preview'),
    textBox: document.querySelector('.keyboard-control .box'),
    copyButton: document.querySelector('.keyboard-control .copy'),
    spaceButton: document.querySelector('.keyboard-control .space'),
    backspaceButton: document.querySelector('.keyboard-control .backspace')
  };

  var hideTiles = function(type) { document.querySelectorAll(type).forEach(function(el) { el.classList.add('hidden'); }); };
  var showTiles = function(type) { document.querySelectorAll(type).forEach(function(el) { el.classList.remove('hidden'); }); };
  var decodeEntities = (function() {
    var element = document.createElement('div');
    function decodeHTMLEntities (str) {
      if(str && typeof str === 'string') {
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
          element.innerHTML = str;
          str = element.textContent;
          element.textContent = '';
        }
      return str;
    }
    return decodeHTMLEntities;
  })();
  var copyText = function() { $options.textBox.select(); document.execCommand('copy'); };
  var placeText = function(value) {
    var startPos = $options.textBox.selectionStart;
    var endPos = $options.textBox.selectionEnd;
    var text = $options.textBox.value.substring(0, startPos) + value + $options.textBox.value.substring(endPos, $options.textBox.value.length);
    $options.textBox.value = text;
    $options.textPreview.innerText = decodeEntities(text);
    $options.textBox.scrollTop = $options.textBox.scrollHeight;
  };
  var removeText = function() {
    var text = $options.textBox.value.replace(/&#\d+;$/, '');
    $options.textBox.value = text;
    $options.textPreview.innerText = decodeEntities(text);
  };
  var typeNBSP = function() { placeText('&#160;'); };
  var typeKey =  function() { placeText(this.innerText.replace(/[\u0020-\u9999<>\&]/gim, function(i) { return '&#' + i.charCodeAt(0) + ';'; })); }
  var keyboardHandler = function(e) {
    switch(e.keyCode) {
      case 8:   removeText(); break;
      case 32:  if(e.target == document.body) { e.preventDefault(); } placeText('&#32;'); break;
      case 27:  showTiles($options.keyTileSelector); break;
      case 192: hideTiles($options.keyTileSelector); showTiles($options.keyTileSelector + '.' + $options.accentTileSelector); break;
      case 191: hideTiles($options.keyTileSelector); showTiles($options.keyTileSelector + '.' + $options.customTileSelector); break;
      default:
        if(e.keyCode >= 65 && e.keyCode <= 90) {
          hideTiles($options.keyTileSelector);
          showTiles($options.keyTileSelector + '.' + e.key);
        }
        break;
    }
  };

  document.onkeydown = keyboardHandler;
  $options.copyButton.onclick = copyText;
  $options.spaceButton.onclick = typeNBSP;
  $options.backspaceButton.onclick = removeText;
  $options.keyTiles.forEach(function(el) { el.onclick = typeKey; });
})();
