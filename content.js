const TERM_REGEX = /(Jamie Cai|Jamie|Cai)/gi;

function findNodesWithUnwantedTerm(node, result) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent) return;
    let cleanTextContent = node.textContent.trim().toLowerCase();
    if (
      cleanTextContent.includes("jamie cai")
      || cleanTextContent === 'jamie'
      || cleanTextContent === 'cai'
      || cleanTextContent === 'cai\'s'
    ) {
      result.push(node);
    }
    return;
  }
  if (!node.innerText) return;
  const cleanInnerText = node.innerText.trim().toLowerCase();
  if (
    cleanInnerText !== 'jamie'
    && cleanInnerText !== 'cai'
    && cleanInnerText !== 'cai\'s'
    && !cleanInnerText.includes("jamie cai")
  ) {
    return;
  }
  for (let index = 0; index < node.childNodes.length; index++) {
    const childNode = node.childNodes[index];
    findNodesWithUnwantedTerm(childNode, result)
  }
}

function removeUndesiredTerms() {
  const foundNodes = [];
  findNodesWithUnwantedTerm(document.body, foundNodes);
  replaceNodesWithCalmingText(foundNodes);
}

function replaceNodesWithCalmingText(nodes) {
  for (const node of nodes) {
    debugger;
    node.textContent = node.textContent.replaceAll(/(Jamie Cai|Jamie|Cai)/gi, "Anonymous");
  }
}

removeUndesiredTerms();
setInterval(removeUndesiredTerms, 100);
