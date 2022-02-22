// Custom changes. 
$(document).ready(function () {
    initLGList();

    //Add new LG
    $('#addLGToList').click(() => { addLGToList() });
    $('#removeLGfromList').click(() => { removeLGfromList() });
    $('#LGList').change(() => { saveLGList() });
    $('#externaltable').change(() => {
        $('.usedForCalculation').data('Externals', [$('#external1').val(), $('#external2').val(), $('#external3').val(), $('#external4').val(), $('#external5').val()]);
        saveLGList()
    });

    $('#p1factor, #p2factor, #p3factor, #p4factor, #p5factor').change(() => {
        $('.usedForCalculation').data('Factors', [$('#p1factor').val(), $('#p2factor').val(), $('#p3factor').val(), $('#p4factor').val(), $('#p5factor').val()]);
        saveLGList()
    });
});

//Cookie
function initLGList() {
    $('#LGList').empty();
    var LGList = readCookie();

    if (LGList !== null) {
        for (let i of LGList) {
            let tempListItem = $('.LGListItem.dummyItem').clone();
            tempListItem.removeClass('dummyItem');

            tempListItem.find('.LGListItemName option:contains("' + i.LG + '")').prop('selected', true);
            tempListItem.find('.LGListItemLevel').val(i.Level);
            tempListItem.data('Externals', i.External);
            tempListItem.data('Factors', i.Factor);
            if (i.Active) {
                tempListItem.addClass('usedForCalculation');
            }

            tempListItem.appendTo('#LGList');
        }
        recalc();

        //Increase level - Event listener
        $('.LGListItemPlus').click(function () {
            let itemLevel = $(this).prev().val();
            itemLevel++
            $(this).prev().val(itemLevel);
            $('#external1, #external2, #external3, #external4, #external5').val('0');
            $('.usedForCalculation').data('Externals', [0, 0, 0, 0, 0]);
            saveLGList();
        });

        //Decrease level - Event listener
        $('.LGListItemMinus').click(function () {
            let itemLevel = $(this).prev().prev().val();
            itemLevel--;
            $(this).prev().prev().val(itemLevel);
            $('#external1, #external2, #external3, #external4, #external5').val('0');
            $('.usedForCalculation').data('Externals', [0, 0, 0, 0, 0]);
            saveLGList();
        });

        //Activate LG - Event listener
        $('.LGListItemActive').click(function () {
            $('.usedForCalculation').removeClass('usedForCalculation');

            let listItem = $(this).parent();
            listItem.addClass('usedForCalculation');

            // Set the external players based on the saved values for the LG
            $('#external1').val(listItem.data('Externals')[0]);
            $('#external2').val(listItem.data('Externals')[1]);
            $('#external3').val(listItem.data('Externals')[2]);
            $('#external4').val(listItem.data('Externals')[3]);
            $('#external5').val(listItem.data('Externals')[4]);

            // Set calculation factors based on the saved values for the LG
            $('#p1factor').val(listItem.data('Factors')[0]);
            $('#p2factor').val(listItem.data('Factors')[1]);
            $('#p3factor').val(listItem.data('Factors')[2]);
            $('#p4factor').val(listItem.data('Factors')[3]);
            $('#p5factor').val(listItem.data('Factors')[4]);

            saveLGList();
            recalc();
        });

    } else {
        //Create an LG list
        addLGToList();
    }
}

// Save current state of the LG list to a cookie
function saveLGList() {
    let tempLGList = [];
    $('#LGList div').each(function () {
        let LGName = $(this).find('.LGListItemName option:selected').prop('innerText');
        let LGLevel = $(this).find('.LGListItemLevel').val();
        let LGActive = $(this).hasClass('usedForCalculation');
        let LGExternal = $(this).data('Externals')
        let LGFactors = $(this).data('Factors');;

        tempLGList.push({ LG: LGName, Level: LGLevel, Active: LGActive, External: LGExternal, Factor: LGFactors });
    })
    writeCookie(tempLGList);
    recalc();
}


//Add / remove new line
function addLGToList() {
    var LGList = readCookie();
    if (LGList !== null) {
        LGList.push({ LG: "Arche", Level: 1, Active: false, External: [0, 0, 0, 0, 0], Factor: [1.9, 1.9, 1.9, 1.9, 1.9] });
    } else {
        LGList = [{ LG: "Arche", Level: 1, Active: true, External: [0, 0, 0, 0, 0], Factor: [1.9, 1.9, 1.9, 1.9, 1.9] }];
    }

    writeCookie(LGList);
    initLGList();
}

function removeLGfromList() {
    var LGList = readCookie();

    LGList.pop();

    writeCookie(LGList);
    initLGList();
}

//Save/Read/Delete Cookie
function writeCookie(value) {
    var name = "LGListStorage";
    var cookie = JSON.stringify(value);
    localStorage.setItem(name, cookie);
}

function readCookie() {
    var name = "LGListStorage";
    var value = localStorage.getItem(name);
    var result = JSON.parse(value);
    return result;

}

function deleteCookie() {
    var name = "LGListStorage";
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/;'].join('');
}

// Set to 1,94, 1,93 or 1,9
document.getElementById("setFactors9").addEventListener("click", function () {
    document.getElementById("p1factor").value = 1.9;
    document.getElementById("p2factor").value = 1.9;
    document.getElementById("p3factor").value = 1.9;
    document.getElementById("p4factor").value = 1.9;
    document.getElementById("p5factor").value = 1.9;
    recalc();
});

document.getElementById("setFactors93").addEventListener("click", function () {
    document.getElementById("p1factor").value = 1.93;
    document.getElementById("p2factor").value = 1.93;
    document.getElementById("p3factor").value = 1.93;
    document.getElementById("p4factor").value = 1.93;
    document.getElementById("p5factor").value = 1.93;
    recalc();
});

document.getElementById("setFactors94").addEventListener("click", function () {
    document.getElementById("p1factor").value = 1.94;
    document.getElementById("p2factor").value = 1.94;
    document.getElementById("p3factor").value = 1.94;
    document.getElementById("p4factor").value = 1.94;
    document.getElementById("p5factor").value = 1.94;
    recalc();
});



