//Traitify Backend Service
//
//Develoopers - Hirely 2015

'use strict'
var config = require('../config');
var http = require('http');
var querystring = require('querystring');
var userModel = require('../models/user.model');
var UserService = require('../services/user.service');
var traitifyModel = require('../models/traitify.meta.model');
var q = require('q');
var _ = require('lodash');

var traitify = require('traitify');
traitify.setHost(config.traitify.host);
traitify.setVersion(config.traitify.version);
traitify.setSecretKey(config.traitify.secretKey);

var onetIdsAll = ["11-1011.00", "11-1011.03", "11-1021.00", "11-2011.00", "11-2021.00", "11-2022.00", "11-2031.00", "11-3011.00", "11-3021.00", "11-3031.01", "11-3031.02", "11-3051.00", "11-3051.01", "11-3051.02", "11-3051.04", "11-3061.00", "11-3071.01", "11-3071.02", "11-3071.03", "11-3111.00", "11-3121.00", "11-3131.00", "11-9013.01", "11-9013.02", "11-9013.03", "11-9021.00", "11-9031.00", "11-9032.00", "11-9033.00", "11-9039.01", "11-9039.02", "11-9041.00", "11-9041.01", "11-9051.00", "11-9061.00", "11-9071.00", "11-9081.00", "11-9111.00", "11-9121.00", "11-9121.01", "11-9121.02", "11-9131.00", "11-9141.00", "11-9151.00", "11-9161.00", "11-9199.01", "11-9199.02", "11-9199.03", "11-9199.04", "11-9199.07", "11-9199.08", "11-9199.11", "13-1011.00", "13-1021.00", "13-1022.00", "13-1023.00", "13-1031.01", "13-1031.02", "13-1032.00", "13-1041.01", "13-1041.02", "13-1041.03", "13-1041.04", "13-1041.06", "13-1041.07", "13-1051.00", "13-1071.00", "13-1074.00", "13-1075.00", "13-1081.00", "13-1081.01", "13-1081.02", "13-1111.00", "13-1121.00", "13-1131.00", "13-1141.00", "13-1151.00", "13-1161.00", "13-1199.01", "13-1199.02", "13-1199.03", "13-1199.04", "13-1199.05", "13-1199.06", "13-2011.01", "13-2011.02", "13-2021.01", "13-2021.02", "13-2031.00", "13-2041.00", "13-2051.00", "13-2052.00", "13-2053.00", "13-2061.00", "13-2071.00", "13-2071.01", "13-2072.00", "13-2081.00", "13-2082.00", "13-2099.02", "13-2099.04", "15-1111.00", "15-1121.00", "15-1121.01", "15-1122.00", "15-1131.00", "15-1132.00", "15-1133.00", "15-1134.00", "15-1141.00", "15-1142.00", "15-1143.00", "15-1143.01", "15-1151.00", "15-1152.00", "15-1199.01", "15-1199.02", "15-1199.03", "15-1199.04", "15-1199.05", "15-1199.06", "15-1199.08", "15-1199.09", "15-1199.10", "15-1199.11", "15-1199.12", "15-2011.00", "15-2021.00", "15-2031.00", "15-2041.00", "15-2041.01", "15-2041.02", "15-2091.00", "17-1011.00", "17-1012.00", "17-1021.00", "17-1022.00", "17-1022.01", "17-2011.00", "17-2021.00", "17-2031.00", "17-2041.00", "17-2051.00", "17-2051.01", "17-2061.00", "17-2071.00", "17-2072.00", "17-2072.01", "17-2081.00", "17-2081.01", "17-2111.01", "17-2111.02", "17-2111.03", "17-2112.00", "17-2112.01", "17-2121.01", "17-2121.02", "17-2131.00", "17-2141.00", "17-2141.01", "17-2141.02", "17-2151.00", "17-2161.00", "17-2171.00", "17-2199.01", "17-2199.02", "17-2199.03", "17-2199.04", "17-2199.05", "17-2199.07", "17-2199.08", "17-2199.09", "17-2199.10", "17-2199.11", "17-3011.01", "17-3011.02", "17-3012.01", "17-3012.02", "17-3013.00", "17-3021.00", "17-3022.00", "17-3023.01", "17-3023.03", "17-3024.00", "17-3024.01", "17-3025.00", "17-3026.00", "17-3027.00", "17-3029.01", "17-3029.02", "17-3029.03", "17-3029.04", "17-3029.05", "17-3029.06", "17-3029.07", "17-3029.08", "17-3029.09", "17-3031.01", "17-3031.02", "19-1011.00", "19-1012.00", "19-1013.00", "19-1020.01", "19-1021.00", "19-1022.00", "19-1023.00", "19-1029.01", "19-1029.02", "19-1029.03", "19-1031.01", "19-1031.02", "19-1031.03", "19-1032.00", "19-1041.00", "19-1042.00", "19-2011.00", "19-2012.00", "19-2021.00", "19-2031.00", "19-2032.00", "19-2041.00", "19-2041.01", "19-2041.02", "19-2041.03", "19-2042.00", "19-2043.00", "19-2099.01", "19-3011.00", "19-3011.01", "19-3022.00", "19-3031.01", "19-3031.02", "19-3031.03", "19-3032.00", "19-3039.01", "19-3041.00", "19-3051.00", "19-3091.01", "19-3091.02", "19-3092.00", "19-3093.00", "19-3094.00", "19-3099.01", "19-4011.01", "19-4011.02", "19-4021.00", "19-4031.00", "19-4041.01", "19-4041.02", "19-4051.01", "19-4051.02", "19-4061.00", "19-4061.01", "19-4091.00", "19-4092.00", "19-4093.00", "19-4099.01", "19-4099.02", "19-4099.03", "21-1011.00", "21-1012.00", "21-1013.00", "21-1014.00", "21-1015.00", "21-1021.00", "21-1022.00", "21-1023.00", "21-1091.00", "21-1092.00", "21-1093.00", "21-1094.00", "21-2011.00", "21-2021.00", "23-1011.00", "23-1012.00", "23-1021.00", "23-1022.00", "23-1023.00", "23-2011.00", "23-2091.00", "23-2093.00", "25-1011.00", "25-1021.00", "25-1022.00", "25-1031.00", "25-1032.00", "25-1041.00", "25-1042.00", "25-1043.00", "25-1051.00", "25-1052.00", "25-1053.00", "25-1054.00", "25-1061.00", "25-1062.00", "25-1063.00", "25-1064.00", "25-1065.00", "25-1066.00", "25-1067.00", "25-1071.00", "25-1072.00", "25-1081.00", "25-1082.00", "25-1111.00", "25-1112.00", "25-1113.00", "25-1121.00", "25-1122.00", "25-1123.00", "25-1124.00", "25-1125.00", "25-1126.00", "25-1191.00", "25-1192.00", "25-1193.00", "25-1194.00", "25-2011.00", "25-2012.00", "25-2021.00", "25-2022.00", "25-2023.00", "25-2031.00", "25-2032.00", "25-2052.00", "25-2053.00", "25-2054.00", "25-2059.01", "25-3011.00", "25-3021.00", "25-3099.02", "25-4011.00", "25-4012.00", "25-4013.00", "25-4021.00", "25-4031.00", "25-9011.00", "25-9021.00", "25-9031.00", "25-9031.01", "25-9041.00", "27-1011.00", "27-1012.00", "27-1013.00", "27-1014.00", "27-1021.00", "27-1022.00", "27-1023.00", "27-1024.00", "27-1025.00", "27-1026.00", "27-1027.00", "27-2011.00", "27-2012.01", "27-2012.02", "27-2012.03", "27-2012.04", "27-2012.05", "27-2021.00", "27-2022.00", "27-2023.00", "27-2031.00", "27-2032.00", "27-2041.01", "27-2041.04", "27-2042.01", "27-2042.02", "27-3011.00", "27-3012.00", "27-3021.00", "27-3022.00", "27-3031.00", "27-3041.00", "27-3042.00", "27-3043.04", "27-3043.05", "27-3091.00", "27-4011.00", "27-4012.00", "27-4013.00", "27-4014.00", "27-4021.00", "27-4031.00", "27-4032.00", "29-1011.00", "29-1021.00", "29-1022.00", "29-1023.00", "29-1024.00", "29-1031.00", "29-1041.00", "29-1051.00", "29-1061.00", "29-1062.00", "29-1063.00", "29-1064.00", "29-1065.00", "29-1066.00", "29-1067.00", "29-1069.01", "29-1069.02", "29-1069.03", "29-1069.04", "29-1069.05", "29-1069.06", "29-1069.07", "29-1069.08", "29-1069.09", "29-1069.10", "29-1069.11", "29-1069.12", "29-1071.00", "29-1071.01", "29-1081.00", "29-1122.00", "29-1122.01", "29-1123.00", "29-1124.00", "29-1125.00", "29-1125.01", "29-1125.02", "29-1126.00", "29-1127.00", "29-1128.00", "29-1131.00", "29-1141.00", "29-1141.01", "29-1141.02", "29-1141.03", "29-1141.04", "29-1151.00", "29-1161.00", "29-1171.00", "29-1181.00", "29-1199.01", "29-1199.04", "29-1199.05", "29-2011.00", "29-2011.01", "29-2011.02", "29-2011.03", "29-2012.00", "29-2021.00", "29-2031.00", "29-2032.00", "29-2033.00", "29-2034.00", "29-2035.00", "29-2041.00", "29-2051.00", "29-2052.00", "29-2053.00", "29-2054.00", "29-2055.00", "29-2056.00", "29-2057.00", "29-2061.00", "29-2071.00", "29-2081.00", "29-2091.00", "29-2092.00", "29-2099.01", "29-2099.05", "29-2099.06", "29-2099.07", "29-9011.00", "29-9012.00", "29-9091.00", "29-9092.00", "29-9099.01", "31-1011.00", "31-1013.00", "31-1014.00", "31-2011.00", "31-2012.00", "31-2021.00", "31-2022.00", "31-9011.00", "31-9091.00", "31-9092.00", "31-9093.00", "31-9094.00", "31-9095.00", "31-9096.00", "31-9097.00", "31-9099.01", "31-9099.02", "33-1011.00", "33-1012.00", "33-1021.01", "33-1021.02", "33-2011.01", "33-2011.02", "33-2021.01", "33-2021.02", "33-2022.00", "33-3011.00", "33-3012.00", "33-3021.01", "33-3021.02", "33-3021.03", "33-3021.05", "33-3021.06", "33-3031.00", "33-3041.00", "33-3051.01", "33-3051.03", "33-3052.00", "33-9011.00", "33-9021.00", "33-9031.00", "33-9032.00", "33-9091.00", "33-9092.00", "33-9093.00", "33-9099.02", "35-1011.00", "35-1012.00", "35-2011.00", "35-2012.00", "35-2013.00", "35-2014.00", "35-2015.00", "35-2021.00", "35-3011.00", "35-3021.00", "35-3022.00", "35-3022.01", "35-3031.00", "35-3041.00", "35-9011.00", "35-9021.00", "35-9031.00", "37-1011.00", "37-1012.00", "37-2011.00", "37-2012.00", "37-2021.00", "37-3011.00", "37-3012.00", "37-3013.00", "39-1011.00", "39-1012.00", "39-1021.00", "39-1021.01", "39-2011.00", "39-2021.00", "39-3011.00", "39-3012.00", "39-3021.00", "39-3031.00", "39-3091.00", "39-3092.00", "39-3093.00", "39-4011.00", "39-4021.00", "39-4031.00", "39-5011.00", "39-5012.00", "39-5091.00", "39-5092.00", "39-5093.00", "39-5094.00", "39-6011.00", "39-6012.00", "39-7011.00", "39-7012.00", "39-9011.00", "39-9011.01", "39-9021.00", "39-9031.00", "39-9032.00", "39-9041.00", "41-1011.00", "41-1012.00", "41-2011.00", "41-2012.00", "41-2021.00", "41-2022.00", "41-2031.00", "41-3011.00", "41-3021.00", "41-3031.01", "41-3031.02", "41-3031.03", "41-3041.00", "41-3099.01", "41-4011.00", "41-4011.07", "41-4012.00", "41-9011.00", "41-9012.00", "41-9021.00", "41-9022.00", "41-9031.00", "41-9041.00", "41-9091.00", "43-1011.00", "43-2011.00", "43-2021.00", "43-3011.00", "43-3021.01", "43-3021.02", "43-3031.00", "43-3041.00", "43-3051.00", "43-3061.00", "43-3071.00", "43-4011.00", "43-4021.00", "43-4031.01", "43-4031.02", "43-4031.03", "43-4041.01", "43-4041.02", "43-4051.00", "43-4051.03", "43-4061.00", "43-4071.00", "43-4081.00", "43-4111.00", "43-4121.00", "43-4131.00", "43-4141.00", "43-4151.00", "43-4161.00", "43-4171.00", "43-4181.00", "43-5011.00", "43-5011.01", "43-5021.00", "43-5031.00", "43-5032.00", "43-5041.00", "43-5051.00", "43-5052.00", "43-5053.00", "43-5061.00", "43-5071.00", "43-5081.01", "43-5081.02", "43-5081.03", "43-5081.04", "43-5111.00", "43-6011.00", "43-6012.00", "43-6013.00", "43-6014.00", "43-9011.00", "43-9021.00", "43-9022.00", "43-9031.00", "43-9041.01", "43-9041.02", "43-9051.00", "43-9061.00", "43-9071.00", "43-9081.00", "43-9111.00", "43-9111.01", "45-1011.05", "45-1011.06", "45-1011.07", "45-1011.08", "45-2011.00", "45-2021.00", "45-2041.00", "45-2091.00", "45-2092.01", "45-2092.02", "45-2093.00", "45-3011.00", "45-3021.00", "45-4011.00", "45-4021.00", "45-4022.00", "45-4023.00", "47-1011.00", "47-1011.03", "47-2011.00", "47-2021.00", "47-2022.00", "47-2031.01", "47-2031.02", "47-2041.00", "47-2042.00", "47-2043.00", "47-2044.00", "47-2051.00", "47-2053.00", "47-2061.00", "47-2071.00", "47-2072.00", "47-2073.00", "47-2081.00", "47-2082.00", "47-2111.00", "47-2121.00", "47-2131.00", "47-2132.00", "47-2141.00", "47-2142.00", "47-2151.00", "47-2152.01", "47-2152.02", "47-2161.00", "47-2171.00", "47-2181.00", "47-2211.00", "47-2221.00", "47-2231.00", "47-3011.00", "47-3012.00", "47-3013.00", "47-3014.00", "47-3015.00", "47-3016.00", "47-4011.00", "47-4021.00", "47-4031.00", "47-4041.00", "47-4051.00", "47-4061.00", "47-4071.00", "47-4091.00", "47-4099.02", "47-4099.03", "47-5011.00", "47-5012.00", "47-5013.00", "47-5021.00", "47-5031.00", "47-5041.00", "47-5042.00", "47-5051.00", "47-5061.00", "47-5071.00", "47-5081.00", "49-1011.00", "49-2011.00", "49-2021.00", "49-2021.01", "49-2022.00", "49-2091.00", "49-2092.00", "49-2093.00", "49-2094.00", "49-2095.00", "49-2096.00", "49-2097.00", "49-2098.00", "49-3011.00", "49-3021.00", "49-3022.00", "49-3023.01", "49-3023.02", "49-3031.00", "49-3041.00", "49-3042.00", "49-3043.00", "49-3051.00", "49-3052.00", "49-3053.00", "49-3091.00", "49-3092.00", "49-3093.00", "49-9011.00", "49-9012.00", "49-9021.01", "49-9021.02", "49-9031.00", "49-9041.00", "49-9043.00", "49-9044.00", "49-9045.00", "49-9051.00", "49-9052.00", "49-9061.00", "49-9062.00", "49-9063.00", "49-9064.00", "49-9071.00", "49-9081.00", "49-9091.00", "49-9092.00", "49-9093.00", "49-9094.00", "49-9095.00", "49-9096.00", "49-9097.00", "49-9098.00", "49-9099.01", "51-1011.00", "51-2011.00", "51-2021.00", "51-2022.00", "51-2023.00", "51-2031.00", "51-2041.00", "51-2091.00", "51-2092.00", "51-2093.00", "51-3011.00", "51-3021.00", "51-3022.00", "51-3023.00", "51-3091.00", "51-3092.00", "51-3093.00", "51-4011.00", "51-4012.00", "51-4021.00", "51-4022.00", "51-4023.00", "51-4031.00", "51-4032.00", "51-4033.00", "51-4034.00", "51-4035.00", "51-4041.00", "51-4051.00", "51-4052.00", "51-4061.00", "51-4062.00", "51-4071.00", "51-4072.00", "51-4081.00", "51-4111.00", "51-4121.06", "51-4121.07", "51-4122.00", "51-4191.00", "51-4192.00", "51-4193.00", "51-4194.00", "51-5111.00", "51-5112.00", "51-5113.00", "51-6011.00", "51-6021.00", "51-6031.00", "51-6041.00", "51-6042.00", "51-6051.00", "51-6052.00", "51-6061.00", "51-6062.00", "51-6063.00", "51-6064.00", "51-6091.00", "51-6092.00", "51-6093.00", "51-7011.00", "51-7021.00", "51-7031.00", "51-7032.00", "51-7041.00", "51-7042.00", "51-8011.00", "51-8012.00", "51-8013.00", "51-8021.00", "51-8031.00", "51-8091.00", "51-8092.00", "51-8093.00", "51-8099.03", "51-9011.00", "51-9012.00", "51-9021.00", "51-9022.00", "51-9023.00", "51-9031.00", "51-9032.00", "51-9041.00", "51-9051.00", "51-9061.00", "51-9071.01", "51-9071.06", "51-9071.07", "51-9081.00", "51-9082.00", "51-9083.00", "51-9111.00", "51-9121.00", "51-9122.00", "51-9123.00", "51-9141.00", "51-9151.00", "51-9191.00", "51-9192.00", "51-9193.00", "51-9194.00", "51-9195.03", "51-9195.04", "51-9195.05", "51-9195.07", "51-9196.00", "51-9197.00", "51-9198.00", "51-9199.01", "53-1011.00", "53-1021.00", "53-1021.01", "53-1031.00", "53-2011.00", "53-2012.00", "53-2021.00", "53-2022.00", "53-2031.00", "53-3011.00", "53-3021.00", "53-3022.00", "53-3031.00", "53-3032.00", "53-3033.00", "53-3041.00", "53-4011.00", "53-4012.00", "53-4013.00", "53-4021.00", "53-4031.00", "53-4041.00", "53-5011.00", "53-5021.01", "53-5021.02", "53-5021.03", "53-5022.00", "53-5031.00", "53-6011.00", "53-6021.00", "53-6031.00", "53-6041.00", "53-6051.01", "53-6051.07", "53-6051.08", "53-6061.00", "53-7011.00", "53-7021.00", "53-7031.00", "53-7032.00", "53-7033.00", "53-7041.00", "53-7051.00", "53-7061.00", "53-7062.00", "53-7063.00", "53-7064.00", "53-7071.00", "53-7072.00", "53-7073.00", "53-7081.00", "53-7111.00", "53-7121.00"];

