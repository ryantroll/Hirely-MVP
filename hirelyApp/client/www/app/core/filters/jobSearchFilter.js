/**
 * Created by labrina.loving on 9/16/2015.
 */
angular.module("hirelyApp.core").filter('jobSearchFilter', function () {
    return function (items, occupation, minWage) {
        var filtered = [];
       for (var i = 0; i < items.length; i++) {
            var occupationMatched = true;
            var wageMatched = true;
            var item = items[i];
            if(occupation){
                occupationMatched = occupation.id === item.occupationId;
            }

           wageMatched = item.wage.amount >= minWage;
           if(wageMatched && occupationMatched)
           {
               filtered.push(item);
           }

        }
        return filtered;
    };
});
