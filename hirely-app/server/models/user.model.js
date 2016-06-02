'use strict'
var Utilities = require('./utilities-for-models');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var freeSchema = new Schema({}, {strict: false, _id: false});

function endDateValidator(value) {
    /**
     * this here will refer to schema
     */

    if (null != value && !isNaN(value.getTime())
        && this.dateStart && !isNaN(this.dateStart.getTime())
    ) {
        return value > this.dateStart;
    }
    else {
        return true;
    }
}

/**
 * [customId schema with disabled auto _id to be used in arrays of personalityExam schema where the "name" is used as _id]
 * @type {Schema}
 */
var customId = new Schema({
        _id: {type: String, required: true},
        score: {type: String, required: false}
    }
    , {strict: false, _id: false});

var personalityCareerMatchScoresSchema = new Schema({
    "11-1011,00": String,
    "11-1011,03": String,
    "11-1021,00": String,
    "11-2011,00": String,
    "11-2021,00": String,
    "11-2022,00": String,
    "11-2031,00": String,
    "11-3011,00": String,
    "11-3021,00": String,
    "11-3031,01": String,
    "11-3031,02": String,
    "11-3051,00": String,
    "11-3051,01": String,
    "11-3051,02": String,
    "11-3051,04": String,
    "11-3061,00": String,
    "11-3071,01": String,
    "11-3071,02": String,
    "11-3071,03": String,
    "11-3111,00": String,
    "11-3121,00": String,
    "11-3131,00": String,
    "11-9013,01": String,
    "11-9013,02": String,
    "11-9013,03": String,
    "11-9021,00": String,
    "11-9031,00": String,
    "11-9032,00": String,
    "11-9033,00": String,
    "11-9039,01": String,
    "11-9039,02": String,
    "11-9041,00": String,
    "11-9041,01": String,
    "11-9051,00": String,
    "11-9061,00": String,
    "11-9071,00": String,
    "11-9081,00": String,
    "11-9111,00": String,
    "11-9121,00": String,
    "11-9121,01": String,
    "11-9121,02": String,
    "11-9131,00": String,
    "11-9141,00": String,
    "11-9151,00": String,
    "11-9161,00": String,
    "11-9199,01": String,
    "11-9199,02": String,
    "11-9199,03": String,
    "11-9199,04": String,
    "11-9199,07": String,
    "11-9199,08": String,
    "11-9199,11": String,
    "13-1011,00": String,
    "13-1021,00": String,
    "13-1022,00": String,
    "13-1023,00": String,
    "13-1031,01": String,
    "13-1031,02": String,
    "13-1032,00": String,
    "13-1041,01": String,
    "13-1041,02": String,
    "13-1041,03": String,
    "13-1041,04": String,
    "13-1041,06": String,
    "13-1041,07": String,
    "13-1051,00": String,
    "13-1071,00": String,
    "13-1074,00": String,
    "13-1075,00": String,
    "13-1081,00": String,
    "13-1081,01": String,
    "13-1081,02": String,
    "13-1111,00": String,
    "13-1121,00": String,
    "13-1131,00": String,
    "13-1141,00": String,
    "13-1151,00": String,
    "13-1161,00": String,
    "13-1199,01": String,
    "13-1199,02": String,
    "13-1199,03": String,
    "13-1199,04": String,
    "13-1199,05": String,
    "13-1199,06": String,
    "13-2011,01": String,
    "13-2011,02": String,
    "13-2021,01": String,
    "13-2021,02": String,
    "13-2031,00": String,
    "13-2041,00": String,
    "13-2051,00": String,
    "13-2052,00": String,
    "13-2053,00": String,
    "13-2061,00": String,
    "13-2071,00": String,
    "13-2071,01": String,
    "13-2072,00": String,
    "13-2081,00": String,
    "13-2082,00": String,
    "13-2099,02": String,
    "13-2099,04": String,
    "15-1111,00": String,
    "15-1121,00": String,
    "15-1121,01": String,
    "15-1122,00": String,
    "15-1131,00": String,
    "15-1132,00": String,
    "15-1133,00": String,
    "15-1134,00": String,
    "15-1141,00": String,
    "15-1142,00": String,
    "15-1143,00": String,
    "15-1143,01": String,
    "15-1151,00": String,
    "15-1152,00": String,
    "15-1199,01": String,
    "15-1199,02": String,
    "15-1199,03": String,
    "15-1199,04": String,
    "15-1199,05": String,
    "15-1199,06": String,
    "15-1199,08": String,
    "15-1199,09": String,
    "15-1199,10": String,
    "15-1199,11": String,
    "15-1199,12": String,
    "15-2011,00": String,
    "15-2021,00": String,
    "15-2031,00": String,
    "15-2041,00": String,
    "15-2041,01": String,
    "15-2041,02": String,
    "15-2091,00": String,
    "17-1011,00": String,
    "17-1012,00": String,
    "17-1021,00": String,
    "17-1022,00": String,
    "17-1022,01": String,
    "17-2011,00": String,
    "17-2021,00": String,
    "17-2031,00": String,
    "17-2041,00": String,
    "17-2051,00": String,
    "17-2051,01": String,
    "17-2061,00": String,
    "17-2071,00": String,
    "17-2072,00": String,
    "17-2072,01": String,
    "17-2081,00": String,
    "17-2081,01": String,
    "17-2111,01": String,
    "17-2111,02": String,
    "17-2111,03": String,
    "17-2112,00": String,
    "17-2112,01": String,
    "17-2121,01": String,
    "17-2121,02": String,
    "17-2131,00": String,
    "17-2141,00": String,
    "17-2141,01": String,
    "17-2141,02": String,
    "17-2151,00": String,
    "17-2161,00": String,
    "17-2171,00": String,
    "17-2199,01": String,
    "17-2199,02": String,
    "17-2199,03": String,
    "17-2199,04": String,
    "17-2199,05": String,
    "17-2199,07": String,
    "17-2199,08": String,
    "17-2199,09": String,
    "17-2199,10": String,
    "17-2199,11": String,
    "17-3011,01": String,
    "17-3011,02": String,
    "17-3012,01": String,
    "17-3012,02": String,
    "17-3013,00": String,
    "17-3021,00": String,
    "17-3022,00": String,
    "17-3023,01": String,
    "17-3023,03": String,
    "17-3024,00": String,
    "17-3024,01": String,
    "17-3025,00": String,
    "17-3026,00": String,
    "17-3027,00": String,
    "17-3029,01": String,
    "17-3029,02": String,
    "17-3029,03": String,
    "17-3029,04": String,
    "17-3029,05": String,
    "17-3029,06": String,
    "17-3029,07": String,
    "17-3029,08": String,
    "17-3029,09": String,
    "17-3031,01": String,
    "17-3031,02": String,
    "19-1011,00": String,
    "19-1012,00": String,
    "19-1013,00": String,
    "19-1020,01": String,
    "19-1021,00": String,
    "19-1022,00": String,
    "19-1023,00": String,
    "19-1029,01": String,
    "19-1029,02": String,
    "19-1029,03": String,
    "19-1031,01": String,
    "19-1031,02": String,
    "19-1031,03": String,
    "19-1032,00": String,
    "19-1041,00": String,
    "19-1042,00": String,
    "19-2011,00": String,
    "19-2012,00": String,
    "19-2021,00": String,
    "19-2031,00": String,
    "19-2032,00": String,
    "19-2041,00": String,
    "19-2041,01": String,
    "19-2041,02": String,
    "19-2041,03": String,
    "19-2042,00": String,
    "19-2043,00": String,
    "19-2099,01": String,
    "19-3011,00": String,
    "19-3011,01": String,
    "19-3022,00": String,
    "19-3031,01": String,
    "19-3031,02": String,
    "19-3031,03": String,
    "19-3032,00": String,
    "19-3039,01": String,
    "19-3041,00": String,
    "19-3051,00": String,
    "19-3091,01": String,
    "19-3091,02": String,
    "19-3092,00": String,
    "19-3093,00": String,
    "19-3094,00": String,
    "19-3099,01": String,
    "19-4011,01": String,
    "19-4011,02": String,
    "19-4021,00": String,
    "19-4031,00": String,
    "19-4041,01": String,
    "19-4041,02": String,
    "19-4051,01": String,
    "19-4051,02": String,
    "19-4061,00": String,
    "19-4061,01": String,
    "19-4091,00": String,
    "19-4092,00": String,
    "19-4093,00": String,
    "19-4099,01": String,
    "19-4099,02": String,
    "19-4099,03": String,
    "21-1011,00": String,
    "21-1012,00": String,
    "21-1013,00": String,
    "21-1014,00": String,
    "21-1015,00": String,
    "21-1021,00": String,
    "21-1022,00": String,
    "21-1023,00": String,
    "21-1091,00": String,
    "21-1092,00": String,
    "21-1093,00": String,
    "21-1094,00": String,
    "21-2011,00": String,
    "21-2021,00": String,
    "23-1011,00": String,
    "23-1012,00": String,
    "23-1021,00": String,
    "23-1022,00": String,
    "23-1023,00": String,
    "23-2011,00": String,
    "23-2091,00": String,
    "23-2093,00": String,
    "25-1011,00": String,
    "25-1021,00": String,
    "25-1022,00": String,
    "25-1031,00": String,
    "25-1032,00": String,
    "25-1041,00": String,
    "25-1042,00": String,
    "25-1043,00": String,
    "25-1051,00": String,
    "25-1052,00": String,
    "25-1053,00": String,
    "25-1054,00": String,
    "25-1061,00": String,
    "25-1062,00": String,
    "25-1063,00": String,
    "25-1064,00": String,
    "25-1065,00": String,
    "25-1066,00": String,
    "25-1067,00": String,
    "25-1071,00": String,
    "25-1072,00": String,
    "25-1081,00": String,
    "25-1082,00": String,
    "25-1111,00": String,
    "25-1112,00": String,
    "25-1113,00": String,
    "25-1121,00": String,
    "25-1122,00": String,
    "25-1123,00": String,
    "25-1124,00": String,
    "25-1125,00": String,
    "25-1126,00": String,
    "25-1191,00": String,
    "25-1192,00": String,
    "25-1193,00": String,
    "25-1194,00": String,
    "25-2011,00": String,
    "25-2012,00": String,
    "25-2021,00": String,
    "25-2022,00": String,
    "25-2023,00": String,
    "25-2031,00": String,
    "25-2032,00": String,
    "25-2052,00": String,
    "25-2053,00": String,
    "25-2054,00": String,
    "25-2059,01": String,
    "25-3011,00": String,
    "25-3021,00": String,
    "25-3099,02": String,
    "25-4011,00": String,
    "25-4012,00": String,
    "25-4013,00": String,
    "25-4021,00": String,
    "25-4031,00": String,
    "25-9011,00": String,
    "25-9021,00": String,
    "25-9031,00": String,
    "25-9031,01": String,
    "25-9041,00": String,
    "27-1011,00": String,
    "27-1012,00": String,
    "27-1013,00": String,
    "27-1014,00": String,
    "27-1021,00": String,
    "27-1022,00": String,
    "27-1023,00": String,
    "27-1024,00": String,
    "27-1025,00": String,
    "27-1026,00": String,
    "27-1027,00": String,
    "27-2011,00": String,
    "27-2012,01": String,
    "27-2012,02": String,
    "27-2012,03": String,
    "27-2012,04": String,
    "27-2012,05": String,
    "27-2021,00": String,
    "27-2022,00": String,
    "27-2023,00": String,
    "27-2031,00": String,
    "27-2032,00": String,
    "27-2041,01": String,
    "27-2041,04": String,
    "27-2042,01": String,
    "27-2042,02": String,
    "27-3011,00": String,
    "27-3012,00": String,
    "27-3021,00": String,
    "27-3022,00": String,
    "27-3031,00": String,
    "27-3041,00": String,
    "27-3042,00": String,
    "27-3043,04": String,
    "27-3043,05": String,
    "27-3091,00": String,
    "27-4011,00": String,
    "27-4012,00": String,
    "27-4013,00": String,
    "27-4014,00": String,
    "27-4021,00": String,
    "27-4031,00": String,
    "27-4032,00": String,
    "29-1011,00": String,
    "29-1021,00": String,
    "29-1022,00": String,
    "29-1023,00": String,
    "29-1024,00": String,
    "29-1031,00": String,
    "29-1041,00": String,
    "29-1051,00": String,
    "29-1061,00": String,
    "29-1062,00": String,
    "29-1063,00": String,
    "29-1064,00": String,
    "29-1065,00": String,
    "29-1066,00": String,
    "29-1067,00": String,
    "29-1069,01": String,
    "29-1069,02": String,
    "29-1069,03": String,
    "29-1069,04": String,
    "29-1069,05": String,
    "29-1069,06": String,
    "29-1069,07": String,
    "29-1069,08": String,
    "29-1069,09": String,
    "29-1069,10": String,
    "29-1069,11": String,
    "29-1069,12": String,
    "29-1071,00": String,
    "29-1071,01": String,
    "29-1081,00": String,
    "29-1122,00": String,
    "29-1122,01": String,
    "29-1123,00": String,
    "29-1124,00": String,
    "29-1125,00": String,
    "29-1125,01": String,
    "29-1125,02": String,
    "29-1126,00": String,
    "29-1127,00": String,
    "29-1128,00": String,
    "29-1131,00": String,
    "29-1141,00": String,
    "29-1141,01": String,
    "29-1141,02": String,
    "29-1141,03": String,
    "29-1141,04": String,
    "29-1151,00": String,
    "29-1161,00": String,
    "29-1171,00": String,
    "29-1181,00": String,
    "29-1199,01": String,
    "29-1199,04": String,
    "29-1199,05": String,
    "29-2011,00": String,
    "29-2011,01": String,
    "29-2011,02": String,
    "29-2011,03": String,
    "29-2012,00": String,
    "29-2021,00": String,
    "29-2031,00": String,
    "29-2032,00": String,
    "29-2033,00": String,
    "29-2034,00": String,
    "29-2035,00": String,
    "29-2041,00": String,
    "29-2051,00": String,
    "29-2052,00": String,
    "29-2053,00": String,
    "29-2054,00": String,
    "29-2055,00": String,
    "29-2056,00": String,
    "29-2057,00": String,
    "29-2061,00": String,
    "29-2071,00": String,
    "29-2081,00": String,
    "29-2091,00": String,
    "29-2092,00": String,
    "29-2099,01": String,
    "29-2099,05": String,
    "29-2099,06": String,
    "29-2099,07": String,
    "29-9011,00": String,
    "29-9012,00": String,
    "29-9091,00": String,
    "29-9092,00": String,
    "29-9099,01": String,
    "31-1011,00": String,
    "31-1013,00": String,
    "31-1014,00": String,
    "31-2011,00": String,
    "31-2012,00": String,
    "31-2021,00": String,
    "31-2022,00": String,
    "31-9011,00": String,
    "31-9091,00": String,
    "31-9092,00": String,
    "31-9093,00": String,
    "31-9094,00": String,
    "31-9095,00": String,
    "31-9096,00": String,
    "31-9097,00": String,
    "31-9099,01": String,
    "31-9099,02": String,
    "33-1011,00": String,
    "33-1012,00": String,
    "33-1021,01": String,
    "33-1021,02": String,
    "33-2011,01": String,
    "33-2011,02": String,
    "33-2021,01": String,
    "33-2021,02": String,
    "33-2022,00": String,
    "33-3011,00": String,
    "33-3012,00": String,
    "33-3021,01": String,
    "33-3021,02": String,
    "33-3021,03": String,
    "33-3021,05": String,
    "33-3021,06": String,
    "33-3031,00": String,
    "33-3041,00": String,
    "33-3051,01": String,
    "33-3051,03": String,
    "33-3052,00": String,
    "33-9011,00": String,
    "33-9021,00": String,
    "33-9031,00": String,
    "33-9032,00": String,
    "33-9091,00": String,
    "33-9092,00": String,
    "33-9093,00": String,
    "33-9099,02": String,
    "35-1011,00": String,
    "35-1012,00": String,
    "35-2011,00": String,
    "35-2012,00": String,
    "35-2013,00": String,
    "35-2014,00": String,
    "35-2015,00": String,
    "35-2021,00": String,
    "35-3011,00": String,
    "35-3021,00": String,
    "35-3022,00": String,
    "35-3022,01": String,
    "35-3031,00": String,
    "35-3041,00": String,
    "35-9011,00": String,
    "35-9021,00": String,
    "35-9031,00": String,
    "37-1011,00": String,
    "37-1012,00": String,
    "37-2011,00": String,
    "37-2012,00": String,
    "37-2021,00": String,
    "37-3011,00": String,
    "37-3012,00": String,
    "37-3013,00": String,
    "39-1011,00": String,
    "39-1012,00": String,
    "39-1021,00": String,
    "39-1021,01": String,
    "39-2011,00": String,
    "39-2021,00": String,
    "39-3011,00": String,
    "39-3012,00": String,
    "39-3021,00": String,
    "39-3031,00": String,
    "39-3091,00": String,
    "39-3092,00": String,
    "39-3093,00": String,
    "39-4011,00": String,
    "39-4021,00": String,
    "39-4031,00": String,
    "39-5011,00": String,
    "39-5012,00": String,
    "39-5091,00": String,
    "39-5092,00": String,
    "39-5093,00": String,
    "39-5094,00": String,
    "39-6011,00": String,
    "39-6012,00": String,
    "39-7011,00": String,
    "39-7012,00": String,
    "39-9011,00": String,
    "39-9011,01": String,
    "39-9021,00": String,
    "39-9031,00": String,
    "39-9032,00": String,
    "39-9041,00": String,
    "41-1011,00": String,
    "41-1012,00": String,
    "41-2011,00": String,
    "41-2012,00": String,
    "41-2021,00": String,
    "41-2022,00": String,
    "41-2031,00": String,
    "41-3011,00": String,
    "41-3021,00": String,
    "41-3031,01": String,
    "41-3031,02": String,
    "41-3031,03": String,
    "41-3041,00": String,
    "41-3099,01": String,
    "41-4011,00": String,
    "41-4011,07": String,
    "41-4012,00": String,
    "41-9011,00": String,
    "41-9012,00": String,
    "41-9021,00": String,
    "41-9022,00": String,
    "41-9031,00": String,
    "41-9041,00": String,
    "41-9091,00": String,
    "43-1011,00": String,
    "43-2011,00": String,
    "43-2021,00": String,
    "43-3011,00": String,
    "43-3021,01": String,
    "43-3021,02": String,
    "43-3031,00": String,
    "43-3041,00": String,
    "43-3051,00": String,
    "43-3061,00": String,
    "43-3071,00": String,
    "43-4011,00": String,
    "43-4021,00": String,
    "43-4031,01": String,
    "43-4031,02": String,
    "43-4031,03": String,
    "43-4041,01": String,
    "43-4041,02": String,
    "43-4051,00": String,
    "43-4051,03": String,
    "43-4061,00": String,
    "43-4071,00": String,
    "43-4081,00": String,
    "43-4111,00": String,
    "43-4121,00": String,
    "43-4131,00": String,
    "43-4141,00": String,
    "43-4151,00": String,
    "43-4161,00": String,
    "43-4171,00": String,
    "43-4181,00": String,
    "43-5011,00": String,
    "43-5011,01": String,
    "43-5021,00": String,
    "43-5031,00": String,
    "43-5032,00": String,
    "43-5041,00": String,
    "43-5051,00": String,
    "43-5052,00": String,
    "43-5053,00": String,
    "43-5061,00": String,
    "43-5071,00": String,
    "43-5081,01": String,
    "43-5081,02": String,
    "43-5081,03": String,
    "43-5081,04": String,
    "43-5111,00": String,
    "43-6011,00": String,
    "43-6012,00": String,
    "43-6013,00": String,
    "43-6014,00": String,
    "43-9011,00": String,
    "43-9021,00": String,
    "43-9022,00": String,
    "43-9031,00": String,
    "43-9041,01": String,
    "43-9041,02": String,
    "43-9051,00": String,
    "43-9061,00": String,
    "43-9071,00": String,
    "43-9081,00": String,
    "43-9111,00": String,
    "43-9111,01": String,
    "45-1011,05": String,
    "45-1011,06": String,
    "45-1011,07": String,
    "45-1011,08": String,
    "45-2011,00": String,
    "45-2021,00": String,
    "45-2041,00": String,
    "45-2091,00": String,
    "45-2092,01": String,
    "45-2092,02": String,
    "45-2093,00": String,
    "45-3011,00": String,
    "45-3021,00": String,
    "45-4011,00": String,
    "45-4021,00": String,
    "45-4022,00": String,
    "45-4023,00": String,
    "47-1011,00": String,
    "47-1011,03": String,
    "47-2011,00": String,
    "47-2021,00": String,
    "47-2022,00": String,
    "47-2031,01": String,
    "47-2031,02": String,
    "47-2041,00": String,
    "47-2042,00": String,
    "47-2043,00": String,
    "47-2044,00": String,
    "47-2051,00": String,
    "47-2053,00": String,
    "47-2061,00": String,
    "47-2071,00": String,
    "47-2072,00": String,
    "47-2073,00": String,
    "47-2081,00": String,
    "47-2082,00": String,
    "47-2111,00": String,
    "47-2121,00": String,
    "47-2131,00": String,
    "47-2132,00": String,
    "47-2141,00": String,
    "47-2142,00": String,
    "47-2151,00": String,
    "47-2152,01": String,
    "47-2152,02": String,
    "47-2161,00": String,
    "47-2171,00": String,
    "47-2181,00": String,
    "47-2211,00": String,
    "47-2221,00": String,
    "47-2231,00": String,
    "47-3011,00": String,
    "47-3012,00": String,
    "47-3013,00": String,
    "47-3014,00": String,
    "47-3015,00": String,
    "47-3016,00": String,
    "47-4011,00": String,
    "47-4021,00": String,
    "47-4031,00": String,
    "47-4041,00": String,
    "47-4051,00": String,
    "47-4061,00": String,
    "47-4071,00": String,
    "47-4091,00": String,
    "47-4099,02": String,
    "47-4099,03": String,
    "47-5011,00": String,
    "47-5012,00": String,
    "47-5013,00": String,
    "47-5021,00": String,
    "47-5031,00": String,
    "47-5041,00": String,
    "47-5042,00": String,
    "47-5051,00": String,
    "47-5061,00": String,
    "47-5071,00": String,
    "47-5081,00": String,
    "49-1011,00": String,
    "49-2011,00": String,
    "49-2021,00": String,
    "49-2021,01": String,
    "49-2022,00": String,
    "49-2091,00": String,
    "49-2092,00": String,
    "49-2093,00": String,
    "49-2094,00": String,
    "49-2095,00": String,
    "49-2096,00": String,
    "49-2097,00": String,
    "49-2098,00": String,
    "49-3011,00": String,
    "49-3021,00": String,
    "49-3022,00": String,
    "49-3023,01": String,
    "49-3023,02": String,
    "49-3031,00": String,
    "49-3041,00": String,
    "49-3042,00": String,
    "49-3043,00": String,
    "49-3051,00": String,
    "49-3052,00": String,
    "49-3053,00": String,
    "49-3091,00": String,
    "49-3092,00": String,
    "49-3093,00": String,
    "49-9011,00": String,
    "49-9012,00": String,
    "49-9021,01": String,
    "49-9021,02": String,
    "49-9031,00": String,
    "49-9041,00": String,
    "49-9043,00": String,
    "49-9044,00": String,
    "49-9045,00": String,
    "49-9051,00": String,
    "49-9052,00": String,
    "49-9061,00": String,
    "49-9062,00": String,
    "49-9063,00": String,
    "49-9064,00": String,
    "49-9071,00": String,
    "49-9081,00": String,
    "49-9091,00": String,
    "49-9092,00": String,
    "49-9093,00": String,
    "49-9094,00": String,
    "49-9095,00": String,
    "49-9096,00": String,
    "49-9097,00": String,
    "49-9098,00": String,
    "49-9099,01": String,
    "51-1011,00": String,
    "51-2011,00": String,
    "51-2021,00": String,
    "51-2022,00": String,
    "51-2023,00": String,
    "51-2031,00": String,
    "51-2041,00": String,
    "51-2091,00": String,
    "51-2092,00": String,
    "51-2093,00": String,
    "51-3011,00": String,
    "51-3021,00": String,
    "51-3022,00": String,
    "51-3023,00": String,
    "51-3091,00": String,
    "51-3092,00": String,
    "51-3093,00": String,
    "51-4011,00": String,
    "51-4012,00": String,
    "51-4021,00": String,
    "51-4022,00": String,
    "51-4023,00": String,
    "51-4031,00": String,
    "51-4032,00": String,
    "51-4033,00": String,
    "51-4034,00": String,
    "51-4035,00": String,
    "51-4041,00": String,
    "51-4051,00": String,
    "51-4052,00": String,
    "51-4061,00": String,
    "51-4062,00": String,
    "51-4071,00": String,
    "51-4072,00": String,
    "51-4081,00": String,
    "51-4111,00": String,
    "51-4121,06": String,
    "51-4121,07": String,
    "51-4122,00": String,
    "51-4191,00": String,
    "51-4192,00": String,
    "51-4193,00": String,
    "51-4194,00": String,
    "51-5111,00": String,
    "51-5112,00": String,
    "51-5113,00": String,
    "51-6011,00": String,
    "51-6021,00": String,
    "51-6031,00": String,
    "51-6041,00": String,
    "51-6042,00": String,
    "51-6051,00": String,
    "51-6052,00": String,
    "51-6061,00": String,
    "51-6062,00": String,
    "51-6063,00": String,
    "51-6064,00": String,
    "51-6091,00": String,
    "51-6092,00": String,
    "51-6093,00": String,
    "51-7011,00": String,
    "51-7021,00": String,
    "51-7031,00": String,
    "51-7032,00": String,
    "51-7041,00": String,
    "51-7042,00": String,
    "51-8011,00": String,
    "51-8012,00": String,
    "51-8013,00": String,
    "51-8021,00": String,
    "51-8031,00": String,
    "51-8091,00": String,
    "51-8092,00": String,
    "51-8093,00": String,
    "51-8099,03": String,
    "51-9011,00": String,
    "51-9012,00": String,
    "51-9021,00": String,
    "51-9022,00": String,
    "51-9023,00": String,
    "51-9031,00": String,
    "51-9032,00": String,
    "51-9041,00": String,
    "51-9051,00": String,
    "51-9061,00": String,
    "51-9071,01": String,
    "51-9071,06": String,
    "51-9071,07": String,
    "51-9081,00": String,
    "51-9082,00": String,
    "51-9083,00": String,
    "51-9111,00": String,
    "51-9121,00": String,
    "51-9122,00": String,
    "51-9123,00": String,
    "51-9141,00": String,
    "51-9151,00": String,
    "51-9191,00": String,
    "51-9192,00": String,
    "51-9193,00": String,
    "51-9194,00": String,
    "51-9195,03": String,
    "51-9195,04": String,
    "51-9195,05": String,
    "51-9195,07": String,
    "51-9196,00": String,
    "51-9197,00": String,
    "51-9198,00": String,
    "51-9199,01": String,
    "53-1011,00": String,
    "53-1021,00": String,
    "53-1021,01": String,
    "53-1031,00": String,
    "53-2011,00": String,
    "53-2012,00": String,
    "53-2021,00": String,
    "53-2022,00": String,
    "53-2031,00": String,
    "53-3011,00": String,
    "53-3021,00": String,
    "53-3022,00": String,
    "53-3031,00": String,
    "53-3032,00": String,
    "53-3033,00": String,
    "53-3041,00": String,
    "53-4011,00": String,
    "53-4012,00": String,
    "53-4013,00": String,
    "53-4021,00": String,
    "53-4031,00": String,
    "53-4041,00": String,
    "53-5011,00": String,
    "53-5021,01": String,
    "53-5021,02": String,
    "53-5021,03": String,
    "53-5022,00": String,
    "53-5031,00": String,
    "53-6011,00": String,
    "53-6021,00": String,
    "53-6031,00": String,
    "53-6041,00": String,
    "53-6051,01": String,
    "53-6051,07": String,
    "53-6051,08": String,
    "53-6061,00": String,
    "53-7011,00": String,
    "53-7021,00": String,
    "53-7031,00": String,
    "53-7032,00": String,
    "53-7033,00": String,
    "53-7041,00": String,
    "53-7051,00": String,
    "53-7061,00": String,
    "53-7062,00": String,
    "53-7063,00": String,
    "53-7064,00": String,
    "53-7071,00": String,
    "53-7072,00": String,
    "53-7073,00": String,
    "53-7081,00": String,
    "53-7111,00": String,
    "53-7121,00": String,
});