function extractPersonalitySummary(full) {
    var summary = {};

    /**
     * return empty object if no assessment data is sent
     * if not assessment data then the the operation is to save assessment ID only
     */
    if('undefined' === typeof full.personalityBlend){
        return summary;
    }

    summary.personalityBlend = {};
    summary.personalityBlend.name = full.personalityBlend.name;
    summary.personalityBlend.personalityTypes = [];
    summary.personalityBlend.personalityTypes.push({_id: full.personalityBlend.personality_type_1.name});
    summary.personalityBlend.personalityTypes.push({_id: full.personalityBlend.personality_type_2.name});

    summary.personalityTypes = [];
    for (var x = 0; x < full.personalityTypes.length; x++) {
        var type = full.personalityTypes[x];
        var typeSummary = {};
        typeSummary.score = Number(type.score).toFixed(2);
        typeSummary._id = type.personality_type.name;
        summary.personalityTypes.push(typeSummary);
    }

    summary.personalityTraits = [];
    for (var x = 0; x < full.personalityTraits.length; x++) {
        var trait = full.personalityTraits[x];
        var traitSummary = {};
        traitSummary.score = trait.score;
        traitSummary._id = trait.personality_trait.name;
        summary.personalityTraits.push(traitSummary);
    }

    return summary;
}//// fun. extract summary

