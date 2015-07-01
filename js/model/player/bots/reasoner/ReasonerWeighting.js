
function getShotWeightedValue(counters, leavesCount){
    var weights = characters['bloody'];

    var shotValue = 0;
    for(var i in counters)
        shotValue += counters[i] * weights[i];

    return shotValue;
};

// Character-Sets for weightened ShotApproach(getShotValueApproach2)
var characters = {
    'bloody': [5/7, 4/7, 6/7, 7/7, 2/7, 1/7, 3/7],
    'sadist': [5/7, 4/7, 7/7, 6/7, 2/7, 1/7, 3/7],
    'masochist': [4/7, 3/7, 2/7, 1/7, 6/7, 7/7, 5/7]
};

// - - - - - - - - - - - - - - - - - - - - - - - - - -

function getPruningValue(counters, leavesCount){
    var sum = 0;
    var nonZeros = 0;

    for(var i in counters)
    if(counters[i] != 0){
        sum += leavesCount - counters[i];
        nonZeros ++;
    }

    return sum / nonZeros; // pruningAverage
};

// - - - - - - - - - - - - - - - - - - - - - - - - - -

/*
function getPruningShotHybridValue(counters, leavesCount){
    var sum = 0;
    var nonZeros = 0;
    var maxPruning = -1;

    for(var i in counters)
        if(counters[i] != 0){
            var pruningVal = leavesCount - counters[i];

            if(i == 3 && pruningVal == 0)
                pruningVal = leavesCount;

            if(i == 2 && pruningVal == 0)
                pruningVal = leavesCount * 0.8;

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

    var str = 'FIRED: ' + counters[0] + (counters[0] == 0 ? '' : ' -> ' + (leavesCount- counters[0])) + '\n';
    str += 'WAVE: ' + counters[1] + (counters[1] == 0 ? '' : ' -> ' + (leavesCount - counters[1])) + '\n';
    str += 'HIT: ' + counters[2] + (counters[2] == 0 ? '' : ' -> ' + (leavesCount- counters[2])) + '\n';
    str += 'DESTROYED: ' + counters[3] + (counters[3] == 0 ? '' : ' -> ' + (leavesCount - counters[3])) + '\n';
    str += 'RADIATION: ' + counters[4] + (counters[4] == 0 ? '' : ' -> ' + (leavesCount - counters[4])) + '\n';
    str += 'MINE: ' + counters[5] + (counters[5] == 0 ? '' : ' -> ' + (leavesCount- counters[5])) + '\n';
    str += 'WAVE_RADIATION: ' + counters[6] + (counters[6] == 0 ? '' : ' -> ' + (leavesCount - counters[6])) + '\n';
    str += '>> pruningValue: ' + pruningValue + ' (pruningAverage: ' + pruningAverage + ', maxPruningBonus: ' + maxPruningBonus + ', hitBonus: ' + hitBonus + ', destroyedBonus: ' + destroyedBonus + ', minePunishment: ' + minePunishment + ')';
    //console.log(str);

    return pruningValue;
};*/