// Sync code. To refresh page if the browser was idle for a definied time.
// https://stackoverflow.com/questions/13798516/javascript-event-for-mobile-browser-re-launch-or-device-wake

var lastSync = 0;
var syncInterval = 300000; //sync every 30 minutes

function syncPage() {
    lastSync = new Date().getTime(); //set last sync to be now
    init(); //do your stuff
}

setInterval(function () {
    var now = new Date().getTime();
    if ((now - lastSync) > syncInterval) {
        syncPage();
    }
}, 5000);

// Increase / Decrease value of LB factor in arcboosttable
$('*:is(#p1factor, #p2factor, #p3factor, #p4factor, #p5factor) ~ .increaseFactor').click(function() { 
    $(this).parent().find(':input').val((i, val) => { return parseFloat(val) + 0.01})
    saveLGList();
    recalc();
 });

 $('*:is(#p1factor, #p2factor, #p3factor, #p4factor, #p5factor) ~ .decreaseFactor').click(function() { 
    $(this).parent().find(':input').val((i, val) => { return parseFloat(val) - 0.01})
    saveLGList();
    recalc();
 });











// Ende Custom changes














/*
    FPArray: Benötig jeweils den P1 um die nachfolgenden zu berechnen.

    Werte von https://foe-assistant.com/
    (Dort die Archenförderung auf 0% setzem)
    Für Total FP erste 10 werte aus "Cost FP" Spalte
    Für P1 FP kann die Liste mit dem folgenen jQuery code von der Seite extrahiert werden
        var arrayvalues = ''
        $('.table.table-striped tbody tr').each(function(i){
            arrayvalues = arrayvalues.concat($(this).find('td:nth-child(3)').html().split('<div')[0].replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ''), ', ')
        })
    Das Resultat aus "arrayvalues" kann in ArrayP1 eingefügt werden (das letzte ", " entfernen).
    z.B. ArrayP1[19] = new Array(0, arrayvalues)

    Alt:
    Bei neuem ZA: Hexadecimale Liste von http://graldron.bplaced.net/index.html (in main.js -> ArrayFP)
    Umformen http://www.kjetil-hartveit.com/blog/10/hex-binary-decimal-octal-and-ascii-converter (statt "," nur " ") und Resulat parsen (" " zu ", ").
*/

// Orginal code

// Total FP
var ArrayFP = new Array(18);
ArrayFP[0] = new Array(0, 50, 70, 130, 200, 270, 330, 420, 490, 570, 650);	//KZ
ArrayFP[1] = new Array(0, 40, 60, 100, 150, 210, 270, 330, 380, 450, 510);	//BZ
ArrayFP[2] = new Array(0, 40, 60, 120, 170, 220, 290, 360, 420, 490, 550);	//EZ
ArrayFP[3] = new Array(0, 50, 60, 120, 190, 240, 320, 380, 460, 530, 600);	//FMA
ArrayFP[4] = new Array(0, 50, 70, 130, 200, 270, 330, 420, 490, 570, 650);	//HMA
ArrayFP[5] = new Array(0, 50, 80, 140, 210, 290, 360, 440, 530, 610, 700);	//SMA
ArrayFP[6] = new Array(0, 50, 90, 150, 220, 310, 380, 480, 560, 650, 740);	//KOL
ArrayFP[7] = new Array(0, 60, 90, 150, 240, 330, 410, 500, 600, 690, 790);	//INDA
ArrayFP[8] = new Array(0, 60, 90, 170, 260, 340, 440, 530, 630, 740, 830);	//JHW
ArrayFP[9] = new Array(0, 60, 100, 180, 270, 360, 460, 560, 670, 770, 880);	//MOD
ArrayFP[10] = new Array(0, 60, 100, 180, 270, 360, 460, 560, 670, 770, 880);	//POST
ArrayFP[11] = new Array(0, 60, 100, 180, 270, 360, 460, 560, 670, 770, 880);	//GEG
ArrayFP[12] = new Array(0, 70, 100, 190, 280, 380, 480, 590, 710, 810, 930);	//MOR
ArrayFP[13] = new Array(0, 70, 110, 200, 290, 400, 510, 620, 740, 860, 970);	//ZU
ArrayFP[14] = new Array(0, 80, 120, 230, 340, 450, 580, 710, 850, 980, 1110);	//AZ
ArrayFP[15] = new Array(0, 80, 130, 240, 350, 470, 610, 740, 880, 1020, 1160);	//OZ
ArrayFP[16] = new Array(0, 90, 130, 240, 370, 490, 630, 770, 910, 1060, 1210);	//VZ
ArrayFP[17] = new Array(0, 90, 140, 250, 380, 520, 650, 800, 940, 1110, 1250);	//Mars
ArrayFP[18] = new Array(0, 90, 150, 260, 390, 540, 670, 830, 990, 1140, 1300);	//Asteroidengürtel
ArrayFP[19] = new Array(0, 100, 140, 280, 400, 560, 700, 850, 1020, 1180, 1350);	//Venus
ArrayFP[20] = new Array(0, 50, 70, 130, 200, 270, 330, 420, 490, 570, 650);	//Galataturm

