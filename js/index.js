const essayArea = document.getElementById("essayArea");
const dupeButton = document.getElementById("detectButton");
const duplicateEssayArea = document.getElementById("duplicateEssayArea");
const transparencyCheckBox = document.getElementById("transparentToggle");
const colorScalingDropDown = document.getElementById("colorScalingDropDown");
let isTransparencyOn = true;
let colorScaling = 16;

transparencyCheckBox.addEventListener("change", function() {
    searchDuplicates();
});

dupeButton.addEventListener("click", function(){
    searchDuplicates();
});

colorScalingDropDown.addEventListener("change", function() {
    searchDuplicates();
});

function searchDuplicates() {
    // sync up settings
    isTransparencyOn = transparencyCheckBox.checked;
    colorScaling = colorScalingDropDown.value;

    let result = essayArea.value; // string that starts off as normal essay but then becomes highlighted essay
    let firstWords = []; // 2d array. contains arrays of ["", #]
    // split up essay and remove excess white space
    splitResult = splitEssay(result);
    for (let i = 0; i < splitResult.length; i++) {
        splitResult[i] = splitResult[i].trim();
        splitResult[i] = splitResult[i].replace(/\n/g, "");
    }
    // tracks every new starting word and how many times it appears in essay
    for (let i = 0; i < splitResult.length; i++) {
        let duplicate = false;
        findDuplicate:
        for (let j = 0; j < firstWords.length; j++) {
            if (splitResult[i] == firstWords[j][0]) {
                if (firstWords[j][1] < 255) {
                    firstWords[j][1] += (colorScaling - 0);
                }
                duplicate = true;
                break findDuplicate;
            }
        }
        if (!duplicate) {
            let wordsInString = splitResult[i].split(" ");
            if (wordsInString != "") {
                firstWords.push([wordsInString[0].trim(), colorScaling - 1]);
            }
        }
    }
    // add highlight behind every first word in a sentence
    for (let i = 0; i < firstWords.length; i++) {
        if (firstWords[i][0] != "") {
            result = splitByFirstWord(result, firstWords[i][0], firstWords[i][1]);
        }
    }
    // display highlighted text
    duplicateEssayArea.innerHTML = result;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

function splitEssay(essay) {
    let splitResult = [];
    let essaySplit = essay.split(/\.|\?|\!|\n/);
    for (let i = 0; i < essaySplit.length; i++) {
        splitResult.push(essaySplit[i].trim().split(" ")[0]);
    }
    return splitResult;
}

function splitByFirstWord(essay, firstWord, level) {
    let color = pickHighlightColor(level);
    // checks if firstWord is the very first word of the essay
    if (essay.trim().startsWith(firstWord)) {
        essay = essay.replace(firstWord, "<mark style=\"background-color:"+color+"\">"+firstWord+"</mark>");
    }
    // replaces all times firstWord is the very first word of a sentence
    let reg = new RegExp("\\b(?<=\\.\\s+|\\?\\s+|\\!\\s+|\\n\\s+|\\n)"+escapeRegExp(firstWord)+"\\b", "g");
    essay = essay.replace(reg, "<mark style=\"background-color:"+color+"\">"+firstWord+"</mark>");
    return essay;
}

// add toggle for transparent 1st appearance
function pickHighlightColor(level) {
    // check if word only occurred once
   if(level == colorScaling - 1) {
    if (isTransparencyOn) {
        return "transparent";
    }
    return "#00F";
   }
   return "rgb("+level+","+(127-level/4)+",0)";
}