const FROM_EMAIL = atob('Zmx5YnljYWk=');
const TO_EMAIL = atob('bGVhcGV0ZWM=');

const EMAIL_REGEX = new RegExp(`(?<=^|\\b)${FROM_EMAIL}(?=$|\\b|@)`, 'g');

const FROM_FULL_NAME = atob('SmFtaWUgQ2Fp');
const [FROM_FIRST_NAME, FROM_LAST_NAME] = FROM_FULL_NAME.split(' ');
const TO_FULL_NAME = atob('UGV0ZXIgTGVhY2g=');
const [TO_FIRST_NAME, TO_LAST_NAME] = TO_FULL_NAME.split(' ');

const FULL_NAME_REGEX = new RegExp(`(?<=^|\\b)${FROM_FULL_NAME}(?=$|\\b)`, 'gi');
const FIRST_NAME_REGEX = new RegExp(`(?<=^|\\b)${FROM_FIRST_NAME}(?=$|\\b)`, 'gi');
const LAST_NAME_REGEX = new RegExp(`(?<=^|\\b)${FROM_LAST_NAME}(?=$|\\b)`, 'gi');
const TERM_REGEX = new RegExp(`(?<=^|\\b)(${FROM_FULL_NAME}|${FROM_FIRST_NAME}|${FROM_LAST_NAME})(?=$|\\b)`, 'gi');
const ACCEPTABLE_DISTANCE_FROM_LAST_MATCH = 5;

function containsFullMatch(text) {
  const cleanText = (text || '').trim();
  FULL_NAME_REGEX.lastIndex = 0;
  return FULL_NAME_REGEX.test(cleanText);
}

function containsUnwantedTerm(text, distanceFromLastFullMatch) {
  const cleanText = (text || '').trim();
  EMAIL_REGEX.lastIndex = 0;
  if (EMAIL_REGEX.test(cleanText)) return true;
  if (distanceFromLastFullMatch > ACCEPTABLE_DISTANCE_FROM_LAST_MATCH) {
    return false;
  }
  TERM_REGEX.lastIndex = 0;
  return TERM_REGEX.test(cleanText);
}

function findNodesWithUnwantedTerm(
  node,
  result = { textNodes: [], titleNodes: []},
  distanceFromLastFullMatch = 0,
) {
  if (!node) return result;
  if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent) return result;
    if (containsUnwantedTerm(node.textContent, distanceFromLastFullMatch)) {
      result.textNodes.push(node);
    }
    return result;
  }
  if (containsFullMatch(node.innerText)) {
    distanceFromLastFullMatch = 0;
  }
  if (containsUnwantedTerm(node.innerText, distanceFromLastFullMatch)) {
    for (let index = 0; index < node.childNodes.length; index++) {
      const childNode = node.childNodes[index];
      findNodesWithUnwantedTerm(childNode, result, distanceFromLastFullMatch + 1)
    }
  }
  if (containsFullMatch(node.title)) {
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
  FULL_NAME_REGEX.lastIndex = 0;
  document.title = document.title.replaceAll(FULL_NAME_REGEX, TO_FULL_NAME);
}

function replaceTextContent(nodes) {
  for (const node of nodes) {
    FULL_NAME_REGEX.lastIndex = 0;
    FIRST_NAME_REGEX.lastIndex = 0;
    LAST_NAME_REGEX.lastIndex = 0;
    node.textContent = node.textContent
      .replaceAll(FULL_NAME_REGEX, TO_FULL_NAME)
      .replaceAll(FIRST_NAME_REGEX, TO_FIRST_NAME)
      .replaceAll(LAST_NAME_REGEX, TO_LAST_NAME)
      .replaceAll(EMAIL_REGEX, TO_EMAIL);
  }
}

function replaceTitleContent(nodes) {
  for (const node of nodes) {
    FULL_NAME_REGEX.lastIndex = 0;
    node.title = node.title.replaceAll(FULL_NAME_REGEX, TO_FULL_NAME);
  }
}

removeUndesiredTerms();
setInterval(removeUndesiredTerms, 100);
