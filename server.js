const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const ejs=require('ejs');
const port = 3000;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.use("/", require("./root"));


app.use("/productDetail", require("./productDetail"));

app.use("/chanel", require("./Chanel"));

app.use("/manMix", require("./manMIx"));

app.use("/classicWatch", require("./classicWatch"));

app.use("/womanMix", require("./womanMix"));

app.use("/", require("./productMain"));




app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);