// P1 reward array use until find formula to calc p1
var ArrayP1 = new Array(17);
// no age
ArrayP1[0] = new Array(0, 5, 10, 15, 20, 30, 35, 45, 50, 60, 65, 75, 85, 95, 100, 110, 120, 130, 140, 150, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 300, 310, 320, 330, 340, 350, 365, 375, 385, 395, 405, 420, 430, 440, 450, 465, 475, 485, 500, 510, 520, 535, 545, 555, 570, 580, 590, 605, 615, 630, 640, 650, 665, 675, 690, 700, 715, 725, 735, 750, 760, 775, 785, 800, 810, 825, 835, 850, 860, 875, 890, 900, 915, 925, 940, 950, 965, 975, 990, 1005, 1015, 1030, 0);
//bz
ArrayP1[1] = new Array(0, 5, 10, 10, 15, 25, 30, 35, 40, 45, 55, 60, 65, 75, 80, 85, 95, 100, 110, 115, 125, 130, 140, 145, 155, 160, 170, 180, 185, 195, 200, 210, 220, 225, 235, 245, 250, 260, 270, 275, 285, 295, 300, 310, 320, 330, 340, 345, 355, 365, 375, 380, 390, 400, 410, 420, 430, 440, 445, 455, 465, 475, 485, 495, 505, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 905, 915, 925, 935, 945, 955, 965, 975, 985, 995, 0);
//ez
ArrayP1[2] = new Array(0, 5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 65, 70, 80, 85, 95, 105, 110, 120, 125, 135, 145, 150, 160, 170, 175, 185, 195, 200, 210, 220, 230, 240, 245, 255, 265, 275, 285, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 405, 415, 425, 435, 450, 455, 465, 475, 485, 495, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 645, 655, 665, 675, 685, 695, 705, 720, 730, 0);
//fma
ArrayP1[3] = new Array(0, 5, 10, 15, 20, 25, 35, 40, 50, 55, 65, 70, 80, 85, 95, 100, 110, 120, 130, 135, 145, 155, 165, 175, 180, 190, 200, 210, 220, 230, 240, 250, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 465, 475, 485, 495, 505, 515, 525, 540, 550, 560, 570, 585, 595, 605, 615, 625, 640, 650, 660, 675, 685, 695, 705, 720, 730, 740, 755, 765, 775, 790, 800, 810, 825, 835, 850, 860, 875, 885, 895, 910, 920, 930, 945, 955, 970, 980, 995, 1005, 1015, 1030, 1040, 1055, 1065, 1080, 1090, 1105, 1115, 1130, 1140, 1155, 1165, 1180, 1190, 1205, 1215, 1230, 1240, 1255, 0);
//hma
ArrayP1[4] = new Array(0, 5, 10, 15, 20, 30, 35, 45, 50, 60, 65, 75, 85, 95, 100, 110, 120, 130, 140, 150, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 300, 310, 320, 330, 340, 350, 365, 375, 385, 395, 405, 420, 430, 440, 450, 465, 475, 485, 500, 510, 520, 535, 545, 555, 570, 580, 590, 605, 615, 630, 640, 650, 665, 675, 690, 700, 715, 725, 735, 750, 760, 775, 785, 800, 810, 825, 835, 850, 860, 875, 890, 900, 915, 925, 940, 950, 965, 975, 990, 1005, 1015, 1030, 1040, 1055, 1070, 1080, 1095, 0);
//sma
ArrayP1[5] = new Array(0, 5, 10, 15, 25, 30, 40, 45, 55, 65, 70, 80, 90, 100, 110, 120, 125, 140, 150, 155, 170, 180, 190, 200, 210, 220, 230, 240, 250, 265, 275, 285, 295, 310, 320, 330, 340, 355, 365, 375, 390, 400, 410, 425, 435, 450, 460, 470, 485, 495, 510, 520, 535, 545, 560, 570, 585, 595, 610, 620, 635, 645, 660, 670, 685, 700, 710, 725, 735, 750, 765, 775, 790, 805, 815, 830, 845, 855, 870, 885, 895, 910, 925, 935, 950, 965, 980, 990, 1005, 1020, 1035, 1045, 1060, 1075, 1090, 1105, 1115, 1130, 1145, 1160, 1175, 1185, 1200, 1215, 1230, 1245, 1260, 1275, 1285, 0);
//kolo
ArrayP1[6] = new Array(0, 5, 10, 15, 25, 35, 40, 50, 60, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 170, 180, 190, 200, 210, 225, 235, 245, 260, 270, 280, 295, 305, 315, 330, 340, 350, 365, 375, 390, 400, 415, 425, 440, 450, 465, 480, 490, 505, 515, 530, 540, 555, 570, 580, 595, 610, 620, 635, 650, 665, 675, 690, 705, 715, 730, 745, 760, 775, 785, 800, 815, 830, 840, 855, 870, 885, 900, 915, 930, 940, 955, 970, 0);
//inda
ArrayP1[7] = new Array(0, 10, 10, 20, 25, 35, 45, 50, 60, 70, 80, 90, 100, 115, 120, 135, 145, 155, 165, 180, 190, 200, 215, 225, 235, 250, 260, 275, 285, 300, 310, 325, 335, 350, 360, 375, 390, 400, 415, 425, 440, 455, 465, 480, 495, 505, 520, 535, 550, 560, 575, 590, 605, 520, 635, 645, 660, 675, 690, 705, 720, 735, 745, 760, 775, 790, 805, 820, 835, 850, 865, 880, 895, 910, 925, 940, 955, 970, 985, 1000, 1015, 0);
//jhw
ArrayP1[8] = new Array(0, 10, 10, 20, 30, 35, 45, 55, 65, 75, 85, 95, 105, 120, 130, 140, 155, 165, 175, 190, 200, 215, 225, 240, 250, 265, 275, 290, 300, 315, 330, 340, 355, 370, 385, 395, 410, 425, 440, 450, 465, 480, 495, 510, 525, 535, 550, 565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790, 805, 820, 835, 855, 870, 885, 900, 915, 930, 945, 965, 980, 995, 1010, 1025, 1045, 1060, 1075, 1090, 1110, 1125, 1140, 1160, 1175, 1190, 1205, 1225, 1240, 1255, 1275, 1290, 1305, 1325, 1340, 1355, 1375, 1390, 1410, 1425, 1440, 1460, 1475, 1490, 1510, 1525, 1545, 1560, 1580, 1595, 1615, 1630, 1650, 1665, 1685, 1700, 1715, 1735, 1755, 1770, 1790, 1805, 1825, 1840, 1860, 1875, 1895, 1915, 1930, 1950, 1965, 1985, 2000, 2020, 2040, 2055, 2075, 2095, 0);
//moderne
ArrayP1[9] = new Array(0, 10, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 125, 135, 150, 160, 175, 185, 200, 210, 225, 240, 250, 265, 280, 290, 305, 320, 335, 345, 360, 375, 390, 405, 420, 430, 450, 460, 475, 490, 505, 520, 535, 550, 565, 580, 600, 615, 630, 645, 660, 675, 690, 705, 725, 740, 755, 770, 785, 800, 820, 835, 850, 870, 885, 900, 915, 935, 950, 965, 985, 1000, 1015, 1035, 1050, 1065, 1085, 1100, 1120, 1135, 1150, 1170, 1185, 1205, 1220, 1240, 1255, 1275, 1290, 1310, 1325, 1345, 1360, 1380, 1395, 1415, 1430, 1450, 1470, 1485, 1505, 1520, 1540, 1555, 1575, 1595, 1610, 1630, 1650, 1665, 1685, 1705, 1720, 1740, 1755, 1775, 1795, 1815, 1830, 1850, 0);
//post
ArrayP1[10] = new Array(0, 10, 10, 20, 30, 40, 50, 60, 75, 85, 95, 110, 120, 130, 145, 155, 170, 185, 195, 210, 225, 235, 250, 265, 280, 295, 305, 320, 335, 350, 365, 380, 395, 410, 425, 440, 455, 470, 485, 500, 515, 535, 550, 565, 580, 595, 615, 630, 645, 660, 675, 695, 710, 725, 745, 760, 775, 795, 810, 830, 845, 860, 880, 895, 915, 930, 945, 965, 985, 1000, 1020, 1035, 1050, 1070, 1090, 1105, 1125, 1140, 1160, 1175, 1195, 1215, 1230, 1250, 1265, 1285, 1305, 1320, 1340, 1360, 1375, 1395, 1415, 1435, 1450, 1470, 1490, 1510, 1525, 1545, 1565, 1585, 1600, 1620, 1640, 1660, 1680, 1695, 1715, 1735, 1755, 1775, 1790, 1810, 1830, 1850, 1870, 1890, 1910, 1930, 1950, 1965, 1985, 2005, 2025, 2045, 2065, 0);
//gegen
ArrayP1[11] = new Array(0, 10, 15, 20, 30, 40, 55, 65, 75, 85, 100, 115, 125, 140, 150, 165, 180, 190, 205, 220, 235, 250, 265, 280, 290, 305, 320, 335, 355, 365, 385, 400, 415, 430, 445, 460, 480, 495, 510, 525, 545, 560, 575, 590, 610, 625, 645, 660, 675, 695, 710, 730, 745, 765, 780, 800, 815, 835, 850, 870, 885, 905, 920, 940, 960, 975, 995, 1015, 1030, 1050, 1070, 1085, 1105, 1125, 1140, 1160, 1180, 1200, 1215, 1235, 1255, 1275, 1290, 1310, 1330, 1350, 1370, 1390, 1410, 1425, 1445, 1465, 1485, 1505, 1525, 1545, 1565, 1580, 1600, 1625, 1640, 1660, 1680, 0);
//morgen
ArrayP1[12] = new Array(0, 10, 15, 20, 35, 45, 55, 65, 80, 90, 105, 120, 130, 145, 160, 175, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320, 335, 355, 370, 385, 400, 420, 435, 450, 465, 485, 500, 515, 535, 550, 570, 585, 605, 620, 640, 655, 675, 690, 710, 730, 745, 765, 780, 800, 820, 835, 855, 875, 890, 910, 930, 945, 965, 985, 1005, 1025, 1040, 1060, 1080, 1100, 1120, 1140, 1155, 1175, 1195, 1215, 1235, 1255, 1275, 1295, 1315, 1335, 1355, 1375, 1395, 1415, 0);
//zu
ArrayP1[13] = new Array(0, 10, 15, 25, 35, 45, 60, 70, 85, 95, 110, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 290, 305, 320, 335, 355, 370, 385, 405, 420, 435, 455, 470, 490, 505, 525, 540, 560, 575, 595, 615, 630, 650, 670, 685, 705, 725, 740, 760, 780, 800, 815, 835, 855, 875, 895, 915, 930, 950, 970, 990, 1010, 1030, 1050, 1070, 1090, 1110, 1130, 1150, 1170, 1190, 1210, 1230, 1250, 1270, 1290, 1310, 1335, 1355, 1375, 1395, 1415, 1435, 1455, 1480, 1500, 1520, 1540, 1560, 1585, 1605, 1625, 1645, 1670, 1690, 1710, 1735, 1755, 1775, 1800, 1820, 1840, 1865, 1885, 1905, 1930, 1950, 1975, 1995, 2015, 2040, 2060, 2085, 2105, 2130, 2150, 2170, 2195, 2215, 2240, 2260, 2285, 2305, 2330, 2350, 2375, 2395, 2420, 2445, 2465, 2490, 2510, 2535, 2555, 2580, 2605, 2625, 2650, 2675, 2695, 2720, 2740, 2765, 2790, 0);
//az
ArrayP1[14] = new Array(0, 10, 15, 25, 35, 45, 60, 75, 85, 100, 115, 130, 145, 160, 170, 190, 205, 220, 235, 250, 265, 285, 300, 315, 335, 350, 370, 385, 400, 420, 440, 455, 475, 490, 510, 525, 545, 565, 585, 600, 620, 640, 660, 675, 695, 715, 735, 755, 775, 795, 815, 830, 850, 870, 895, 910, 930, 950, 970, 995, 1015, 1035, 1055, 1075, 1095, 1115, 1135, 1155, 1180, 1200, 1220, 1240, 1260, 1285, 1305, 1325, 1350, 1370, 1390, 1410, 1435, 1455, 1475, 1500, 1520, 1545, 1565, 1585, 1610, 1630, 1650, 1675, 1695, 1720, 1740, 1765, 1785, 1810, 1830, 1855, 1875, 1900, 1920, 1945, 1965, 1990, 2015, 2035, 2060, 2080, 2105, 2125, 2150, 2175, 2195, 2220, 2245, 2265, 2290, 2315, 2335, 2360, 2385, 2405, 2430, 2455, 2480, 2500, 2525, 2550, 2575, 2595, 2620, 0);
//oz
ArrayP1[15] = new Array(0, 10, 15, 25, 35, 50, 65, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 230, 245, 260, 280, 295, 310, 330, 350, 365, 385, 400, 420, 440, 455, 475, 495, 510, 530, 550, 570, 590, 605, 625, 645, 665, 685, 705, 725, 745, 765, 785, 805, 825, 845, 865, 890, 910, 930, 950, 970, 990, 1015, 1035, 1055, 1075, 1100, 1120, 1140, 1160, 1185, 1205, 1225, 1250, 1270, 1295, 1315, 1335, 1360, 1380, 1405, 1425, 1450, 1470, 1495, 1515, 1540, 1560, 1585, 1605, 1630, 1650, 1675, 1700, 1720, 1745, 1770, 1790, 1815, 1835, 1860, 1885, 1905, 1930, 1955, 1980, 2000, 2025, 0);
//VZ
ArrayP1[16] = new Array(0, 10, 15, 25, 40, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 205, 220, 235, 255, 270, 290, 305, 325, 345, 360, 380, 400, 415, 435, 455, 475, 495, 510, 530, 550, 570, 590, 610, 630, 650, 670, 690, 715, 735, 755, 775, 795, 815, 840, 860, 880, 900, 925, 945, 965, 990, 1010, 1030, 1055, 1075, 1095, 1120, 1140, 1165, 1185, 1210, 1230, 1255, 1275, 1300, 1320, 1345, 1365, 1390, 1415, 1435, 1460, 1485, 1505, 1530, 1555, 1575, 1600, 1625, 1645, 1670, 1695, 1720, 1745, 1765, 1790, 1815, 1840, 1860, 1885, 1910, 1935, 1960, 1985, 2010, 2030, 2055, 2080, 2105, 2130, 2155, 2180, 2205, 2230, 0);
//Mars
ArrayP1[17] = new Array(0, 10, 15, 25, 40, 55, 70, 80, 95, 115, 125, 145, 160, 175, 195, 210, 230, 245, 265, 280, 300, 320, 335, 355, 375, 395, 415, 435, 455, 470, 490, 510, 535, 550, 575, 595, 615, 635, 655, 675, 700, 720, 740, 760, 785, 805, 825, 850, 870, 890, 915, 935, 960, 980, 1005, 1025, 1050, 1070, 1095, 1115, 1140, 1160, 1185, 1210, 1230, 1255, 1280, 1300, 1325, 1350, 1370, 1395, 1420, 1445, 1470, 1490, 1515, 1540, 1565, 1590, 1615, 1635, 1660, 1685, 0);
//Asteroidengürtel
ArrayP1[18] = new Array(0, 10, 15, 30, 40, 55, 70, 85, 100, 115, 130, 150, 165, 185, 200, 220, 235, 255, 275, 295, 310, 330, 350, 370, 390, 410, 430, 450, 470, 490, 510, 530, 550, 575, 595, 615, 635, 660, 680, 700, 725, 745, 770, 790, 810, 835, 855, 880, 905, 925, 950, 970, 995, 1015, 1040, 1065, 1085, 1110, 1135, 1160, 1180, 1205, 1230, 1255, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1470, 1500, 1520, 1545, 1570, 1595, 1620, 1650, 1670, 1695, 1725, 1750, 1775, 1800, 1825, 1850, 1875, 1900, 0);
//Venus 
ArrayP1[19] = new Array(0, 10, 15, 30, 40, 60, 70, 90, 105, 120, 135, 155, 170, 190, 210, 225, 245, 265, 285, 305, 325, 340, 360, 380, 405, 425, 445, 465, 485, 505, 530, 550, 570, 595, 615, 635, 660, 680, 705, 725, 750, 770, 795, 820, 840, 865, 890, 910, 935, 960, 980, 1005, 1030, 1055, 1080, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575, 1600, 1630, 1655, 1680, 1705, 1730, 1760, 1785, 1810, 1835, 1865, 1890, 1915, 1945, 1970, 1995, 2025, 2050, 0);
//Galataturm
ArrayP1[20] = new Array(0, 5, 10, 15, 20, 25, 35, 40, 50, 55, 65, 70, 80, 85, 95, 100, 110, 120, 130, 135, 145, 155, 165, 175, 180, 190, 200, 210, 220, 230, 240, 250, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 465, 475, 485, 495, 505, 515, 525, 540, 550, 560, 570, 585, 595, 605, 615, 625, 640, 650, 660, 675, 685, 695, 705, 720, 730, 740, 755, 765, 775, 790, 800, 810, 825, 835, 850, 860, 875, 885, 895, 910, 920, 930, 945, 955, 970, 980, 995, 1005, 1015, 1030, 1040, 1055, 1065, 1080, 1090, 1105, 1115, 1130, 1140, 1155, 1165, 1180, 1190, 1205, 1215, 1230, 1240, 1255, 0);

