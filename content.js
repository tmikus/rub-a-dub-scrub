function cleanUpElementWithFullName(node) {

}

function cleanUpElementsWithFullName() {
  forEachElementWithFullName(cleanUpElementWithFullName)
}

function forEachElementWithFullName(callback) {
  const xpath = "//[text()='Jamie Cai']";
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
