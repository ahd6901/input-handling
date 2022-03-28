/**
 * @jest-environment jsdom
 *
 * ^^^^^^^^^^^^^^^^^^^^^^^-magic comment for Jest's DOM tools. This MUST be at the top.
 *
 * Jest Unit Tests for the book-validator set of functions
 */
const v = require("./book-validator");

// Make sure that our normal test works so our environment is all set up.
test('SANITY CHECK: 1 + 2 = 3', () => {
  expect(v.sum(1, 2)).toBe(3);
});


describe('testing isTitle', () => {
  test('single letter',     () => { expect(v.isTitle('A')).toBe(true) });
  test('simple title',      () => { expect(v.isTitle('War and Peace')).toBe(true) });
  test('Block list',        () => { expect(v.isTitle("Boaty McBoatface")).toBe(false) });
  test('Block, mixed case', () => { expect(v.isTitle("bOaTy McBoAtFaCe")).toBe(false) });
  test('Anchor drop!',      () => { expect(v.isTitle("ok💩")).toBe(false) });
  test('Leading spaces',    () => { expect(v.isTitle('   a')).toBe(false) });
  test('Trailing spaces',   () => { expect(v.isTitle('a   ')).toBe(false) });
  test('evil tab',          () => { expect(v.isTitle("a\tb")).toBe(false) });
  test('evil newline',      () => { expect(v.isTitle("a\nb")).toBe(false) });
  test('evil Win newline',  () => { expect(v.isTitle("a\r\nb")).toBe(false) });
  test('evil form feed',    () => { expect(v.isTitle("a\fb")).toBe(false) });
  test('evil vtab',         () => { expect(v.isTitle("a\vb")).toBe(false) });
  test('german allowed',    () => { expect(v.isTitle("Ich weiß nichts")).toBe(true) });
  test('ñ composed',        () => { expect(v.isTitle("ma\u00F1ana")).toBe(true) });
  test('ñ decomposed',      () => { expect(v.isTitle("ma\u006E\u0303ana")).toBe(true) });
  test('arabic allowed',     () => { expect(v.isTitle("مرحبا بالعالم")).toBe(true) });
});