//event listener lg table

//document.getElementById("gbselect").addEventListener("change", recalc);
//document.getElementById("gblevel").addEventListener("change", recalc);

document.getElementById("p1factor").addEventListener("change", recalc);
document.getElementById("p2factor").addEventListener("change", recalc);
document.getElementById("p3factor").addEventListener("change", recalc);
document.getElementById("p4factor").addEventListener("change", recalc);
document.getElementById("p5factor").addEventListener("change", recalc);

document.getElementById("external1").addEventListener("change", recalc);
document.getElementById("external2").addEventListener("change", recalc);
document.getElementById("external3").addEventListener("change", recalc);
document.getElementById("external4").addEventListener("change", recalc);
document.getElementById("external5").addEventListener("change", recalc);

//event listener outbid
document.getElementById("outbidgbtotal").addEventListener("change", calcoutbid);
document.getElementById("outbidbgfp").addEventListener("change", calcoutbid);
document.getElementById("outbidfp").addEventListener("change", calcoutbid);

//event listener calcsk
document.getElementById("ownarcfactor").addEventListener("change", calcsk);
document.getElementById("ownarcfactor2").addEventListener("change", calcsk);
document.getElementById("ownarcbasefp").addEventListener("change", calcsk);

//event listener copy
$('#copyUsername').keyup(function () {
    localStorage.setItem("LGCopyUsername", $(this).val());
    recalc();
})
$('#copyP1, #copyP2, #copyP3, #copyP4, #copyP5').click(function () {
    $(this).toggleClass('active');
    recalc();
})
$('#setcopyP345').click(function () {
    $('#copyP1, #copyP2').removeClass('active');
    $('#copyP3, #copyP4, #copyP5').addClass('active');
    recalc();
})
$('#setcopyP12').click(function () {
    $('#copyP1, #copyP2').addClass('active');
    $('#copyP3, #copyP4, #copyP5').removeClass('active');
    recalc();
})
$('#copyButton').click(function () {
    copyToClipboard('#copyOutput');
})

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).val()).select();
    document.execCommand("copy");
    $temp.remove();
}

