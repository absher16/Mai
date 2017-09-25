const express = require("express");
const multer  = require("multer");
const upload  = multer({"dest": "uploads/"});
const sizeOf  = require("image-size");
const exphbs  = require("express-handlebars");

require("string.prototype.startswith");


const app = express();

app.use(express.static( __dirname + "/bower_components"));
app.engine(".hbs", exphbs({"extname": ".hbs"}));
app.set("view engine", ".hbs");


app.get("/", function(req, res, next) {
    return res.render("dropzone");
});

app.post("/upload", upload.single("file"), function(req, res, next) {
    if (!req.file.mimetype.startsWith("image/")) {
        return res.status(422).json({
            "error": "The uploaded file must be an image"
        });
    }

    const dimensions = sizeOf(req.file.path);

    if ((dimensions.width < 640) || (dimensions.height < 480)) {
        return res.status(422).json({
            "error": "The image must be at least 640 x 480px"
        });
    }

    return res.status(200).send(req.file);
});

app.listen(8080, function() {
    console.log("Express server listening on port 8080");
});