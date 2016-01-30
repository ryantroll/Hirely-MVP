
var config = require('../config');
var mongoose = require('mongoose');
var q = require('q');

function toLower(v){
    return v.toLowerCase();
}//// fun. toLower

function generateSlug(list, sep){
    var slug = '';

    for(var i=0; i<list.length; i++){
        list[i] = list[i].replace(/[']/g, '') /// remove what sould be removed
            .replace(/[´"\.\·\‚\*@<>&%\:\+\$\^\[\]\-=\{\}\~\n]/g, sep) //// replace what should be replaced
            .split(' ').join(sep);
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
        else if(Array.isArray(opt.fields)){

            for(var i = 0; i<opt.fields.length; i++){

                if('string' === typeof opt.fields[i]){
                    slugies.push(this[ opt.fields[i] ]);
                }/// if string
            }/// for
        }/// if array

        /**
         * generate the slug
         */
        var slug = generateSlug(slugies, config.urlSeparator);

        /**
         * if unique slug is required query the database
         */
        if(true === opt.unique){
            /**
             * Check if the slug exists
             */
            var model = mongoose.models[opt.model];
            var searchObj = {};
            searchObj[opt.slugProperty] = new RegExp('^'+slug+'(\\-\\d+)?$');
            var sortObj = {};
            sortObj[opt.slugProperty] = -1; ///// -1 = desc order

            var me = this;

            q.when(model.findOne(searchObj).sort(sortObj).exec())
            .then(
                function(found){
                    if(found){
                        var slugParts = found[opt.slugProperty].split(config.urlSeparator);
                        var lastNum = Number(slugParts[slugParts.length-1]);
                        if(isNaN(lastNum) || 0 == lastNum){
                            slug = slug + config.urlSeparator + '001';
                        }
                        else{
                            slug = slug + config.urlSeparator + (lastNum + 1 < 100 ? '0' : '') + (lastNum + 1 < 10 ? '0' : '') + String(lastNum + 1);
                        }
                    }

                    me[opt.slugProperty] = slug;

                    next();
                },//// fun. reslove
                function(err){
                    console.log(err);
                    next();
                }
            )//// fun. then
        }//// if unique
        else{
            this[opt.slugProperty] = slug;
            next();
        }

    })
}//// fun. addSlug

var utilites = {
    toLower: toLower,
    slug: addSlug
}
module.exports = utilites;