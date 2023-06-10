const app = require('./app');
const db = require('./config/db')
const cors = require('cors');
app.use(cors());


const port = 8080;

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})