describe('isSameTitle', () => {

  test('simple same',         () => { expect(v.isSameTitle('a', 'a')).toBe(true) });
  test('different object',    () => { expect(v.isSameTitle(new String('a'), new String('a'))).toBe(true) });
  test('not strings',         () => { expect(v.isSameTitle(1, null)).toBe(false) });
  test('leading trailing ws', () => { expect(v.isSameTitle(' a ', 'a')).toBe(true) });
  test('leading trailing ws', () => { expect(v.isSameTitle(" a \t", "a")).toBe(true) });

  test('hindi',               () => { expect(v.isSameTitle("नमस्ते दुनिया!", "नमस्ते दुनिया!")).toBe(true) });
  test('hindi different',     () => { expect(v.isSameTitle("नमस्ते दुनिया!", "अलविदा")).toBe(false) });

  test('multiple diacritics', () => { expect(v.isSameTitle("a\u0321\u031a", "a\u031a\u0321")).toBe(true) });

  test('mañana NFD vs NFC',   () => { expect(v.isSameTitle("ma\u00F1na", "ma\u006E\u0303na")).toBe(true) });

  test('ñ and n compat',      () => { expect(v.isSameTitle("ma\u00F1ana", "manana")).toBe(true) });
  test('ñ and n compat',      () => { expect(v.isSameTitle("ma\u006E\u0303ana", "manana")).toBe(true) });

  test('ligature ff and ﬀ',   () => { expect(v.isSameTitle("ff", "\uFB00")).toBe(true) });
  test('ligature ae and æ',   () => { expect(v.isSameTitle("ae", "\u00E6")).toBe(true) });
  test('german ẞ and ss',     () => { expect(v.isSameTitle("ẞ", "\u1E9E")).toBe(true) });

  test('bidi compat',   () => { expect(v.isSameTitle("abc\u202Edef", "abcdef")).toBe(true) });
  test('zalgo',   () => { expect(v.isSameTitle("zalgo", "z̸̢̡̨̢̢̨̧̨̨̧̧̧̢̡̢̢̧̨̨̨̢̧̡̢̛̛̛̛̘͎̫̥͙̙̫͈̯̱͍̪͇̻̥̟̥̮̞͈̟̮̼̙̮͈̫͍̠̟̖̱̬̝̩̲̪͔̝̪̥͕̬̺̠̝̖̥͈̲̱̪̣͚̫̩̞̼̠͔̲͉͉̳͉̰͎̖̠͕̩̟͉̲̣̥̬͖͚̫̲̣̟̱̜̰͉̥͎̱̰͉̫͉̳̯͖͓̣͖̖̤͙̙̹͍̪̬̱̭̤̩̠̝͖̞͙̳̠̗̳͈͚̭͖̩̯̪̼͙̮͇̟̘̹̗̜͓͔̬̫͕̖͙̖̩̹̺͎̮͙̗͇̦͕̞̞̪̩̙̞̥͇͓̼̹̭̟̭̻̬͈͍̥͚̖̯̟͔̹̮̫̳̘̪̗̱̣̟̖̯͉̞̱̗̤̟͓͓̥̥͈͈̯̖͕̝͔͚̺͉̞̫̰̥̮͔̣̝̞̬͔̼̞̯͇̖̪̘͕̪̠̀̓̔̈́͑̀̄̿̎̉́̏͑̀̄͛̿̾̈́͊͐͐͗̾̍́̄̅́̒̈́̆̀̾̌͌́̈́́̄̀͒͑́̾̃͊̃͛̍̓̒̾͆̏̈́̾͂̌̊͆̊̇̆͗͛̓͑͐͌̈́̌̓̓̇̓̅͌̃̄̀͐̃̓͐̉̐͊͆̓̈͗̈̎̽̉͌́̿́͗̃̈́͒̃͛̿̆̅̅͐͆́̆̀́̎́͐̽̐̈́̀̀͛̽͋̈̏͗̎̑͑̈́͑̾͒̀̚̚̚͘͘̕͘̕͘͜͜͜͜͜͜͜͝͠͝͝͠͠͝͝͝͝͠͝͠͝͝͝͝͠ã̵̧̢̨̧̢̨̨̨̨̛̛̛̛̛̛̝̞̟͕̮̱̼͕͖͚̭͓̲̹͇̼̦̟̠̭̖̤͙͉͇̣̮͓͔͖͕̙̤̗͇̩͈̙͈͎̭̣̼͇̙̼̬͓͖̗͙̪̟̪͚̙̗̜͎͙̞̘͖̗̦͙͎̻̖͉͔̣̩̹̟͈͙͎̲͚͉͕̃̏͂̃͌͑̆̅̎̃̒̈̓͂̃̊͑͆̏̉̋̔͊͋͛̎̂́̎͂̒̋̂̃͛̓̈́̆̾̓̈́̾̎́̄̿̈́͌̈́̓̍̈́̌̍͗̂̀̏́̍̐̉̏̊̆͑̊̄̅́͆̈́͊̈́͛͆́̽̅̈́̈̂̌̍̔̔̌̋̑̈́̓́̋̑́́̏̈́̾̑̽̔̔́̈́̍͛̿̆̌̋̃̌̂͌̀̏͒̓̈́̉̎́̒́̀̀̔́̉̋̀̀̽̈́̿̓̀̒͂̾̐̇̓̈́͆͆̀͆̅͒̌̂́͂̓̍̏͐̃̒̀̂̿͗̍̈́͌̇̇̑̇͋̿̔̑͂̅̓̀̊̊͐̽́́̓̀̐̉͗̀͗̔̀̍̉̉͑̋̎̃͋̏̉́̄͗͑̑̉͋̽͒͂̈͑́̎̄̍̾̈́͒͂̔̕̕̚̕͘͘̕̚̕̚̚͜͜͜͜͜͝͝͝͠͝͝͝͝͝͝͝͝͠͠͠͝͝͠͝͝͝͝͠͝͠͝ͅl̴̢̧̡̨̢̨̧̨̨̡̨̧̡̨̢̨̧̨̡̛̛̞̺̞̘̣͍͕͕̗̞̞̼̮̻̰͔̺̘͉͖͚̫̞̯͈͉̣̲̘͎̼̱̺̞̮̘̹͙̬̪͓̝̭͖̳̱͖͈͚̯͔̹̩̳̩͍̣̹͔̹̺̭̖̜͙̻̰̺̝̦̟̯̪̞͉̝̩̩̮̜̫̼̗͙͖͚̲͈͙̱̰̥̠͎̬̮͓̬͔̪͕̯͍͙̼͙͎̣̖̥̪͇͍͕͎̥̫̙͔̖̮̬͔̟͈̯͙̺̠͔̦̱̩̱̝͖̺̳̜̪̳͓̮͔͉̰̻̬̖͚͕̪̼̙͇̼̬͚̳͎̺̼̠̜̩̟̩̘̳̱̝̫̲̖̙͉͕͇̝͚̺̫̜̜̣̳̺͇͍̬̙̼̗̲͕̜̘͚̤̥̺͎͐͒̆̉̏̓̋̏̀́͑́̌́͑͂̎̃̈͛͐́̀̂͒̐̍̀̈́̒̓̊͒̈́̈́̊̍͊̿̾̊̾̎̋̓̇̃͐͆̔͑̓͗̏̈́̆͌͂̊̑͗̀̔̍̉͗̎̊͗̈́̽̉͆̒̓̾̈̽̑́̂̒̌̀̈́͗̏̎̋̍̐̓̈͗̆̆́̃͐̅͊̈͋͐͊̀̃͑͑́̈̐̄͗̈̓̿̇̉̈́̏̀̌̓́̈͐̅͐̃̽͊̍̈̉̆̈͋͐̐̀̈́̉̃̔͆́͆́̎̀͊̌̄̎̓͋̈́͐̄̽̕͘̕̚̚̚̕̚͘̕͘͘̕͘̕̚͘͘̚͜͜͜͜͝͝͝͠͠͠͝ͅͅͅͅͅͅg̶̢̡̡̢̧̧̧̨̨̡̢̧̡̨̨̢̧̨̢̨̧̧̨̢̡̢̢̨̛̛̛̰͔̩̠̲̬̗͉̥͓͚̟̮̣̠̞̪̞̗̘̥̙̥͖͕̘̬̖̩̘̰̤̫̗̲̬̘̠̠͓̘̖̯͉̦̝̣̺͎̥̟̻̺̱̝͙͍̙͚͓̦̦̩̪̥̜͎̦̘̝̖͔͔̙̠̖̮̪̼͔͈͖͎͎̳͈͎̗̹̪̫͕̦̩̬̤͙̙͇͙̱̫̭͖̤͚̠̖̮̭̞͖̫̯͖̰̮̟͎̟̠͉̙̞̣̟̺̲͎̹̲͉̜̝͖͎̻̞̣̮͚͓͍̲͓̣̗̱͉̗͓̬͎̹͈̣̝͙̝̙̮̦͓̭̯͓̦̻͇̤̣̥̘̠͈͈͕̬̘͕͙̙̼̣̹̮̞͚̦̬̟͖͓̞̳͚̗̠̩̰͍̤̩̙̞͉̼̯̹̫̤͐͆͗̍̓̈́͊̋̈́͊͒͛̈́̓̇͐͆̄̀̑͒̂̓̃̿́͒̈́̋͐̈́̄̒͌͐̿̎͋̌͆͛͒̆͛̔̂̈̈́̍̿̑̃̽͊́̂͆͌͑̈́̇́̉̄̉͘͘͘͘̕͘̕̚͜͜͜͝͠͠͠͠͝͠͝͝͝ͅͅͅơ̸̧̢̧̡̨̨̢̡̨̢̢̢̧͔̦̭̘̱̳̳̹̠̲̦͍͎̦͚̠͍̥͚͇̠̬̗̳̙̪̦̞̬̮̖͚̭͕͇͚͙͉̩͙̳͖͔͉̱̮̱̤͈̫̫͔̲͈̥̰̲̭͕̼͕̬̮̜͈̳͈͕̻̦̙͔͕̱̰̥̖̩̮͉͉̗̮̩͇̱͔̘̩̠̏̄͋̅̂̔͐̈́̾̏̿̈̑̊̒̽̔̕̕͘͜͜͜ͅͅͅ")).toBe(true) });

});
describe('js capture groups', () => {
  test('p11 matches the p but gets the 11 only', () => {
    const input = "p11";
    let answer = "change me to a regex capture group";
    expect('p11'.match(/p(?<page>\d+)/).groups.page).toBe("11") });
});