var personalitySchema = new Schema({
    extId: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    personalityTypes: [customId],
    personalityTraits: [customId],
    personalityBlend: {
        name: String,
        personalityTypes: [customId]
    },
    careerMatchScores: personalityCareerMatchScoresSchema

});

var experienceSchema = new Schema({
    formattedAddress: {type: String, required: false},
    city: {type: String, required: true},
    state: {type: String, required: true},
    googlePlaceId: {type: String, required: false},
    currentlyHere: {type: Boolean, required: false},
    dateStart: {type: Date, required: true},
    dateEnd: {
        type: Date,
        required: false,
        validate: [endDateValidator, 'End date must be greater than start date']
    },
    reportedOccTitle: {type: String, required: true},
    occTitle: {type: String, required: true},
    occId: {type: String, required: false},
    accomplishments: {type: String, required: false},
    isSeasonal: {type: Boolean, default: false}
});

var educationSchema = new Schema({
    institutionName: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    programType: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(High School|Certificate|Associate's Degree|Bachelor's Degree|Master's Degree|Professional Degree|Doctoral Degree|Post-Doctoral Training)$/.test(v);
            },
            message: '{VALUE} is not valid education program type'
        }
    },
    focus: {type: String, reqired: true},

    dateEnd: {
        type: Date,
        required: false,
        validate: [endDateValidator, 'End date must be greater than start date']
    },
    status: {type: Number, required: true},
    extraCurriculars: [String]
});

