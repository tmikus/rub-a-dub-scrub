const TERM_REGEX = /(?<=^|\b)(Jamie Cai|Jamie|Cai)(?=$|\b)/gi;
const SAFE_TERM = 'Anonymous';

function containsUnwantedTerm(text) {
  const cleanText = (text || '').trim().toLowerCase();
  TERM_REGEX.lastIndex = 0;
  return TERM_REGEX.test(cleanText);
}

function findNodesWithUnwantedTerm(node, result = { textNodes: [], titleNodes: []}) {
  if (!node) return result;
  if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent) return result;
    if (containsUnwantedTerm(node.textContent)) {
      result.textNodes.push(node);
    }
    return result;
  }
  if (containsUnwantedTerm(node.innerText)) {
    for (let index = 0; index < node.childNodes.length; index++) {
      const childNode = node.childNodes[index];
      findNodesWithUnwantedTerm(childNode, result)
    }
  }
  if (containsUnwantedTerm(node.title)) {
    result.titleNodes.push(node);
  }
  return result;
}

function removeUndesiredTerms() {
  const result = findNodesWithUnwantedTerm(document.body);
  replaceTextContent(result.textNodes);
  replaceTitleContent(result.titleNodes);
  replacePageTitle();
}

function replacePageTitle() {
  TERM_REGEX.lastIndex = 0;
  document.title = document.title.replaceAll(TERM_REGEX, SAFE_TERM);
}

function replaceTextContent(nodes) {
  for (const node of nodes) {
    TERM_REGEX.lastIndex = 0;
    node.textContent = node.textContent.replaceAll(TERM_REGEX, SAFE_TERM);
  }
}

function replaceTitleContent(nodes) {
  for (const node of nodes) {
    TERM_REGEX.lastIndex = 0;
    node.title = node.title.replaceAll(TERM_REGEX, SAFE_TERM);
  }
}

removeUndesiredTerms();
setInterval(removeUndesiredTerms, 100);
