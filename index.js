const express = require('express');
const app = express();
const lyric = require('./api/lyric');

app.use(express.json({extended: false}));

app.use('/api/lyric', lyric);

const PORT = process.env.PORT ||  5050;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));