var scoresSchema = new Schema({
    Knowledge: {
        "Clerical": String,
        "Psychology": String,
        "Economics and Accounting": String,
        "History and Archeology": String,
        "English Language": String,
        "Customer and Personal Service": String,
        "Mathematics": String,
        "Sociology and Anthropology": String,
        "Public Safety and Security": String,
        "Biology": String,
        "Administration and Management": String,
        "Transportation": String,
        "Engineering and Technology": String,
        "Fine Arts": String,
        "Sales and Marketing": String,
        "Building and Construction": String,
        "Law and Government": String,
        "Education and Training": String,
        "Philosophy and Theology": String,
        "Communications and Media": String,
        "Mechanical": String,
        "Chemistry": String,
        "Physics": String,
        "Computers and Electronics": String,
        "Personnel and Human Resources": String,
        "Production and Processing": String,
        "Therapy and Counseling": String,
        "Food Production": String,
        "Medicine and Dentistry": String,
        "Design": String,
        "Foreign Language": String,
        "Telecommunications": String,
        "Geography": String
    },
    Skills: {
        "Management of Financial Resources": String,
        "Monitoring": String,
        "Active Learning": String,
        "Technology Design": String,
        "Writing": String,
        "Equipment Selection": String,
        "Quality Control Analysis": String,
        "Mathematics": String,
        "Installation": String,
        "Operations Analysis": String,
        "Instructing": String,
        "Speaking": String,
        "Management of Personnel Resources": String,
        "Persuasion": String,
        "Management of Material Resources": String,
        "Reading Comprehension": String,
        "Active Listening": String,
        "Complex Problem Solving": String,
        "Learning Strategies": String,
        "Repairing": String,
        "Service Orientation": String,
        "Science": String,
        "Programming": String,
        "Systems Analysis": String,
        "Social Perceptiveness": String,
        "Negotiation": String,
        "Operation and Control": String,
        "Critical Thinking": String,
        "Operation Monitoring": String,
        "Systems Evaluation": String,
        "Time Management": String,
        "Equipment Maintenance": String,
        "Troubleshooting": String,
        "Coordination": String,
        "Judgment and Decision Making": String
    },
    Abilities: {
        "Visualization": String,
        "Deductive Reasoning": String,
        "Arm-Hand Steadiness": String,
        "Near Vision": String,
        "Speech Clarity": String,
        "Selective Attention": String,
        "Wrist-Finger Speed": String,
        "Trunk Strength": String,
        "Originality": String,
        "Explosive Strength": String,
        "Number Facility": String,
        "Control Precision": String,
        "Glare Sensitivity": String,
        "Memorization": String,
        "Auditory Attention": String,
        "Fluency of Ideas": String,
        "Far Vision": String,
        "Perceptual Speed": String,
        "Spatial Orientation": String,
        "Stamina": String,
        "Oral Comprehension": String,
        "Depth Perception": String,
        "Problem Sensitivity": String,
        "Night Vision": String,
        "Extent Flexibility": String,
        "Manual Dexterity": String,
        "Speed of Limb Movement": String,
        "Speech Recognition": String,
        "Inductive Reasoning": String,
        "Response Orientation": String,
        "Reaction Time": String,
        "Peripheral Vision": String,
        "Hearing Sensitivity": String,
        "Visual Color Discrimination": String,
        "Mathematical Reasoning": String,
        "Written Expression": String,
        "Static Strength": String,
        "Rate Control": String,
        "Multilimb Coordination": String,
        "Dynamic Flexibility": String,
        "Category Flexibility": String,
        "Written Comprehension": String,
        "Gross Body Equilibrium": String,
        "Time Sharing": String,
        "Gross Body Coordination": String,
        "Oral Expression": String,
        "Dynamic Strength": String,
        "Speed of Closure": String,
        "Flexibility of Closure": String,
        "Sound Localization": String,
        "Information Ordering": String,
        "Finger Dexterity": String
    },
    WorkActivities: {
        "Resolving Conflicts and Negotiating with Others": String,
        "Performing for or Working Directly with the Public": String,
        "Updating and Using Relevant Knowledge": String,
        "Provide Consultation and Advice to Others": String,
        "Monitoring and Controlling Resources": String,
        "Drafting, Laying Out, and Specifying Technical Devices, Parts, and Equipment": String,
        "Staffing Organizational Units": String,
        "Processing Information": String,
        "Interacting With Computers": String,
        "Assisting and Caring for Others": String,
        "Guiding, Directing, and Motivating Subordinates": String,
        "Coordinating the Work and Activities of Others": String,
        "Repairing and Maintaining Mechanical Equipment": String,
        "Inspecting Equipment, Structures, or Material": String,
        "Making Decisions and Solving Problems": String,
        "Getting Information": String,
        "Training and Teaching Others": String,
        "Handling and Moving Objects": String,
        "Operating Vehicles, Mechanized Devices, or Equipment": String,
        "Controlling Machines and Processes": String,
        "Monitor Processes, Materials, or Surroundings": String,
        "Repairing and Maintaining Electronic Equipment": String,
        "Scheduling Work and Activities": String,
        "Interpreting the Meaning of Information for Others": String,
        "Identifying Objects, Actions, and Events": String,
        "Developing Objectives and Strategies": String,
        "Thinking Creatively": String,
        "Judging the Qualities of Things, Services, or People": String,
        "Performing General Physical Activities": String,
        "Performing Administrative Activities": String,
        "Estimating the Quantifiable Characteristics of Products, Events, or Information": String,
        "Evaluating Information to Determine Compliance with Standards": String,
        "Communicating with Persons Outside Organization": String,
        "Developing and Building Teams": String,
        "Analyzing Data or Information": String,
        "Documenting/Recording Information": String,
        "Establishing and Maintaining Interpersonal Relationships": String,
        "Coaching and Developing Others": String,
        "Communicating with Supervisors, Peers, or Subordinates": String,
        "Selling or Influencing Others": String,
        "Organizing, Planning, and Prioritizing Work": String
    }
});

