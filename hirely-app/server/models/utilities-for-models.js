
var config = require('../config');

function toLower(v){
    return v.toLowerCase();
}//// fun. toLower

function generateSlug(list, sep){
    var slug = '';
    var unsafe = "\",´,’,·,‚,*,@,?,=,;,:,.,/,+,&,$,<,>,#,%,{,(,),},|,\,^,~,[,],—,–,-',,";
    for(var i=0; i<list.length; i++){
        list[i] = list[i].replace(/[´"\.\·\‚\*@<>&%\:\+\$\^\[\]\-=\n]/g, '').split(' ').join(sep);
    }
    slug = list.join(sep);
    return slug.toLowerCase();
}//// fun. generateSlug

function addSlug(schema, opt){

    /**
     * this function will be cexecuted before the data is save to DB
     * and it will be executed under the schema context which mean 'this' keyword refer the schema instance
     */
    schema.pre('save', function(next){
        /**
         * Get values form model properites to be used in slug
         */
        var slugies = [];
        if('string' === typeof opt.fields){
            slugies.push(this[opt.fields]);
        }/// if string
        else if('array' === typeof opt.fields){
            for(var i = 0; i<opt.fields.lengty; i++){
                if('string' === typeof opt.fields[i]){
                    slugies.push(this[ opt.fields[i] ]);
                }/// if string
            }/// for
        }/// if array

        /**
         * generate the slug
         */
        var slug = generateSlug(slugies, config.urlSeparator);

        console.log(slug);

        next();
    })
}//// fun. addSlug

var utilites = {
    toLower: toLower,
    slug: addSlug
}
module.exports = utilites;