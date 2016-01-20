var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');
var TraitifyMeta = require('../models/traitify.meta.model.js');

var connection = mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

/*
var persoanlitySchema = new Schema({
  extId               :       {type:String, required:true},
  createdAt           :       {type:Date, required:true, default:Date.now},
  personalityTypes    :       [{
                                score:Number,
                                name:String
                              }],
  personalityTraits   :       [{
                                score:Number,
                                name:String
                              }],
  personalityBlend    :       {
                                name:String,
                                personalityTypes:[{name:String, description:String}]
                              }

});
 */
function extractPersonalitySummary(full){
    var summary = {};
    summary.personalityBlend = {};
    summary.personalityBlend.name = full.personalityBlend.name
    summary.personalityBlend.personalityTypes = []
    summary.personalityBlend.personalityTypes.push(full.personalityBlend.personality_type_1.name);
    summary.personalityBlend.personalityTypes.push(full.personalityBlend.personality_type_2.name);

    summary.personalityTypes = [];
    for(var x=0; x<full.personalityTypes.length; x++){
        var type = full.personalityTypes[x];
        var typeSummary = {};
        typeSummary.score = type.score;
        typeSummary.name = type.personality_type.name;
        summary.personalityTypes.push(typeSummary);
    }

    summary.personalityTraits = [];
    for(var x=0; x<full.personalityTraits.length; x++){
        var trait = full.personalityTraits[x];
        var traitSummary = {};
        traitSummary.score = trait.score;
        traitSummary.name = trait.personality_trait.name;
        summary.personalityTraits.push(traitSummary);
    }

    return summary;
}//// fun. extract summary

function saveEnvironment(env){
    // console.log(env);
// console.log(TraitifyMeta.schema)


    var item = {};
    item.id = env.id;
    item.name = env.name;

    TraitifyMeta.findOne({_id:'569a57f4548c2e5d02611ed6'}).exec()
    .then(
        function(model){
            console.log(model);
        }
    )
    // TraitifyModel.findOneAndUpdate(
    //     {_id:'569a4af0d4c741f56ae88cf5'},
    //     {$push: {enviornments: item}},
    //     // {safe: true, upsert: true},
    //     function(err, model) {
    //         console.log(err);
    //     }
    // );

}/// fun. saveEviorme

function saveFamous(fam){

}/// fun. saveFamous

function extractTraitMeta(trait){
    var meta = {};
    meta.name = trait.personality_trait.name;
    meta.definition = trait.personality_trait.definition;

    console.log(meta);
    return meta;
}//// fun. extractTraitMeta


function extractTypeMeta(type){
    var meta = {};
    type = type.personality_type
    meta.name = type.name
    meta.description = type.description;
    meta.id = type.id;
    meta.keywords = type.keywords;
    meta.details = type.details;

    meta.environments = [];
    var envirs = type.environments;
    for(var x=0; x<envirs.length; x++){
        saveEnvironment(envirs[x])
        var envMeta = {};
        envMeta.id = envirs[x].id;
        meta.environments.push(envMeta);
        // console.log(envirs[x]);
    }

    meta.famousPepole = [];
    var fams = type.famous_people;
    for(var x=0; x<fams.length; x++){
        saveFamous(fams[x]);
        var famMeta = {};
        famMeta.id = fams[x].id;
        meta.famousPepole.push(famMeta);
        // console.log(fams[x]);
    }////
    // console.log(type);
    // console.log('metat: ', meta);

    return meta;
}//// fun. extractTypeMeta

db.once('open', function(){

    TraitifyMeta.find({}).exec()
    .then(
        function(model){
            if(model.length < 1){
                console.log('no meta');
                var meta = new TraitifyMeta({});
                meta.save();
            }
        }
    );

    personality = UserModel.findById('56980ba5370697b85da89778', 'personalityExams').exec()
    .then(
        function(per){
            console.log("found");

            var exam = per.personalityExams[0];
            summary = extractPersonalitySummary(exam);

            var typesMeta = [];
            for(var x=0; x<1; x++){
                typesMeta.push(extractTypeMeta(exam.personalityTypes[x]));
            }//// for

            var traitsMeta = [];
            // for(var x=0; x<exam.personalityTraits.legnth; x++){
            // for(var x=0; x<1; x++){
            //     traitsMeta.push(extractTraitMeta(exam.personalityTraits[x]));
            // }//// for
            process.exit();
        }
    )//// then
});
