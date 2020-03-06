const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

module.exports = {app};
