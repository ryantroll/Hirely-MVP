var userService = require('../services/user.service');
var apiUtil = require('../utils/api-response');

var userRoutes = {

    getAll : function(req, res){
        /**
         * Get all users
         */
        userService.getAll()
        .then(
            function(users){
                res.status(200).json(apiUtil.generateResponse(200, "Users retrieved successfully", users));
            },
            function(error){
                //// user couldn't be found 404
                res.status(500).json(apiUtil.generateResponse(404, "Users couldn't be located", null));
            }
        );
    },

    getUserById : function(req, res){
        /**
         * Send basic info if extended is not requested
         */
        if(undefined === req.query.extended){
            userService.getBasicInfoById(req.params.id)
            .then(
                function(user){
                    res.status(200).json(apiUtil.generateResponse(200, "User retrieved successfully", user));
                },
                function(error){
                    //// user couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "User couldn't be located", null));
                }
            );
        } //// if extended
        /**
         * Send extend info if extended in URL query
         */
        else{
            userService.getExtendedInfoById(req.params.id)
            .then(
                function(user){
                    res.status(200).json(apiUtil.generateResponse(200, "User retrived successfully", user));
                },
                function(error){
                    //// user couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "User couldn't be located", null));
                }
            );
        }//// if extended else

    },

    createNewUser : function(req, res){

        var user = req.body;

        userService.createNewUser(user)
        .then(
            function(user){
                res.status(200).json(apiUtil.generateResponse(200, "User created successfully", user));
            },
            function(error){
                res.status(500).json(apiUtil.generateResponse(error.code, error.message, null));
            }
        )

        //res.json(apiUtil.generateResponse(200, "New user created successfully", result));
    },

    getUserByExternalId: function(req, res){
        userService.getUserByExternalId(req.params.extId)
        .then(
            function(user){
                res.status(200).json(apiUtil.generateResponse(200, "User retrived successfully", user));
            },
            function(error){
                //// user couldn't be found 404
                // console.log(error);
                res.status(500).json(apiUtil.generateResponse(500, "User couldn't be located with suplied external id", null));
            }
        );
    },//// fun. getUserByExternalId


}/// users object

module.exports = userRoutes;