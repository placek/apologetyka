var hideTiles = function(type) {
  document.querySelectorAll(type).forEach(function(el) { el.classList.add('hidden'); });
};
var showTiles = function(type) {
  document.querySelectorAll(type).forEach(function(el) { el.classList.remove('hidden'); });
};
document.getElementById('copy').onclick = function() {
  var copyText = document.getElementById('resultB');
  copyText.select();
  document.execCommand('copy');
};
document.getElementById('space').onclick = function() { placeText('&#160;'); };
document.getElementById('backspace').onclick = function() { removeText(); };
document.querySelectorAll('.keyboard span').forEach(function(el) {
  el.onclick = function() {
    placeText(el.innerText.replace(/[\u0020-\u9999<>\&]/gim, function(i) { return '&#' + i.charCodeAt(0) + ';'; }));
  }
});
var placeText = function(text) {
  var a = document.getElementById('resultA');
  var b = document.getElementById('resultB');
  var startPos = b.selectionStart;
  var endPos = b.selectionEnd;
  text = b.value.substring(0, startPos) + text + b.value.substring(endPos, b.value.length);
  b.value = text;
  a.innerText = decodeEntities(text);
  b.scrollTop = b.scrollHeight;
};
var removeText = function() {
  var a = document.getElementById('resultA');
  var b = document.getElementById('resultB');
  var text = b.value.replace(/&#\d+;$/, '');
  b.value = text;
  a.innerText = decodeEntities(text);
};
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
window.addEventListener('keydown', function(e) { if(e.keyCode == 32 && e.target == document.body) { e.preventDefault(); } });
document.onkeydown = function(e) {
  if(e.keyCode === 8) { removeText(); }
  if(e.keyCode == 32) { placeText('&#32;'); }
  if(e.keyCode === 27) { showTiles('.keyboard span'); }
};
document.onkeypress = function(e) {
  if(e.keyCode == 96) {
    hideTiles('.keyboard span'); showTiles('.keyboard span.ó')
  } else if(e.keyCode == 47) {
    hideTiles('.keyboard span'); showTiles('.keyboard span.J')
  } else {
    hideTiles('.keyboard span'); showTiles('.keyboard span.' + e.key);
  }
};