var hasStorage = false;
//var storedfactor = 0;
//var gbfactor = 0.0;
// first run init
function init() {

    // test if local storage is available
    hasStorage = (function () {
        try {
            localStorage.setItem("locstore", "true");
            localStorage.removeItem("locstore");
            return true;
        }
        catch (exception) {
            return false;
        }
    }());

    // set externals to 0
    $('#external1 #external2 #external3 #external4 #external5').val("0");

    // if local storage is available load data if found
    if (hasStorage) {

        if (localStorage.getItem("storedgb") !== null) {
            //document.getElementById("gbselect").selectedIndex = parseInt(localStorage.storedgb);
        }
        if (localStorage.getItem("storedpfactor0") !== null) {
            //document.getElementById("p1factor").value = parseFloat(localStorage.storedpfactor0);
        }
        if (localStorage.getItem("storedpfactor1") !== null) {
            //document.getElementById("p2factor").value = parseFloat(localStorage.storedpfactor1);
        }
        if (localStorage.getItem("storedpfactor2") !== null) {
            //document.getElementById("p3factor").value = parseFloat(localStorage.storedpfactor2);
        }
        if (localStorage.getItem("storedpfactor3") !== null) {
            //document.getElementById("p4factor").value = parseFloat(localStorage.storedpfactor3);
        }
        if (localStorage.getItem("storedpfactor4") !== null) {
            //document.getElementById("p5factor").value = parseFloat(localStorage.storedpfactor4);
        }
        if (localStorage.getItem("storedlevel") !== null) {
            //document.getElementById("gblevel").value = parseInt(localStorage.storedlevel);
        }
        if (localStorage.getItem("storedownarcfactor") !== null) {
            document.getElementById("ownarcfactor").value = parseFloat(localStorage.storedownarcfactor);
        }
        if (localStorage.getItem("storedownarcfactor2") !== null) {
            document.getElementById("ownarcfactor2").value = parseFloat(localStorage.storedownarcfactor2);
        }
        if (localStorage.getItem("storedmembers") !== null) {
            document.getElementById("members").value = parseFloat(localStorage.storedmembers);
        }
        if (localStorage.getItem("storedownscore") !== null) {
            document.getElementById("ownscore").value = parseFloat(localStorage.storedownscore);
        }
        if (localStorage.getItem("storedforeignscore") !== null) {
            document.getElementById("foreignscore").value = parseFloat(localStorage.storedforeignscore);
        }
        if (localStorage.getItem("storedmembers1") !== null) {
            document.getElementById("members1").value = parseFloat(localStorage.storedmembers1);
        }
        /*if (localStorage.getItem("limitbase") !== null) {
            document.getElementById("limitbase").value = localStorage.limitbase;
        }
        if (localStorage.getItem("limitarc") !== null) {
            document.getElementById("limitarc").value = localStorage.limitarc;
        }*/
    }

    //Put username to copyUser
    $('#copyUsername').val(localStorage.getItem("LGCopyUsername"));

    //limitCalc();

    recalc();
}