describe('countPages', () => {
  test('single number',      () => { expect(v.countPages('2')).toBe(1) });
  test('single pNumber',     () => { expect(v.countPages('p3')).toBe(1) });
  test('simple expressions', () => { expect(v.countPages('1,3')).toBe(2) });
  test('range',              () => { expect(v.countPages('2-4')).toBe(3) });
  test('range w/pNum',       () => { expect(v.countPages('2-p4')).toBe(3) });
  test('range w/ws',         () => { expect(v.countPages(' 2 -  4')).toBe(3) });
  test('big range',          () => { expect(v.countPages('10-100')).toBe(91) });
  test('negative range',     () => { expect(v.countPages('100-10')).toBe(91) });
  test('multi range',        () => { expect(v.countPages('1-3,5-6,p9')).toBe(6) });
  test('neg multi range',    () => { expect(v.countPages('9-5,1-4')).toBe(9) });
  test('weird range split',  () => { expect(v.countPages('1-3-5')).toBe(0) });
  test('garbage',            () => { expect(v.countPages('asdcmiuf')).toBe(0) });
  test('unicode weirdness',  () => { expect(v.countPages("\0x00\xa2")).toBe(0) });
  test('integer overflow',   () => {
    const overflow = `p${Number.MAX_SAFE_INTEGER}-p0`
    expect(v.countPages(overflow)).toBe(undefined)
  });
});

describe('cleanPageNum', () => {
  test('single number',        () => { expect(v.cleanPageNum('2')).toBe(2) });
  test('single pNumber',       () => { expect(v.cleanPageNum('p3')).toBe(3) });
  test('whitespace',           () => { expect(v.cleanPageNum(' p4\t \r\n')).toBe(4) });
  test('two pNums',            () => { expect(v.cleanPageNum('p3p4')).toBe(undefined) });
  test('exponents  undefined', () => { expect(v.cleanPageNum('1e7')).toBe(undefined) });
  test('nothing usable',       () => { expect(v.cleanPageNum('abc')).toBe(undefined) });
  test('js max number',        () => { expect(v.cleanPageNum('abc')).toBe(undefined) });
  test('negatives undefined',  () => { expect(v.cleanPageNum('-19')).toBe(undefined) });
  test('leading zero octal?',  () => { expect(v.cleanPageNum('p09')).toBe(9) });
});

describe ('cleanForHTML and DOM element XSS', () => {

  test('sanity check', () => { expectDomChildren(`Hello!`, 0) })

});