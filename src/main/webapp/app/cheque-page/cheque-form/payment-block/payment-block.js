angular.module("mainModule")
    .controller('PaymentBlock', ['$scope', 'currencyRatesService', '$rootScope', 'security',
        function($scope, currencyRatesService, $rootScope, security) {
            $scope.hasPrepayment = false;

            $scope.addPayment = function() {

                if($scope.cheque.payments === undefined)
                    $scope.cheque.payments = [];

                currencyRatesService.refreshCurrencyRate();
                $scope.cheque.payments.push(
                    {cost: 0,
                        currentCurrency: 'rub',
                        currency: $rootScope.currencyRates,
                        user: $rootScope.user.principal});
            };

            $scope.delPayment = function(payment) {
                $scope.cheque.payments.splice($scope.cheque.payments.indexOf(payment), 1);
            };

            $scope.sum = function(currency, withPrepayment) {
                var sum = 0;
                $scope.hasPrepayment = false;

                if($scope.cheque.payments != undefined)
                    $scope.cheque.payments.forEach(function(item) {
                        if(item.cost != undefined && item.currentCurrency != undefined) {
                            if(item.type != 'prepayment')
                                sum += item.cost * item.currency[item.currentCurrency] / item.currency[currency];
                            else {
                                $scope.hasPrepayment = true;
                                if(withPrepayment)
                                    sum -= item.cost * item.currency[item.currentCurrency] / item.currency[currency];
                            }
                        }
                    });

                return sum;
            };

            $scope.security = security;
        }
    ])
    .directive('paymentBlock', [function() {
        return {
            restrict: 'E',
            controller: 'PaymentBlock',
            scope: {
                cheque: '=ngModel'
            },
            require: 'ngModel',
            templateUrl: 'app/cheque-page/cheque-form/payment-block/payment-block.html'
        }
    }]);