// Redirect to https if ebs header is present and indicates not https
module.exports = function(req, res, next) {
    // console.log("force-https:info:0");
    if (req.headers['x-forwarded-proto'] == 'http') {
        console.log("force-https:info:redirecting");
        res.redirect("https://" + req.headers["host"] + req.url);
        return;
    } else {
        next(); // http://expressjs.com/guide.html#passing-route control
    }
};