var userSchema = new Schema({
    /**
     * Personal info
     */
    firstName: {type: String, required: true, index: true},
    lastName: {type: String, required: true, index: true},
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: '{VALUE} is not valid email'
        },
        /**
         * make sure emails are all saved in lower case to easy compare
         */
        set: Utilities.toLower
    },
    password: String,
    mobile: {type: String},
    dateOfBirth: {type: Date},
    agreedToTerms: {type: Boolean},
    personalStatment: {type: String},
    profileImageURL: {type: String},
    profileImageThumbURL: {type: String},
    eligibleToWorkInUS: {type: Boolean},
    tenureAvg: {type: Number},
    queuedForMetricUpdate: {type: Boolean, default: false, index: true},
    sandboxMode: {type: Boolean, default:false},


    /**
     * Date fields
     */
    createdOn: {type: Date, default: Date.now},
    lastModifiedOn: {type: Date, default: Date.now},
    legalAgreementDate: {type: Date, default: Date.now},

    /**
     * Address fields
     */
    postalCode: String,

    /**
     * Preferences object
     */
    preferences: {
        desiredWageMin: Number,
        paidVacation: Boolean,
        paidSickTime: Boolean,
        flexibleSchedule: Boolean,
        healthInsurance: Boolean,
        dentalInsurance: Boolean,
        retirementPlan: Boolean,
        discounts: Boolean,
        optOutOfSuggestionsFromEmployers: {type: Boolean, default: false},
    },


    /**
     * Personality Exams
     */
    personalityExams: [personalitySchema],

    /**
     * Availability
     */
    availability: {
        isAvailable: {type: Boolean, default: true},
        startAvailability: Number,
        hoursPerWeekMin: Number,
        hoursPerWeekMax: Number,
        season: String,
        dateStart: Date,
        dateEnd: Date,
        mon: [Number],
        tue: [Number],
        wed: [Number],
        thu: [Number],
        fri: [Number],
        sat: [Number],
        sun: [Number]
    },

    /**
     * Work Experience
     */
    workExperience: [experienceSchema],

    /**
     * Education
     */
    education: [educationSchema],
    educationMax: {type: freeSchema, required: false},
    educationStatus: String,

    /**
     * KSAW scores
     */
    // TODO:  Explicitly specify each ksaw
    scores: scoresSchema,
    isVetted: {type: String, default: false},
    languagesSpoken: [String]

});


var UserModel = mongoose.model('User', userSchema, "users");

module.exports = UserModel;