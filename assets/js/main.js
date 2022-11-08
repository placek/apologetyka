var S = {};

S.toc = function() {
  let toc          = document.createElement('div');
  let tocTrigger   = document.createElement('div');
  let tocContents  = document.createElement('div');
  let container    = document.querySelector('body');
  let level        = 0;
  let tocInnerHTML = '';

  tocContents.classList.add('toc-contents');
  tocContents.style = 'visibility: hidden; display: block; position: fixed; bottom: 0; background-color: var(--base2); max-width: 40%; padding: 1em; z-index: 1; right: 0; overflow: hidden scroll; max-height: 80vh; border-top: 1px solid var(--blue); border-left: 1px solid var(--blue);';

  tocTrigger.classList.add('toc-trigger');
  tocTrigger.innerHTML = 'Spis treści';
  tocTrigger.style = 'position: fixed; display: inline-block; bottom: 0; right: 0; background-color: var(--base2); color: var(--blue); padding: .5em 1em; font-family: Iosevka; cursor: pointer; border-top: 1px solid var(--blue); border-left: 1px solid var(--blue);';

  toc.onmouseover = function() { tocContents.style.visibility = 'visible'; };
  toc.onmouseout = function() { tocContents.style.visibility = 'hidden'; };
  toc.appendChild(tocTrigger);
  toc.appendChild(tocContents);

  container.innerHTML = container.innerHTML.replace(/<h([\d])>([^<]+)<\/h([\d])>/gi, function (str, openLevel, titleText, closeLevel) {
    if (openLevel != closeLevel) { return str; }
    if (openLevel > level) {
      tocInnerHTML += (new Array(openLevel - level + 1)).join('<ol>');
    } else if (openLevel < level) {
      tocInnerHTML += (new Array(level - openLevel + 1)).join('</li></ol>');
    } else {
      tocInnerHTML += (new Array(level+ 1)).join('</li>');
    }
    level = parseInt(openLevel);
    let anchor = titleText.replace(/ /g, "_");
    tocInnerHTML += '<li><a href="#' + anchor + '">' + titleText + '</a>';
    return '<h' + openLevel + '><a href="#' + anchor + '" id="' + anchor + '">' + titleText + '</a></h' + closeLevel + '>';
  });

  if (level) {
    tocInnerHTML += (new Array(level + 1)).join('</ol>');
  }
  tocContents.innerHTML = tocInnerHTML;
  tocContents.querySelectorAll('ol').forEach(function(e) { e.style = 'padding: 0 0 0 1em; margin: 0;'; });
  tocContents.querySelectorAll('li').forEach(function(e) { e.style = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'; });
  container.prepend(toc);
};

S.links = function(selector, destination) {
  document.querySelectorAll(selector).forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/\b(\d?[A-Z][a-z]{0,2}) (\d+)[\.,](\d+)(-\d+)?/g, function(m, book, chapter, verse, rest) {
      return '<a href="' + destination + '/' + book.toLowerCase() + '.html#' + chapter + '.' + verse + '">' + book + ' ' + chapter + '.' + verse + (rest || '') + '</a>';
    });
  })
};