function recalc() {
    var gbLevelField = $('.usedForCalculation .LGListItemLevel');
    var gbSelectField = $('.usedForCalculation .LGListItemName');

    var tempfac;
    for (var i = 0; i < 5; i++) {
        tempfac = parseFloat(document.getElementById("p" + (i + 1) + "factor").value);
        if (tempfac < 1.79) {
            tempfac = tempfac.toFixed(2);
            document.getElementById("p" + (i + 1) + "factor").value = tempfac;
            document.getElementById("p" + (i + 1) + "factor").step = 0.01;
        }
        else {
            document.getElementById("p" + (i + 1) + "factor").step = 0.005;
        }
    }



    // factors p1-p5	
    var pfactor = new Array()
    pfactor.push(parseFloat(document.getElementById("p1factor").value));
    pfactor.push(parseFloat(document.getElementById("p2factor").value));
    pfactor.push(parseFloat(document.getElementById("p3factor").value));
    pfactor.push(parseFloat(document.getElementById("p4factor").value));
    pfactor.push(parseFloat(document.getElementById("p5factor").value));



    // level of gb
    var GBlvlselect = gbLevelField.val();
    // if level set < 1 force lvl to 1
    if (GBlvlselect < 1) {
        GBlvlselect = 1;
        gbLevelField.val(1);
    }

    // total fp of gb at lvl
    var GBFP = 0;
    var GBage = gbSelectField.val();

    if (GBage == undefined) { GBage = 0 };





    // base reward table
    var pbonus = new Array();
    //check if selected level is valid for available p1 reward array, if not set to max possible level			
    if (GBlvlselect < ArrayP1[GBage].length) {
        pbonus.push(parseInt(ArrayP1[GBage][GBlvlselect]));
    }
    else {
        pbonus.push(parseInt(ArrayP1[GBage][ArrayP1[GBage].length - 1]));
        GBlvlselect = ArrayP1[GBage].length - 1;
        gbLevelField.val(GBlvlselect);
    }

    // if lvl <11 take fp from array, >11 calc it
    if (GBlvlselect < 11) {
        GBFP = ArrayFP[GBage][GBlvlselect];
    }
    else {

        GBFP = Math.ceil(ArrayFP[GBage][10] * Math.pow(1.025, GBlvlselect - 10));

    }
    //display total fp
    document.getElementById("totalfpdisplay").innerHTML = GBFP;

    // remaining base rewards	
    pbonus.push(5 * Math.round((pbonus[0] / 2) / 5));
    pbonus.push(5 * Math.round((pbonus[1] / 3) / 5));
    pbonus.push(5 * Math.round((pbonus[2] / 4) / 5));
    pbonus.push(5 * Math.round((pbonus[3] / 5) / 5));

    document.getElementById("p1bonus").innerHTML = pbonus[0];
    document.getElementById("p2bonus").innerHTML = pbonus[1];
    document.getElementById("p3bonus").innerHTML = pbonus[2];
    document.getElementById("p4bonus").innerHTML = pbonus[3];
    document.getElementById("p5bonus").innerHTML = pbonus[4];

    // cost with factor table
    var pcost = new Array();
    for (var i = 0; i < pfactor.length; i++) {
        pcost.push(parseInt(Math.round(pbonus[i] * pfactor[i])));
    }

    document.getElementById("p1cost").innerHTML = pcost[0];
    document.getElementById("p2cost").innerHTML = pcost[1];
    document.getElementById("p3cost").innerHTML = pcost[2];
    document.getElementById("p4cost").innerHTML = pcost[3];
    document.getElementById("p5cost").innerHTML = pcost[4];


    // external fp	
    var external1 = parseInt(document.getElementById("external1").value);
    var external2 = parseInt(document.getElementById("external2").value);
    var external3 = parseInt(document.getElementById("external3").value);
    var external4 = parseInt(document.getElementById("external4").value);
    var external5 = parseInt(document.getElementById("external5").value);

    // used to take elements from
    var externals = new Array(external1, external2, external3, external4, external5);
    externals.sort(function (a, b) { return b - a });

    // used for calcing save (highest external that counts)
    var externals2 = new Array(external1, external2, external3, external4, external5);
    externals2.sort(function (a, b) { return b - a });

    //sum all externals
    var sumexternals = 0;
    for (var i = 0; i < externals2.length; i++) {
        sumexternals += externals2[i];
    }

    // choose who takes which spot
    var ptaker = new Array(0, 0, 0, 0, 0);
    for (var i = 0; i < ptaker.length; i++) {
        for (var j = 0; j < externals.length; j++) {
            if (externals[j] >= pcost[i]) {
                ptaker[i] = externals[j];
                externals.splice(j, 1);
                break;
            }
        }
    }

    var pfinal = new Array(0, 0, 0, 0, 0);
    //eval all spots
    for (var i = 0; i < ptaker.length; i++) {
        // external takes spot
        if (ptaker[i] > 0) {
            document.getElementById(("p" + (i + 1) + "ext")).innerHTML = ptaker[i];
            pfinal[i] = ptaker[i];
        }
        // internal takes spot
        else {
            document.getElementById(("p" + (i + 1) + "ext")).innerHTML = "-";
            pfinal[i] = pcost[i];
        }
    }


    //fp needed by owner
    var selfinvest = new Array(0, 0, 0, 0, 0);
    // relative selfinvest
    var relativeinvest = new Array(0, 0, 0, 0, 0);
    //
    var prest = new Array();
    for (var i = 0; i < 5; i++) {
        // finds highest to beat			
        for (var j = 0; j < externals2.length; j++) {
            // calc selfinvest
            if (pcost[i] > externals2[j] || externals2[j] === 0) {
                selfinvest[i] = (GBFP + externals2[j] - pcost[i] * 2 - sumexternals);
                for (var k = 0; k < i; k++) {
                    if (ptaker[k] < 1)
                        selfinvest[i] -= pfinal[k];
                }

                break;
            }
        }





    }

    //calc&display save
    var tempselfmax = 0;
    for (var i = 0; i < 5; i++) {
        if (ptaker[i] < 1) {
            if (selfinvest[i] > tempselfmax) {
                relativeinvest[i] = selfinvest[i] - tempselfmax;
                tempselfmax = selfinvest[i];
                document.getElementById(("p" + (i + 1) + "save")).innerHTML = "+" + relativeinvest[i];
                if (pcost[i] === 0) {
                    document.getElementById(("p" + (i + 1) + "self")).innerHTML = "!" + selfinvest[i] + "!";
                }
                else {
                    document.getElementById(("p" + (i + 1) + "self")).innerHTML = selfinvest[i];
                }
            }
            else {
                relativeinvest[i] = selfinvest[i] - tempselfmax;
                document.getElementById(("p" + (i + 1) + "save")).innerHTML = "Sicher";
                document.getElementById(("p" + (i + 1) + "self")).innerHTML = relativeinvest[i];
            }
        }
        else {
            document.getElementById(("p" + (i + 1) + "save")).innerHTML = "-";
            document.getElementById(("p" + (i + 1) + "self")).innerHTML = "-";
        }
    }

    // save data if local storage is available	
    if (hasStorage) {
        //localStorage.setItem("storedgb", document.getElementById("gbselect").selectedIndex);		
        //localStorage.setItem("storedlevel", GBlvlselect);	
        for (var i = 0; i < pfactor.length; i++) {
            localStorage.setItem(("storedpfactor" + i), pfactor[i]);
        }

    }

    // Put data to copy input field
    var copyUsername = $('#copyUsername').val()
    var copyCurrentLG = $('.usedForCalculation .LGListItemName option:selected').text().trim();
    var copyOutputText = copyUsername + ' ' + copyCurrentLG;
    for (var i = 5; i >= 0; i--) {
        let platz = i + 1;
        if ($('#copyP' + platz).hasClass('active')) {
            copyOutputText += ' P' + platz + ' (' + pfinal[i] + ')';
        }
    }
    $('#copyOutput').val(copyOutputText);

}









