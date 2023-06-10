const mongoose = require('mongoose')

const connection = mongoose.createConnection('mongodb+srv://deni:Den11111@cluster0.9gfvzzk.mongodb.net/newDB?retryWrites=true&w=majority').on('open', ()=>{
    console.log("connect")
}).on('error', ()=>{
    console.log('error')
})

module.exports = connection;

