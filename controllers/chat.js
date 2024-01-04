const express = require('express');
const bcrypt = require('bcrypt');

exports.getChat = (request, response, next) => {
    response.sendFile('chat.html', { root: 'views' });
}