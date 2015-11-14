exports.generateResponse = function(code, message, results){
    return {
      statusCode: code,
      message: message,
      results: results
    };
}