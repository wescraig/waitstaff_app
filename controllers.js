angular.module('waitApp', [])

.controller('waitStaffCtrl', function(){
	//Meal details
	this.basePrice;
	this.taxRate;
	this.tipPercent;

	//Customer Charges
	this.subtotal = 0;
	this.tip = 0;
	this.total = 0;

	//My Earnings Info
	this.tipTotal = 0;
	this.mealCount = 0;
	this.avgTipPerMeal = 0;

	this.cancel = function(form){
		this.basePrice = "";
		this.taxRate = "";
		this.tipPercent = "";
		form.$setPristine();
	}

	this.submitMeal = function(form){
		if(!form.$valid){
			form.$setSubmitted(true);
		}else{

			var base = this.basePrice;
			var tax = base * this.taxRate / 100;
			var tip = base * this.tipPercent / 100;

			this.subtotal = base + tax;
			this.tip = tip;
			this.total = this.subtotal + this.tip;

			this.tipTotal += tip;
			this.mealCount += 1;
			this.avgTipPerMeal = this.tipTotal / this.mealCount;

			this.cancel(form);
			
		}


		
	}

	this.reset = function(form){
		if(confirm('Are you sure you want to reset your form?')){
				this.cancel(form);
				this.subtotal = 0;
				this.tip = 0;
				this.total = 0;
				this.tipTotal = 0;
				this.mealCount = 0;
				this.avgTipPerMeal = 0;
		}else{
			return;
		}
	}

	this.interacted = function(form, field){
		return form.$submitted && !field.$valid;
	}


});