document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("calc"),
        out = document.querySelector("#calc output"),
        overwrite = true;

    function result(noDisplay) {
        var input = out.value,
            r = 0;
        // replace Ãƒâ€” with * and ÃƒÂ· with / for eval()
        input = input.replace(/Ãƒâ€”/g, "*")
            .replace(/ÃƒÂ·/g, "/");
        // remove anything else that is not allowed here
        input = input.replace(/[^0-9. +\-*\/]/g, "");
        try {
            r = eval(input);
        } catch (e) {
            r = 0;
        }
        if (noDisplay !== true) {
            out.value = r;
            overwrite = true;
        }
        return r;
    }

    function extra(type) {
        switch (type) {
            case "Ã¢Ë†Å¡":
                out.value = Math.sqrt(result(true));
                break;
            case "xÃ‚Â²":
                out.value = Math.pow(result(true), 2);
                break;
            case "ln":
                out.value = Math.log(result(true));
                break;
        }
        overwrite = true;
    }
    // initialize only if <output> is found and browser supports Array.from()
    if (out && typeof Array.from == "function") {
        form.addEventListener("submit", function (ev) {
            // prevent form submission and page reload
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });
        // button functionalities
        Array.from(document.querySelectorAll("#calc button"))
            .forEach(function (b) {
                var c = b.textContent;
                switch (c) {
                    case "9":
                    case "8":
                    case "7":
                    case "6":
                    case "5":
                    case "4":
                    case "3":
                    case "2":
                    case "1":
                    case "0":
                    case ".":
                        b.addEventListener("click", function () {
                            // remove leading zero?
                            if (overwrite) {
                                out.value = (c == "." ? "0." : c);
                            } else {
                                out.value += c;
                            }
                            overwrite = false;
                        });
                        break;
                    case "+":
                    case "-":
                    case "Ãƒâ€”":
                    case "ÃƒÂ·":
                        b.addEventListener("click", function () {
                            out.value += " " + c + " ";
                            overwrite = false;
                        });
                        break;
                    case "Ã¢Ë†Å¡":
                    case "xÃ‚Â²":
                    case "ln":
                        b.addEventListener("click", function () {
                            extra(c);
                        });
                        break;
                    case "=":
                        b.addEventListener("click", result);
                        break;
                    case "C":
                        b.addEventListener("click", function () {
                            out.value = 0;
                            overwrite = true;
                        });
                        break;
                }
            });
    }
});






