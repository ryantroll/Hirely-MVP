// Make sure get requests to db are never cached in IE
module.exports = function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires",0);
    next(); // http://expressjs.com/guide.html#passing-route control
};