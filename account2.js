// budget controller 
var budgetController = (function(){
    var Income = function(id, description, value, time){
        this.id = id;
        this.description = description;
        this.value = value;
        this.time = time;
    }
    
    var Expenses = function(id, description, value, time){
        this.id = id;
        this.description = description;
        this.value = value;
        this.time = time;
        this.percentages = -1;
    }
Expenses.prototype.calculatePercentages = function(totalIncome){
    if(totalIncome > 0){this.percentages = Math.round((this.value/ totalIncome) * 100)}
    else{this.percentages = -1}
    };
    Expenses.prototype.getPercentages = function(){
        return this.percentages;
    };
    var calcbudget = function(type){
        var sum = 0;
        data.allItem[type].forEach(function(cur){
            sum = sum + cur.value
        })
        data.Total[type] = sum;
    };
    var data = {
        allItem :{
            exp : [],
            inc : []
        },
        Total : {
            exp : 0,
            inc : 0
        },
        Account : 0,
        Percentage : 0
    }
    return{
        addNewInputAsItem: function(type, des, val, time){
            var newItem, ID;
            if(data.allItem[type].length > 0){
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1
            }
            else {ID = 0}
            if(type === 'inc'){newItem = new Income(ID, des, val, time)}
            else if(type === 'exp'){newItem = new Expenses(ID, des, val, time)}
            data.allItem[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){
            calcbudget('inc');
            calcbudget('exp');
            data.Account = data.Total.inc - data.Total.exp;
            data.Percentage = Math.round((data.Total.exp / data.Total.inc) * 100);
        },
        getCalcalutedBuget: function(){
            return{
                totalIncome : data.Total.inc,
                totalExpenses : data.Total.exp,
                Percentage : data.Percentage,
                Account : data.Account
            }
        },
        calculatePercentage : function(){
            data.allItem.exp.forEach(function(cur){
                cur.calculatePercentages(data.Total.inc);
            })
        },
        getPercentage : function(){
            var percentages = data.allItem.exp.map(function(cur){
                return cur.getPercentages();
            })
            return percentages;
        },
        deleteItem: function(type, id){
            var ids = data.allItem[type].map(function(cur){
                return cur.id;
            })
            var index = ids.indexOf(id);
            if(index !== -1){data.allItem[type].splice(index,1)}
        },
        testing : function(){
            console.log(data);
        }
    }
})();

// ui controller
 var UIController = (function(){
     var formatNumber = function(num, type){
         var num = Math.abs(num)
         num = num.toFixed(2);
         numSplit = num.split('.');
         int = numSplit[0];
         dec = numSplit[1];
         if(int.length > 3){int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);}

         return (type === 'exp'? '-' : '+') + ' #' + int + '.' + dec; 
     };
       return{
           getInput : function(){
               var now,  hour, minute, date, month, year, time;
               now = new Date();
               hour = now.getHours();
               minute = now.getMinutes();
               date = now.getDate();
               month = now.getMonth();
               year = now.getFullYear();
               time = `${hour + 1}:${minute} of ${date}-${month + 1}-${year}`
               return{
                   type : document.querySelector('.input-type').value,
                   description : document.querySelector('.input-description').value,
                   value : parseFloat(document.querySelector('.input-value').value),
                   time
               }
           },
           changeColor: function(){
               var fields = document.querySelectorAll('.input-type-bg' + ',' + '.amount-sym' + ',' + '.btn-add');
               var nodeListForEach = function(list, callback){
                   for(var i = 0; i < list.length; i++){
                       callback(list[i], i);
                   }
               }
               nodeListForEach(fields, function(cur){
                   cur.classList.toggle('changerColor');
               })
           },
           displayItem: function(type, des, val, time, id){
               var incomeTable = document.querySelector('.income-tbody');
               var expenseTable = document.querySelector('.expense-tbody');
           if(type === 'inc'){
               var row = document.createElement('tr');
               row.className = 'table-row';
               row.setAttribute('id', `${type}-${id}`);
               row.innerHTML = `
               <td class = "text-uppercase" >${des}</td>
               <td>${formatNumber(val, 'inc')}</td>
               <td>${time}</td>
               <td><a href = "#" class = "delete" >X</a></td>
               `;
               incomeTable.appendChild(row)
           }
           else if(type === 'exp'){
            var row = document.createElement('tr');
            row.className = 'table-row';
            row.setAttribute('id', `${type}-${id}`);
            row.innerHTML = `
            <td class = "text-uppercase" >${des}</td>
            <td>${formatNumber(val, 'exp')}</td>
            <td class = "per-hold" ></td>
            <td>${time}</td>
            <td><a href = "#" class = "delete" >X</a></td>
            `;
            expenseTable.appendChild(row);
        }
           },
           displayDate : function(){
            var now,  hour, minute, date, month, year, months, days, day;
            now = new Date();
            hour = now.getHours();
            minute = now.getMinutes();
            date = now.getDate();
            days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            day = now.getDay();
            months = ['January', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector('.displayMY').textContent = ` ${days[day]}, ${months[month]}-${date}-${year}`
           },
           displayBudget : function(income, expenses, account, percentage){
               if(account < 0){type = 'exp'}
               else{type = 'inc'}
               document.querySelector('.total-money').textContent =  formatNumber(account, type);
               document.querySelector('.total-income').textContent = 'Income:' + " " + formatNumber(income, 'inc');
               document.querySelector('.total-expense').textContent = 'Expense:' + " " +  formatNumber(expenses, 'exp');
               if (percentage > 0){document.querySelector('.percentage').textContent = 'Percentage:' + " " +  percentage + '%'}
               else{document.querySelector('.percentage').textContent = '---'}
           },
           displayPercentages : function(percentages){
               var fields = document.querySelectorAll('.per-hold');
               var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            }
            nodeListForEach(fields, function(cur, index){
              if(percentages[index] > 0){ cur.textContent = percentages[index] + '%'}
              else{percentages[index] = '---'}
            })
           },
           deleteRow : function(itemId){
               var element = document.getElementById(itemId);
               element.parentElement.removeChild(element);
           },
           clearFields: function(){
               var fields = document.querySelectorAll('.input-description' + ',' + '.input-value');
               var fieldsArr = Array.prototype.slice.call(fields);
               fieldsArr.forEach(function(cur){
                   cur.value = '';
               })
           }
       }
 })();

 // global controller
 var globalController = (function(budgCrtl, UiCtrl){
var setEventListeners = function(){
// event listener for button add
 document.querySelector('.btn-add').addEventListener('click', function(e){
     e.preventDefault();
    crtlAddInput();
 });
 // event for keypress
 document.addEventListener('keypress', function(e){
     if(e.keypress === 13){crtlAddInput();}
 });
 // event for change select color
 document.querySelector('.input-type').addEventListener('change', UiCtrl.changeColor);
// event for delete button
document.querySelector('.inc-exp-table').addEventListener('click', crtlDeleteBudget);


}
// calculate budget
var crtlCalculatebudget = function(){
    // calculate budget in bdgtcrtl
   budgCrtl.calculateBudget();
   // get budget from budgetcrtl
   var budget = budgCrtl.getCalcalutedBuget();
   //display budget in ui
   UiCtrl.displayBudget(budget.totalIncome, budget.totalExpenses, budget.Account, budget.Percentage);
};
// delete budget from ui and data structure
var crtlDeleteBudget = function(e){
      var itemId = e.target.parentElement.parentElement.id;
    var  itemIdSplit = itemId.split('-') ;
    var type = itemIdSplit[0];
    var ID = parseInt(itemIdSplit[1]);
    //delet item from data structure
    budgCrtl.deleteItem(type, ID);
    // delete from ui
    UiCtrl.deleteRow(itemId);
    //re calculate budget
    crtlCalculatebudget();
};
  // control add input function
  var crtlAddInput = function (){
      //get input from ui
      var input = UiCtrl.getInput();
      
     // add input to data in budget controller
      if(input.description !== '' && input.value > 0 && !isNaN(input.value)){
          // add inputs to data as new item
      var newItem = budgCrtl.addNewInputAsItem(input.type, input.description, input.value, input.time);
      // display item in ui
       UiCtrl.displayItem(input.type, input.description, input.value, input.time, newItem.id);
       // calc exp percentages
       budgCrtl.calculatePercentage();

       //get exp percentages
       var percentages = budgCrtl.getPercentage();
       // display exp percentages
       UiCtrl.displayPercentages(percentages);

      // declare crtl calculate budget
      crtlCalculatebudget();
      UiCtrl.clearFields();
      }
  }





    return{
          init : function(){
              UiCtrl.displayDate();
              setEventListeners();
              console.log('APPLICATION IS WORKING');
          }
    }
 })(budgetController, UIController);

 globalController.init();