function saveEnvironment(env) {
    var toSave = {};
    toSave.meta = {};
    toSave.metaId = env.id;
    // toSave.metaName = env.name;
    toSave._id = env.name;
    toSave.metaType = 'environment';

    var envModel = traitifyModel(toSave);

    traitifyModel.findOne({metaId: toSave.metaId, metaType: 'environment'}).exec()
        .then(
            function (founded) {
                if (founded) {
                    /**
                     * pdate existant
                     */
                    founded.meta = toSave.meta;
                    founded.metaName = toSave.metaName;
                    founded.save(function (err, savedEnv) {
                        // console.log(err);
                    });
                }
                else {
                    /**
                     * Do a new instert
                     */
                    envModel.save(function (err, savedEnv) {
                        // console.log(err);
                    });
                }

            }
        );/// .then

    return toSave._id;
}/// fun. saveEviorme

function saveFamous(fam) {
    // console.log(fam)
    var toSave = {};
    toSave.meta = {};
    toSave.metaId = fam.id;
    toSave._id = fam.name;
    toSave.metaType = 'famous_people';
    toSave.meta.picture = fam.picture;
    toSave.meta.description = fam.description;

    var famModel = traitifyModel(toSave);
    traitifyModel.findOne({metaId: toSave.metaId, metaType: 'famous_people'}).exec()
        .then(
            function (founded) {
                if (founded) {
                    /**
                     * pdate existant
                     */
                    founded.meta = toSave.meta;
                    founded.metaName = toSave.metaName;
                    founded.save(function (err, savedFam) {
                        // console.log(err);
                    });
                }
                else {
                    /**
                     * Do a new instert
                     */
                    famModel.save(function (err, savedFam) {
                        // console.log(err);
                    });
                }

            }
        );/// .then

    return toSave._id;
}/// fun. saveFamous

