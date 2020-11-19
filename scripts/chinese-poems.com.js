'use strict';

const path = require('path');

const cheerio = require('cheerio');
const Scarlet = require('scarlet-task');
const spidex = require('spidex');

const scarlet = new Scarlet(10);

const indexPages = [
  'http://www.chinese-poems.com/bo.html',
  'http://www.chinese-poems.com/du.html',
  'http://www.chinese-poems.com/dm.html',
  'http://www.chinese-poems.com/hy.html',
  'http://www.chinese-poems.com/lb.html',
  'http://www.chinese-poems.com/li.html',
  'http://www.chinese-poems.com/yu.html',
  'http://www.chinese-poems.com/lzy.html',
  'http://www.chinese-poems.com/myc.html',
  'http://www.chinese-poems.com/meng.html',
  'http://www.chinese-poems.com/oyx.html',
  'http://www.chinese-poems.com/su.html',
  'http://www.chinese-poems.com/tao.html',
  'http://www.chinese-poems.com/wang.html',
  'http://www.chinese-poems.com/others.html',
];

const poeties = [];

function getPoetry(o) {
  const { task: { url } } = o;
  spidex.get(`http://www.chinese-poems.com/${url}`, html => {
    const $ = cheerio.load(html);

    let title;
    let author;
    let content;
    if ($('.title').text()) {
      title = $('.title').text().replace(/\n/g, '');
      author = $('.poet').text().replace(/\n/g, '');
      content = $('#translation').text().split('\n')
        .filter(s => s);
    } else {
      const temp = $('h2').html().replace(/\n/g, '')
        .split('<br>')
        .filter(s => s);
      title = temp[0];
      author = temp[1];
      content = $('table tr td').last().text()
        .split('\n')
        .filter(s => s);
    }

    poeties.push({
      url: `http://www.chinese-poems.com/${url}`,
      title,
      author,
      content,
    });

    o.done(true);
  }).on(err => {
    console.error(err);
  });
}

function getPoetryNode(o) {
  const { task: url } = o;
  spidex.get(url, html => {
    const $ = cheerio.load(html);
    const nodeUrls = [];
    $('a').each((idx, node) => {
      if ($(node).text() === 'here') return;
      if ($(node).attr('href') === 'index.html') return;
      if (!$(node).attr('href').endsWith('.html')) return;
      nodeUrls.push({
        title: $(node).text(),
        url: $(node).attr('href'),
      });
    });

    for (const node of nodeUrls) {
      scarlet.push(node, getPoetry, true);
    }

    o.done(true);
  }).on(err => {
    console.error(err);
  });
}

for (const idx of indexPages) {
  scarlet.push(idx, getPoetryNode, true);
}

process.on('exit', () => {
  poeties.sort((a, b) => {
    return a.url < b.url ? -1 : 1;
  });

  require('fs').writeFileSync(path.join(__dirname, '..', 'poetries', '1.json'), JSON.stringify(poeties), 'utf8');
  console.log('done');
});
