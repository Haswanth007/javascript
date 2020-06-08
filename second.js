var budgetController = (function(){
    //
  var Expence = function(id,description,value){
      this.id =id;
      this.description =description;
      this.value=value;
      this.percentage = -1;

  };
  Expence.prototype.calpercentage =function(totalIncome){
    if(totalIncome>0){
        this.percentage = Math.round((this.value/totalIncome)*100);
    }else{
        this.percentage =-1;
    }
    return this.percentage; 

  };
  var Income = function(id,description,value){
    this.id =id;
    this.description =description;
    this.value=value;

};
    var data = {
        allitems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage :-1
    };
    return{
        addItem : function(type,des,val){
            var newItem,ID;
            if(data.allitems[type].length){
            ID = data.allitems[type][data.allitems[type].length-1].id+1;
        }else{
            ID =0;
        }
            if(type ==="exp"){
                newItem = new Expence(ID,des,val);
               // data.totals.exp =Number( data.totals.exp)+Number(newItem.value);
               
            }else if(type==="inc"){
                newItem= new Income(ID,des,val);
               // data.totals.inc =Number( data.totals.inc)+Number(newItem.value);
            }
            data.allitems[type].push(newItem);
        return newItem;
        },
        deleteItem:function(type,id){
            var ids=data.allitems[type].map(function(current){
                return current.id;

            });
            var index =ids.indexOf(id);
            if(index !== -1){
                data.allitems[type].splice(index,1);
            }
        },
        calculateTotal : function(type){
            var sum =0;
            data.allitems[type].forEach(function(cur){

                sum += parseFloat( cur.value);
            });
            data.totals[type]=sum;

        },
        calupercentage : function(){
           var r = data.allitems.exp.map(function(cur){
                return cur.calpercentage(data.totals.inc);
           });
           return r;
        },
        BudgetCalculate:function(){
            this.calculateTotal("exp");
             this.calculateTotal("inc");
            data.budget=data.totals.inc-data.totals.exp;
            if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
        },
        getbudget:function(){
            return{
                budget:data.budget,
                percentage:data.percentage,
                totalInc:data.totals.inc,
                totalEXP:data.totals.exp
            }
        },
        testing:function(){
            console.log(data);
        }
    };
})();

var UIController = (function(){
//UI code
        var string ={
            income:".income__list",
            expence:".expenses__list"
        }
    function formatNumber(num,type){
        num =Math.abs(num);
        num=num.toFixed(2);
        var numSplit = num.split('.');
        int = numSplit[0];
        if(int.length>3){
            int = int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);

        }
        dec= numSplit[1];
        if(type === 'exp'){
            sign ="-";
        }else{
            sign = "+";
        }
        return sign + int+"."+dec;

    };
    var nodelList = function(list,callback){
        for(var i =0;i<list.length;i++){
            callback(list[i],i);
        }
    };
return{
    
      getInput:function(){
          return{
        type :document.querySelector('.add__type').value,
        dis:document.querySelector('.add__description').value,
        value: document.querySelector('.add__value').value,
          };
},
    addIltemlist:function(obj,type){
        var change_value,display,HTML;
        //create HTML

        if(type==='inc'){
            display = string.income;
         HTML ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%dis%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
         }else if(type ==='exp'){
            display = string.expence;
             HTML ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%dis%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%pi%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'};
             HTML = HTML.replace("%pi%",obj.pi);
             //
        change_value=HTML.replace('%id%',obj.id);
        change_value=change_value.replace('%dis%',obj.description);
        change_value=change_value.replace('%value%',formatNumber(obj.value,type));

        document.querySelector(display).insertAdjacentHTML('beforeend',change_value);
    },
    clearInputFleids :function (){

        var fields = document.querySelectorAll('.add__description'+','+'.add__value');
        var fields_Arr = Array.prototype.slice.call(fields);
        fields_Arr.forEach(function(present,index,Array) {
            present.value='';
            
        });
        fields_Arr[0].focus();

    },
    displaypercentage:function(percentage){
       var fe = document.querySelectorAll(".item__percentage");
      
       nodelList(fe,function(current,index){

        current.textContent=percentage[index]+"%";
       });
    },
    addMonth:function(){
        var mn = new Date();
        var mon = mn.getMonth();
        var year = mn.getFullYear();
        document.querySelector('.budget__title--month').textContent= mon+" month in "+year;
    },
    addbudgetTOui : function(obj){
        if(obj.budget>0){
            document.querySelector(".budget__value").textContent= formatNumber(obj.budget,"inc");
       
        }else{
            document.querySelector(".budget__value").textContent= formatNumber( obj.budget,"exp");
       
        }
         document.querySelector(".budget__income--value").textContent=formatNumber(obj.totalInc,"inc");
        document.querySelector(".budget__expenses--value").textContent= formatNumber(obj.totalEXP,"exp");
       if(obj.percentage>0){
       
        document.querySelector(".budget__expenses--percentage").textContent= obj.percentage+'%';
       }
       else{
        document.querySelector(".budget__expenses--percentage").textContent= "------";
       }

    },
    changecolor:function(){
        var fields = document.querySelectorAll(
            ".add__type"+","+".add__description"+","+".add__value"
        );

        nodelList(fields,function(cur){
            cur.classList.toggle("red-focus");
        });
        document.querySelector(".add__btn").classList.toggle("red");
    },
    removeelment:function(objid){
       var el =  document.getElementById(objid);
       el.parentNode.removeChild(el);

    }
    };

})();

var Controller = (function(budcntrl,UIcntrl){
    var updateBudeget = function(){
        //return of budget
        budcntrl.BudgetCalculate();
        var budget = budcntrl.getbudget();
        //display on UI
       UIcntrl.addbudgetTOui(budget);
    };
    function updatepercentages(){
       var per = budcntrl.calupercentage();
       UIcntrl.displaypercentage(per);  
    }
    function addItem(){
        console.log("it works");
        //collect input to UI
        var input = UIcntrl.getInput();
        //collect data shared to budcntrl
       var newItem= budcntrl.addItem(input.type,input.dis,input.value);
        UIcntrl.addIltemlist(newItem,input.type);
        //claer the input felids
        UIcntrl.clearInputFleids();
        updateBudeget();
        updatepercentages();
    }
    var crlDeleteItem = function(event){
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            sp = itemID.split('-');
            type =sp[0];
            id =parseInt( sp[1]);
            budcntrl.deleteItem(type,id);
            UIcntrl.removeelment(itemID);
            updateBudeget();
            updatepercentages()

        }


    };
    document.addEventListener("keypress",function(){
        if( event.keyCode === 13 && event.which === 13){
            addItem();
        }
    });
    document.querySelector(".add__btn").addEventListener('click',addItem);
    document.querySelector(".container").addEventListener("click",crlDeleteItem)
    document.querySelector(".add__type").addEventListener("change",UIcntrl.changecolor);

})(budgetController,UIController);
UIController.addbudgetTOui( {budget:0,
    percentage:-1,
    totalInc:0,
    totalEXP:0});
UIController.addMonth();
document.querySelector(".add__type").value= "inc";

