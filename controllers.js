angular.module('waitApp', ['ngRoute'])
.service('calculateMyEarnings', function(){

	//My Earnings Info
	var tipTotal = 0;
	var mealCount = 0;
	var avgTipPerMeal = 0;

	var subtotal = 0;
	var tip = 0;
	var total = 0;

	//Reset Flag
	var reset = false;

	var setToZero = function(){
		subtotal = 0;
		tip = 0;
		total = 0;
	}

	var setCustomerCharges = function(sub, tp){
		subtotal += sub;
		tip += tp;
		total = subtotal + tip;
	}

	var getCustomerCharges = function(){
		return {
			"subtotal" : subtotal,
			"tip" : tip,
			"total" : total
		}
	}

	var addTipToTotal = function(tipAmt){
		tipTotal+=tipAmt
	}

	var addToMealCount = function(){
		mealCount += 1
	}

	var calcAvgTip = function(){
		avgTipPerMeal = tipTotal / mealCount;		
	}


	var cancel = function(){
		tipTotal = 0;
		mealCount = 0;
		avgTipPerMeal = 0;
	}

	var getTipTotal = function(){
		return tipTotal;
	}

	var getMealCount = function(){
		return mealCount;
	}

	var getAvgTip = function(){
		return avgTipPerMeal;
	}

	var setReset = function(boolean){
		reset = boolean;
	}

	var getReset = function(){
		return reset;
	}

	return {
		addTipToTotal : addTipToTotal,
		addToMealCount : addToMealCount,
		getAvgTip : getAvgTip,
		getTipTotal : getTipTotal,
		getMealCount : getMealCount,
		calcAvgTip: calcAvgTip,
		cancel : cancel,
		setReset : setReset,
		getReset : getReset,
		setCustomerCharges : setCustomerCharges,
		getCustomerCharges : getCustomerCharges,
		setToZero : setToZero
	};

})
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
		templateUrl : 'home.html'
	})
	.when('/new_meal', {
		templateUrl : 'newMeal.html',
		controller : 'newMealCtrl as vm'
	})
	.when('/my_earnings', {
		templateUrl : 'myEarnings.html',
		controller : 'myEarningsCtrl as vm'
	})
	.otherwise('/');
}])

.controller('myEarningsCtrl', function(calculateMyEarnings){

	this.tipTotal = calculateMyEarnings.getTipTotal();
	this.mealCount = calculateMyEarnings.getMealCount();
	this.avgTipPerMeal = calculateMyEarnings.getAvgTip();

	this.reset = function(form){
		if(confirm('Are you sure you want to reset your form?')){
				this.tipTotal = 0;
				this.mealCount = 0;
				this.avgTipPerMeal = 0;
				calculateMyEarnings.setReset(true);
		}else{
			return;
		}
	}

})
.controller('newMealCtrl', function(calculateMyEarnings){

	var vm = this;



	//Meal details
	this.basePrice;
	this.taxRate;
	this.tipPercent;

	//Customer Charges
	this.subtotal = calculateMyEarnings.getCustomerCharges()["subtotal"];
	this.tip = calculateMyEarnings.getCustomerCharges()["tip"];
	this.total = calculateMyEarnings.getCustomerCharges()["total"];

	this.cancel = function(form){
		this.basePrice = "";
		this.taxRate = "";
		this.tipPercent = "";

		calculateMyEarnings.setToZero();
		this.subtotal = calculateMyEarnings.getCustomerCharges()["subtotal"];
		this.tip = calculateMyEarnings.getCustomerCharges()["tip"];
		this.total = calculateMyEarnings.getCustomerCharges()["total"];

		calculateMyEarnings.cancel();

		if(form){
			form.$setPristine();	
		}
		
	}

	if(calculateMyEarnings.getReset()){
		this.cancel();
		calculateMyEarnings.setReset(false);
		return;
	}

	var clear = function(form){
		vm.basePrice = "";
		vm.taxRate = "";
		vm.tipPercent = "";
		form.$setPristine();
	}


	var calcTaxes = function(base, taxRate){
		return base * taxRate / 100;
	}

	var calcTip = function(base, tipPerc){
		return base * tipPerc / 100
	}

	this.submitMeal = function(form){
		if(!form.$valid){
			form.$setSubmitted(true);
		}else{


			calculateMyEarnings.setCustomerCharges(this.basePrice + calcTaxes(this.basePrice, this.taxRate), calcTip(this.basePrice, this.tipPercent));
			// this.subtotal = this.basePrice + calcTaxes(this.basePrice, this.taxRate);
			// this.tip = calcTip(this.basePrice, this.tipPercent);
			// this.total = this.subtotal + this.tip;

			this.subtotal = calculateMyEarnings.getCustomerCharges()["subtotal"];
			this.tip = calculateMyEarnings.getCustomerCharges()["tip"];
			this.total = calculateMyEarnings.getCustomerCharges()["total"];

			calculateMyEarnings.addTipToTotal(this.tip);
			calculateMyEarnings.addToMealCount();
			calculateMyEarnings.calcAvgTip();

			clear(form);	
			calculateMyEarnings.setToZero();
		
		}
	
	}


	this.interacted = function(form, field){
		return form.$submitted && !field.$valid;
	}


});