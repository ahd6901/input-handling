const block_titles = ["Boaty McBoatface"];
// Sanity check method to make sure you have your environment up and running.
function sum(a, b){
  return a + b;
}
/*
  Valid book titles in this situation can include:
    - Cannot be any form of "Boaty McBoatface", case insensitive
    - English alphabet characters
    - Arabic numerals
    - Spaces, but no other whitespace like tabs or newlines
    - Quotes, both single and double
    - Hyphens
    - No leading or trailing whitespace
    - No newlines or tabs
*/
function isTitle(str){

var result= block_titles.some((title) => { return str.toLowerCase()!==title.toLowerCase();});

 return result;
}


function cleanPageNum(rawStr){ return 0; }
function isSameTitle(strA, strB){ return false; }
function countPages(rawStr){ return 0; }
function cleanForHTML(dirty) { return dirty; }

// Too all my JS nitpickers...
// We are using CommonJS modules because that's what Jest currently best supports
// But, the more modern, preferred way is ES6 modules, i.e. "import/export"
module.exports = {
  sum,
  isTitle,
  countPages,
  cleanPageNum,
  isSameTitle,
  cleanForHTML,
};