function extractTraitMeta(trait) {
    // console.log(trait);
    var ret = {};
    ret.meta = {};
    ret._id = trait.personality_trait.name;
    ret.metaType = 'personality_trait';
    ret.meta.definition = trait.personality_trait.definition;
    ret.meta.personalityType = trait.personality_trait.personality_type.name;
    ret.metaId = ret._id;
    return ret;
}//// fun. extractTraitMeta


function extractTypeMeta(type) {
    var ret = {};
    ret.meta = {};

    type = type.personality_type;

    ret.metaId = type.id;
    ret.metaType = 'personality_type';
    // ret.metaName = type.name;
    ret._id = type.name;


    ret.meta.keywords = type.keywords;
    ret.meta.details = type.details;

    ret.meta.environments = [];
    var envirs = type.environments;
    for (var x = 0; x < envirs.length; x++) {

        // var envMeta = {};
        // envMeta.id = envirs[x].id;
        var envMeta = saveEnvironment(envirs[x]);
        ret.meta.environments.push(envMeta);
    }

    if (true === config.saveTraitifyFamousPeople) {
        ret.meta.famousPeople = [];
        var fams = type.famous_people;
        for (var x = 0; x < fams.length; x++) {
            var famMeta = saveFamous(fams[x]);
            // var famMeta = {};
            // famMeta.id = fams[x].id;
            ret.meta.famousPeople.push(famMeta);
            // console.log(fams[x]);
        }////
    }//// if saveFamousPepole


    return ret;
}//// fun. extractTypeMeta

