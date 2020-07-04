"use strict";
var cheerio = require("cheerio");
var axios = require("axios");
var URL = require("url-parse");

// var url = new URL(START_URL);
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

const url = "http://localhost:8080";

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    const codesArray = [];
    let pagesToVisit = [];
    let tempPagesToVisit = [];
    let linkIndex = 0;
    do {
      let internalLink = `${url}${pagesToVisit[linkIndex] || ""}`;

      if (!pagesToVisit[linkIndex] && pagesToVisit.length > 0) {
        reject("Error");
        break;
      }

      let pageContent = await fetchHTMLFromWebSit(internalLink);
      searchForWords(pageContent, codesArray);
      collectInternalLinks(pageContent, tempPagesToVisit);

      let newSubLinks = filterArray(pagesToVisit, tempPagesToVisit);
      pagesToVisit.push(...newSubLinks);

      ++linkIndex;
    } while (pagesToVisit[linkIndex]);

    let finalResult = codesArray.sort((a, b) => a.localeCompare(b))[0];
    resolve(finalResult);
  });
};

async function fetchHTMLFromWebSit(url) {
  let response = await axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  const html = response;
  const $ = cheerio.load(html);
  return $;
}

function filterArray(initialArr, newArr) {
  return newArr.filter((val) => !initialArr.includes(val));
}

function searchForWords($, codesArray) {
  const statsCode = $(".codes").find("h1");
  statsCode.each(function () {
    let codeH1 = $(this).text();
    codesArray.push(codeH1);
  });
}

function collectInternalLinks($, tempPagesToVisit) {
  var relativeLinks = $("a[href^='/']");
  relativeLinks.each(function () {
    if ($(this).attr("href") !== undefined)
      tempPagesToVisit.push($(this).attr("href"));
  });
}
