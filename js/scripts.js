const MAPA_DOM_ID = '#usMap';
const DOM_TRUMP_BAR = "#trumpBar";
const DOM_BIDEN_BAR = "#bidenBar";
const trumpStates = []; // array with the names of the states Trump has won
const bidenStates = [];  // array with the names of the states Biden has won
const TRUMP_COLOR = '#FE0302';
const BIDEN_COLOR = '#021ABC';

let trumpPercentage = 0;
let bidenPercentage = 0;
let trumpDelegates = 0;
let bidenDelegates = 0;

window.onload = function() {
    applyMapEvents();
    setupData();
    paintData();


};



$('#modalClose').on('click', function(){
  $('#mainModal').css('display', 'none');
})

function applyMapEvents(){
  $(MAPA_DOM_ID).on( "click", function(event) { 
    console.log('has clicado en ' + event.target.id)
    let stateId = event.target.id; //stateId = MT

    let stateData = usData.find(function(state){ //stateData is the whole object where the stId matches the clicked state
        return state.stId == stateId;
      }
    );

    fillModalData(stateData);
  });

};


function fillModalData(stateData){

  if(stateData){ // this "if" is here just in case the state has no info
    $("#stateName").text(stateData.stNa); // Add the name of the state in the modal and son on...
    $("#elN").text(stateData.del);
    $("#stPop").text(stateData.pop);
    $("#stWin").text(stateData.win16);
    $("#mainModal").css("display", "block"); //activates Bootstrap modal

      if(stateData.win16 == "Republicanos"){
      $('#stWin').append('<img src="img/RepLogoTr1.jpg">');
    }else if(stateData.win16 == "Demócratas"){
      $('#stWin').append('<img src="img/DemLogoTr1.jpg">');
    }
    
    if(stateData.win == "trump"){
      $('#trumpPic').html('<img src="img/trumpCol.jpg">');
      $('#bidenPic').html('<img src="img/bidenBN.jpg">');
      $('#noResults').css('display', 'none');
    }else if(stateData.win == "biden"){
      $('#trumpPic').html('<img src="img/trumpBN.jpg">');
      $('#bidenPic').html('<img src="img/bidenCol.jpg">');
      $('#noResults').css('display', 'none');
    }else if(!stateData.win){
      $('#trumpPic, #bidenPic').empty();
      $('#noResults').css('display', 'block');
    }
  }
} 

function setupStatePercentages(state){
    let valueDel = state.del;
    let perc = (valueDel / 538) * 100;
    let percM = +(perc.toFixed(2)); //El + inicial evita que toFixed convierta el dato en string

    state.percent = percM; // creates new property in object

}

function setupReportsData(state){
    if(state.win == "trump"){  
      trumpStates.push(state); // the whole object is adde to the array, not just the name of the state
      trumpDelegates += state.del;
      trumpPercentage += state.percent;
    }else if(state.win == "biden"){
      bidenStates.push(state);
      bidenDelegates += state.del;
      bidenPercentage += state.percent;
    }
}


function setupData(){
  for (var i=0; i < usData.length; i++){  
    setupStatePercentages(usData[i]);
    setupReportsData(usData[i]);
  }
}

function fillMapStates(){
   $.each(trumpStates, function(index, state){
      $('#' + state.stId).css('fill', TRUMP_COLOR);
   });

  $.each(bidenStates, function(index, state){
      $('#' + state.stId).css('fill', BIDEN_COLOR);
  });


}

function fillBar(){
  $(DOM_TRUMP_BAR).css('width', trumpPercentage + "%");
  $(DOM_BIDEN_BAR).css('width', bidenPercentage + "%");
}

function fillFinalReport(){
 $('#totalDelT').text(trumpDelegates);
 $('#totalDelB').text(bidenDelegates);

 $.each(trumpStates, function(index, state){
  $('#namesStT').append(" <li> <i class='fa fa-play'></i>" + state.stNa + "</li>");
  });

 $.each(bidenStates, function(index, state){
  $('#namesStB').append("<li> <i class='fa fa-play'></i>" + state.stNa + "</li>");
  });
}

function paintData(){

  fillMapStates();
  fillBar();
  fillFinalReport();

  console.log(`Estos son los estados que ha ganado Trump:`);
  console.log(trumpStates);
  console.log(`Estos son los estados que ha ganado Biden:`);
  console.log(bidenStates);
}