function extractBlendMeta(blend) {
    var ret = {};
    ret.meta = {};
    // console.log(blend);

    // ret.metaName = blend.name;
    ret._id = blend.name;
    ret.metaId = ret._id;//.replace('/', '');
    ret.metaType = 'personality_blend';
    ret.meta.details = blend.details;
    ret.meta.description = blend.description;

    ret.meta.environments = [];
    // console.log("Count: " + blend.environments.length);
    blend.environments.forEach(function(environment) {
        console.log(environment.name);
        ret.meta.environments.push(environment.name);
    });


    return ret;
}//// fun. extractBlendMeta

/**
 * [traitifySevice Object to be exported as module]
 * @type {Object}
 */
var traitifySevice = {

    getAssessmentId: function (next) {

        var deckId = 'career-deck';
        traitify.createAssessment(deckId, function (assessment) {
            if (assessment) {
                next(null, assessment)
            } else {
                next({'error': 'couldn\'t retreive assesment id'}, null);
            }
        });

    },

    getAll: function (reqQuery) {
        var filters = {};
        if (undefined !== reqQuery.userId) {
            filters['_id'] = reqQuery.userId;
        }
        return traitifyModel.find(filters).exec();
    },


    // Recursively get career matches until all onetIds are had or the depth threshold is reached.
    getAssessmentCareerMatchScoresByIdDepthMax: 10,
    getAssessmentCareerMatchScoresByIdDepth: {},
    getAssessmentCareerMatchScoresByIdWithParams: function (assessmentId, onetIds) {
        var deferred = q.defer();
        var self = this;

        this.getAssessmentCareerMatchScoresByIdDepth[assessmentId]++;
        if (this.getAssessmentCareerMatchScoresByIdDepth[assessmentId] > this.getAssessmentCareerMatchScoresByIdDepthMax) {
            // console.log("Error: getAssessmentCareerMatchScoresByIdDepthMax hit");
            deferred.resolve({});
            return deferred.promise;
        }

        // // console.log("Getting " + onetIds.length + " career matches for " + assessmentId + ". " +
        //     "Depth = " + this.getAssessmentCareerMatchScoresByIdDepth[assessmentId] +
        //     "/" + this.getAssessmentCareerMatchScoresByIdDepthMax);

        traitify.getCareerMatches(assessmentId, onetIds, function (matchesRaw) {
            try {

                // // console.log("Got " + matchesRaw.length + " career matches for " + assessmentId + ". " +
                //     "Depth = " + self.getAssessmentCareerMatchScoresByIdDepth[assessmentId] +
                //     "/" + self.getAssessmentCareerMatchScoresByIdDepthMax);

                var matches = {};
                var matchOnetIds = [];
                for (let match of matchesRaw) {
                    matchOnetIds.push(match.career.id);
                    matches[match.career.id] = Math.round(match.score * 100) / 100;
                }
                var missingOnetIds = _.xor(onetIds, matchOnetIds);
                if (missingOnetIds.length > 0) {
                    self.getAssessmentCareerMatchScoresByIdWithParams(assessmentId, missingOnetIds)
                        .then(
                            function (matches2) {
                                for (var onetId in matches2) {
                                    matches[onetId] = matches2[onetId];
                                }
                                deferred.resolve(matches);
                            });
                } else {
                    deferred.resolve(matches);
                }

            } catch (error) {
                // console.log("Error:  getCareerMatches failed:  " + error);
                deferred.resolve({});
            }
        });


        return deferred.promise;

    },
    getAssessmentCareerMatchScoresById: function (assessmentId) {
        this.getAssessmentCareerMatchScoresByIdDepth[assessmentId] = 0;
        var self = this;
        return this.getAssessmentCareerMatchScoresByIdWithParams(assessmentId, onetIdsAll).then(function (matches) {
            delete self.getAssessmentCareerMatchScoresByIdDepth[assessmentId];
            var deferred = q.defer();
            deferred.resolve(matches);
            return deferred.promise;
        });

    },

    addTraitifyCareerMatchScoresToUserByUserId: function (userId) {
        var self = this;
        return userModel.findById(userId)
            .then(function (user) {
                return self.addTraitifyCareerMatchScoresToUser(user);
            });
    },


    addTraitifyCareerMatchScoresToUser: function (user) {
        // console.log("TS:addTraitifyCareerMatchScoresToUser:info:293");
        try {
            user.personalityExams[0].extId;
        } catch (err) {
            var err = "TS:addTraitifyCareerMatchScoresToUser:skip: missing personalityExam";
            console.log(err);
            var deferred = q.defer();
            deferred.reject(err);
            return deferred.promise;
        }

        // console.log("TS:addTraitifyCareerMatchScoresToUser:info:294");
        try {
            if (onetIdsAll.length == Object.keys(user.personalityExams[0].careerMatchScores.toObject()).length) {
                console.warn("TS:addTraitifyCareerMatchScoresToUser:skip: getAssessmentCareerMatchScoresById because already gotten");
                var deferred = q.defer();
                deferred.resolve(user);
                return deferred.promise;
            }
        } catch (err) {
            // console.log("TS:addTraitifyCareerMatchScoresToUser:info:294.1: User is fresh");
        }

        // console.log("TS:addTraitifyCareerMatchScoresToUser:info:295");
        return traitifySevice.getAssessmentCareerMatchScoresById(user.personalityExams[0].extId)
            .then(function (careerMatchScores) {
                // console.log("TS:addTraitifyCareerMatchScoresToUser:info:296");
                console.warn("TS:addTraitifyCareerMatchScoresToUser:info: Career Match Count actual/expected: " + Object.keys(careerMatchScores).length + "/" + onetIdsAll.length);

                if (Object.keys(careerMatchScores).length == 0) {
                    console.warn("TS:addTraitifyCareerMatchScoresToUser:warning:  Skipping update user with career match scores because traitify call failed.");
                    var deferred = q.defer();
                    deferred.resolve(user);
                    return deferred.promise;
                }

                // Note:  Mongo will group occIds by parts, separated by '.', so
                // replace with ','
                var careerMatchScores2 = {};
                for (var occId in careerMatchScores) {
                    careerMatchScores2[occId.replace('.', ',')] = careerMatchScores[occId];
                }
                // console.log("TS:addTraitifyCareerMatchScoresToUser:info:297");
                user.personalityExams[0].careerMatchScores = careerMatchScores2;
                return user.save()
            });

    },

    createNewAssessment: function (userId, examId, data) {
        var deferred = q.defer();
        var self = this;

        /**
         * Get summary for user
         */
        var summary = extractPersonalitySummary(data);
        summary.extId = examId;

        // console.log("TS:createNewAssessment:info: Updating Personality Summary");
        userModel.findById(userId).exec().then(
            function (user) {
                user.personalityExams = [summary];
                user.queuedForMetricUpdate = true;
                user.save().then(
                    function (user) {
                        deferred.resolve(user.personalityExams[0]);
                        // return self.updateAssessmentCareerMatchScoresByUserId(user._id);
                    },
                    function (err) {
                        err = "TS:createNewAssessment:error:1: "+err;
                        console.error(err);
                        deferred.reject(err);
                    }
                );
            },
            function (err) {
                err = "TS:createNewAssessment:error:2: "+err;
                console.error(err);
                deferred.reject(err);
            }
        );

        //});

        /**
         * end this method if config option set to stop extracting traitify meta
         */

        if (false === config.extractTraitifyMeta || 'undefined' === typeof data.personalityBlend) return deferred.promise;

        /**
         * Save Blend meta
         */
        var blend = extractBlendMeta(data.personalityBlend);

        traitifyModel.findOne({_id: blend._id}).exec()
            .then(
                function (founded) {
                    if (null !== founded) {
                        founded.meta = blend.meta;
                        founded.save(function (err, saved) {
                            if (err) {
                                err = "TS:createNewAssessment:error:3: "+err;
                                console.error(err);
                                deferred.reject(err);
                            }
                        })
                    }//// if null !== founded
                    else {
                        var newBlend = new traitifyModel(blend);

                        newBlend.save(function (err, saved) {
                            if (err) {
                                err = "TS:createNewAssessment:error:4: "+err;
                                console.error(err);
                                deferred.reject(err);
                            }
                        })
                    }//// if null !== else
                },//// fun. resolve
                function (err) {
                    err = "TS:createNewAssessment:error:5: "+err;
                    console.error(err);
                    deferred.reject(err);
                }
            );/// then

        /**
         * Save Type meta
         */
        if (Array.isArray(data.personalityTypes) && data.personalityTypes.length > 0) {
            var promises = data.personalityTypes.map(function (rawType) {
                var type = extractTypeMeta(rawType);
                return q.ninvoke(traitifyModel, 'findOne', {_id: type._id})
                    .then(function (founded) {
                        if (founded) {
                            /**
                             * Type is saved previously do update
                             */

                            founded.meta = type.meta;
                            founded.metaName = type.metaName;
                            founded.save(function (err, saved) {
                                if (err) {
                                    err = "TS:createNewAssessment:error:6: "+err;
                                    console.error(err);
                                    deferred.reject(err);
                                }
                            });
                        }
                        else {
                            /**
                             * Type is not there add new trait meta
                             */
                            var newType = new traitifyModel(type);
                            newType.save(function (err, saved) {
                                if (err) {
                                    err = "TS:createNewAssessment:error:7: "+err;
                                    console.error(err);
                                    deferred.reject(err);
                                }
                            });
                        }
                    });//// q.nivoke.then()
            });//// map

            q.all(promises)
                .then(function () {
                    // console.log('all types meta are saved');
                });
        }//// if array


        /**
         * Save Trait meta
         * Make sure to wait for asynchronous task through using Q promisses
         */

        if (Array.isArray(data.personalityTraits) && data.personalityTraits.length > 0) {

            var promises = data.personalityTraits.map(function (rawTrait) {
                var trait = extractTraitMeta(rawTrait);
                return q.ninvoke(traitifyModel, 'findOne', {_id: trait._id})
                    .then(function (founded) {
                        if (founded) {
                            /**
                             * trait is saved previously do update
                             */
                            founded.meta = trait.meta;
                            founded.metaName = trait.metaName;
                            founded.save(function (err, saved) {
                                if (err) {
                                    err = "TS:createNewAssessment:error:8: "+err;
                                    console.error(err);
                                    deferred.reject(err);
                                }
                            });
                        }
                        else {
                            /**
                             * Trait is not there add new trait meta
                             */
                            var newTrait = new traitifyModel(trait);

                            newTrait.save(function (err, saved) {
                                if (err) {
                                    err = "TS:createNewAssessment:error:9: "+err;
                                    console.error(err);
                                    deferred.reject(err);
                                }
                            });
                        }
                    });//// q.nivoke.then()
            });//// map

            q.all(promises)
                .then(function () {
                    console.log('TS:createNewAssessment:info: all traits meta are saved');
                });
        }//// if isArray

        return deferred.promise;
    },

    getMeta: function(metaIds){
        return traitifyModel.find({_id:{$in:metaIds}}).exec();
    }

}//// traitifyService


module.exports = traitifySevice;