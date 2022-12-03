function cleanUpElementWithFullName(node) {
  if (!node.textContent) return;
  node.textContent = node.textContent.replace('Jamie Cai', 'Anonymous');
}

function cleanUpElementsWithFullName() {
  forEachElementWithFullName(cleanUpElementWithFullName);
}

function forEachElementWithFullName(callback) {
  const xpath = "//*[contains(text(), 'Jamie Cai')]";
  const matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );
  for (let itemIndex = 0; itemIndex < matchingElement.snapshotLength; itemIndex++) {
    const item = matchingElement.snapshotItem(itemIndex);
    callback(item);
  }
}

function removeUndesiredTerms() {
  cleanUpElementsWithFullName();
}

removeUndesiredTerms();
setInterval(removeUndesiredTerms, 100);
