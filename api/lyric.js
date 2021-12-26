// import fetch from "node-fetch";
var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios');
const cio = require('cheerio');
 
function getWordCntRd(array) {
    return array.reduce((prev, nxt) => {
      prev[nxt] = (prev[nxt] + 1) || 1;
      return prev;
    }, {});
  }

function convertWordCloudFormat(wordCount) {
  const wordCountArr = Object.entries(wordCount);
  const wordCloudList = wordCountArr.map(function(x) {
    return {
      text: x[0],
      value: x[1],
    };
  });
  return wordCloudList;
}

function generateUrl(artist,song) {
  const baseUrl = "https://genius.com/";
  const endUrl = "-lyrics";
  const artistUrl = artist.replace(/ /g,'-');
  const songUrl = song.replace(/ /g,'-');
  const url = baseUrl + artistUrl + '-' + songUrl +endUrl;
  console.log(url);
  return url;

}

async function requestLyric(url) {
    const requestOptions = {
        headers: {
            'Authorization': "Bearer eKj82WsaoW89JCnh2Lzhkz5m2xVejbBEJONdDj5aQllvfmB17HeK7JvwNJUSjyjq",
            'Access-Control-Allow-Origin': 'https://localhost:3000',
            'text_format': 'html',
    }};
    // const url = "https://api.genius.com/songs/378195";
    // const adeleurl = "https://genius.com/Adele-easy-on-me-lyrics";
    // const christmasurl = "https://genius.com/Christmas-songs-o-holy-night-lyrics";
    // const vurl = "https://genius.com/Taylor-swift-all-too-well-10-minute-version-taylors-version-live-acoustic-lyrics";
    // const url = "https://api.randomuser.me/";
    const data = await fetch(url, requestOptions);
    // const $ = cio.load(data);
    // const lyrics = $('a').text();
    // console.log($);


    // console.log(data);
    const body = await data.text();
    var $ = cio.load(body);
    const str = $.html();
    const brRegex = /<br\s*[\/]?>/gi;
    $('div[class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"]').html(str.replace(brRegex, ' '));
    // console.log(typeof($));
    // console.log($.html());
    const lyric_container = $('div[class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"]').text().trim();
    console.log(lyric_container);
    const lyricRegex = /\].*?(?=[0-9]*EmbedShare)/;
    const lyrics = lyric_container.match(lyricRegex)[0];
    const stripVerse = lyrics.replace(/\[[^\]]*\]/g, "");
    const stripPunct = stripVerse.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const lower = stripPunct.toLowerCase();
    const wordArray = lower.split(' ');
    console.log(typeof(lyrics));
    //console.log(body);
    //console.log(typeof(body));
    // const json_data = await data.json();
    const wordCountArr = getWordCntRd(wordArray);
    const wordCloudList = convertWordCloudFormat(wordCountArr);
    return wordCloudList;
}

// console.log(body);
// console.log(isLoading, data, errors);

router.get("/", async function(req, res, next) {
    // res.send("API is working properly");
    const artist = req.query.artist;
    const song = req.query.song;
    const url= generateUrl(artist,song);
    const lyrics = await requestLyric(url);
    res.send(lyrics);
    // res.send(lyrics);
});


//artist=Ed+Sheeran+and+Elton+John&song=Merry+Christmas

module.exports = router;
