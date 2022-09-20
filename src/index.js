const express = require('express')
const bodyParser  =  require('body-parser')
const route = require('./routes/route')
const {default:mongoose} = require('mongoose')
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://khushi123456789:khushi123456789@cluster0.xcf6vy2.mongodb.net/group24Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log('MongoDb is connected'))
.catch ( err => console.log(err) )


app.use('/', route);

app.use(function (req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    return res.status(404).send({status : "404 ", msg : "Path not found"})
     });
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


