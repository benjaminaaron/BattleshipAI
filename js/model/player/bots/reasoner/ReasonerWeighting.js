
function getShotValueApproach1(pos, leaves, inputfield){

  var possibleFireResults = [];
  for(var i in leaves){
    var leaf = leaves[i];
    //console.log('' + leaf);
    var newPossibleFireResult = leaf.field.whatCouldBeHere(pos, inputfield);
    //console.log(CellArrToStr(newPossibleFireResults));
    possibleFireResults.push(newPossibleFireResult);
  }

  var counters = [0, 0, 0, 0, 0, 0, 0];

  for(var i in possibleFireResults){
    switch(possibleFireResults[i]){
      case Cell.FIRED:
        counters[0] ++;
        break;
      case Cell.WAVE:
        counters[1] ++;
        break;
      case Cell.HIT:
        counters[2] ++;
        break;
      case Cell.DESTROYED:
        counters[3] ++;
        break;
      case Cell.RADIATION:
        counters[4] ++;
        break;
      case Cell.MINE:
        counters[5] ++;
        break;
      case Cell.WAVE_RADIATION:
        counters[6] ++;
        break;
    }
  }

  var sum = 0;
  var nonZeros = 0;
  var maxPruning = -1;

  for(var i in counters)
    if(counters[i] != 0){
      var pruningVal = leaves.length - counters[i];

      if(i == 3 && pruningVal == 0)
        pruningVal = leaves.length;

      if(i == 2 && pruningVal == 0)
        pruningVal = leaves.length * 0.8;

      if(pruningVal > maxPruning)
        maxPruning = pruningVal;

      sum += pruningVal;
      nonZeros ++;
    }
  var pruningAverage = sum / nonZeros;


  var maxPruningFactor = pruningAverage / 10;
  var hitBonusFactor = pruningAverage / 10;
  var destroyedBonusFactor = pruningAverage / 5;
  var mineFactor = - pruningAverage / 1;

  var maxPruningBonus = maxPruning * maxPruningFactor;
  var hitBonus = counters[2] * hitBonusFactor;
  var destroyedBonus = counters[3] * destroyedBonusFactor;
  var minePunishment = counters[5] * mineFactor;

  var pruningValue = pruningAverage + maxPruningBonus + hitBonus + destroyedBonus + minePunishment;


  /* TODO outsource to new utils-func for debugging*/
  var str = 'fire pos ' + pos + ' at ' + leaves.length + ' leaves, possibleFireResults: ' + CellArrToStr(possibleFireResults) + '\n';
  str += 'FIRED: ' + counters[0] + (counters[0] == 0 ? '' : ' -> ' + (leaves.length - counters[0])) + '\n';
  str += 'WAVE: ' + counters[1] + (counters[1] == 0 ? '' : ' -> ' + (leaves.length - counters[1])) + '\n';
  str += 'HIT: ' + counters[2] + (counters[2] == 0 ? '' : ' -> ' + (leaves.length - counters[2])) + '\n';
  str += 'DESTROYED: ' + counters[3] + (counters[3] == 0 ? '' : ' -> ' + (leaves.length - counters[3])) + '\n';
  str += 'RADIATION: ' + counters[4] + (counters[4] == 0 ? '' : ' -> ' + (leaves.length - counters[4])) + '\n';
  str += 'MINE: ' + counters[5] + (counters[5] == 0 ? '' : ' -> ' + (leaves.length - counters[5])) + '\n';
  str += 'WAVE_RADIATION: ' + counters[6] + (counters[6] == 0 ? '' : ' -> ' + (leaves.length - counters[6])) + '\n';
  str += '>> pruningValue: ' + pruningValue + ' (pruningAverage: ' + pruningAverage + ', maxPruningBonus: ' + maxPruningBonus + ', hitBonus: ' + hitBonus + ', destroyedBonus: ' + destroyedBonus + ', minePunishment: ' + minePunishment + ')';
  //console.log(str);

  return pruningValue;
};

function getShotValueApproach2(){

};

function getPruningValue(){

};