function calcGE() {
    var members = parseInt(document.getElementById("members").value);
    var ownscore = parseFloat(document.getElementById("ownscore").value);
    var foreignscore = parseFloat(document.getElementById("foreignscore").value);
    {
        var station = Math.round(((members * 48 / 100) * (ownscore - foreignscore)) * 100) / 100;
        document.getElementById("stationneed").innerHTML = station;
    }
    if (hasStorage) {
        localStorage.setItem("storedmembers", members);
        localStorage.setItem("storedownscore", ownscore);
        localStorage.setItem("storedforeignscore", foreignscore);
    }
}

function calcGEprozent() {
    var members1 = parseInt(document.getElementById("members1").value);
    var openstation = parseFloat(document.getElementById("openstation").value);
    {
        var openstationpercent = Math.round((openstation / (members1 * 48 / 100)) * 1000) / 1000;
        document.getElementById("openstationepercentout").innerHTML = openstationpercent;
    }
    if (hasStorage) {
        localStorage.setItem("storedmembers1", members1);
        localStorage.setItem("storedopenstation", openstation);
    }
}

function calcoutbid() {
    var outbidgbtotal = parseInt(document.getElementById("outbidgbtotal").value);
    var outbidbgfp = parseInt(document.getElementById("outbidbgfp").value);
    var outbidfp = parseInt(document.getElementById("outbidfp").value);

    // no sense input: fp invested cant be higher than total fp gb can take
    if (outbidgbtotal < outbidbgfp) {
        document.getElementById("outbidneedfp").innerHTML = "Eingabefehler: Gesamt-FP < FP in LG";
    }
    // no sense input fp to outbid cant be higher than total fp invested
    else if (outbidbgfp < outbidfp) {
        document.getElementById("outbidneedfp").innerHTML = "Eingabefehler: FP in LG < Zu überbieten";
    }
    // not enough fp left to outbid
    else if (outbidgbtotal - outbidbgfp <= outbidfp) {
        document.getElementById("outbidneedfp").innerHTML = "nicht möglich";
    }
    else {
        var neededfp = Math.ceil((outbidgbtotal - outbidbgfp + outbidfp) / 2);
        document.getElementById("outbidneedfp").innerHTML = neededfp;
    }

}


function calcsk() {
    // check if factor stepping needs to change		
    var tempfac = parseFloat(document.getElementById("ownarcfactor").value);
    if (tempfac < 1.79) {
        tempfac = tempfac.toFixed(2);
        document.getElementById("ownarcfactor").value = tempfac;
        document.getElementById("ownarcfactor").step = 0.01;
    }
    else {
        document.getElementById("ownarcfactor").step = 0.005;
    }

    var ownarcfactor = parseFloat(document.getElementById("ownarcfactor").value);
    var ownarcfactor2 = parseFloat(document.getElementById("ownarcfactor2").value);
    var ownarcbasefp = parseInt(document.getElementById("ownarcbasefp").value);
    document.getElementById("ownarcneedfp").innerHTML = (Math.round(ownarcfactor * ownarcbasefp));
    document.getElementById("ownarcneedfp2").innerHTML = (Math.round(ownarcfactor2 * ownarcbasefp));
    document.getElementById("ownarcneedfpdiff").innerHTML = (Math.round(ownarcfactor2 * ownarcbasefp) - Math.round(ownarcfactor * ownarcbasefp));

    if (hasStorage) {

        localStorage.setItem("storedownarcfactor", ownarcfactor);
        localStorage.setItem("storedownarcfactor2", ownarcfactor2);
    }
}

window.onload = init;
