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
  const url = baseUrl + artistUrl + '-' + songUrl + endUrl;
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
    
    const data = await fetch(url, requestOptions);
   


    // console.log(data);
    const body = await data.text();
    if (!body) {
      console.log("nothing found");
      return null;
    }
    var $ = cio.load(body);
    const str = $.html();
    const brRegex = /<br\s*[\/]?>/gi;
    $('div[class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"]').html(str.replace(brRegex, ' '));
    const lyric_container = $('div[class="Lyrics__Container-sc-1ynbvzw-6 lgZgEN"]').text().trim();
    console.log(lyric_container);
    if (!lyric_container) {
      console.log("no lyric container found");
      return [{text: "Error:", value: 30},
              {text: "Unable", value: 30},
              {text: "to", value: 30},
              {text: "find", value: 30},
              {text: "song", value: 30},];
    }
    const lyricRegex = /\].*?(?=[0-9]*EmbedShare)/;
    const lyrics_match = lyric_container.match(lyricRegex);
    if (!lyrics_match) {
      console.log("unexpected lyrics container");
      return [{text: "Error:", value: 30},
              {text: "Unable", value: 30},
              {text: "to", value: 30},
              {text: "process", value: 30},
              {text: "song", value: 30},];
    }
    const lyrics =lyrics_match[0];
    const stripVerse = lyrics.replace(/\[[^\]]*\]/g, "");
    const stripPunct = stripVerse.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const lower = stripPunct.toLowerCase();
    const wordArray = lower.split(' ');
    console.log(typeof(lyrics));
    
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
    if (!artist || !song) {
      res.send([{text: "Error:", value: 30},
      {text: "Must", value: 30},
      {text: "Include", value: 30},
      {text: "Artist and Song Name", value: 30},]);
      return;
    }
    const url= generateUrl(artist,song);
    const lyrics = await requestLyric(url);
    res.send(lyrics);
    // res.send(lyrics);
});




module.exports = router;
