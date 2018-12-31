$(document).ready(function () {
    displayAccRow();
    disableAllQuantityButtons();
    console.log(getCurrentFileName());
    if (getCurrentFileName() == 'index.html') {
        setMap();
    }
    else {
        $("#date").Zebra_DatePicker({
            direction: [getCurrentDate(), false],
        });
    }



    $("#nbP").change(function () {
        displayAccRow();
        $("#chaises").html("");
        let nbPersons = $("#nbP").val();
        let newChair = "<img src='./images/chairCompressed.png' width=70 height=90>&nbsp;";

        for (i = 0; i < nbPersons; i++) {
            $("#chaises").append(newChair);
        }
    });


    $("#btAddAcc").click(function () {


        let totalPersons = $("input[name='acc']").length;
        let newAccNumber = $("#hiddenNumber").val();


        let newAccRow = '<div class="row rowsForm" id="rowNewAcc' + newAccNumber + '">' +
            '<div class="col-sm-3">' +
            '</div>' +
            '<div class="col-sm-3"> ' +
            '<input type="text" id="inputPlusAcc' + newAccNumber + '" class="form-control" name="acc" placeholder="Nom et prénom de l\'accompagnateur">' +
            '</div>' +
            '<div class="col-sm-1">' +
            '<button id="btRemoveAcc' + newAccNumber + '" class="btRemoveAcc" onclick="removeAcc(this.parentElement.parentElement.id)"><i class="fa fa-remove removeSign"></i></button>' +
            '</div>' +
            '</div>';



        var tablePersons = $("#nbP").val();

        if (totalPersons + 1 < tablePersons) {
            $(newAccRow).insertBefore($("#divFood"));
            let newNumber = parseInt($("#hiddenNumber").val()) + 1;
            $("#hiddenNumber").val(newNumber);

        }

    });


    var clicks = 0;
    $(".foodIcons").click(function () {

        let ancientId = getAncientId();
        let currentDivId = $(this).parent().attr('id');
        if (ancientId != currentDivId) {
            clicks = 0;
        }
        setAncientId(currentDivId);


        if (clicks == 0) {
            let newClass = $(this).parent().attr('class') + ' brightOnSelect';
            $(this).parent().attr('class', newClass);
            $(this).parent().attr('value', '1');
            enableQuantityButton($("#" + currentDivId).find('div').attr('id'))

            clicks++;
        }
        else {
            let cancelOrderclasse = 'col-xs-1 col-sm-1 col-md-1 col-lg-1 icon brightness cancelOrder';
            $(this).parent().attr('class', cancelOrderclasse);
            $(this).parent().attr('value', '0');

            disableQuantityButton($("#" + currentDivId).find('div').attr('id'));

            clicks = 0;
        }
    });


    $("#btPlusCous").click(function () {
        incrementQuantity('nbCous');
    });
    $("#btMinusCous").click(function () {
        DecrementQuantity('nbCous');
    });

    $("#btPlusRice").click(function () {
        incrementQuantity('nbRice');
    });
    $("#btMinusRice").click(function () {
        DecrementQuantity('nbRice');
    });

    $("#btPlusSoupe").click(function () {
        incrementQuantity('nbSoupe');
    });
    $("#btMinusSoupe").click(function () {
        DecrementQuantity('nbSoupe');
    });

    $("#btPlusSalade").click(function () {
        incrementQuantity('nbSalade');
    });
    $("#btMinusSalade").click(function () {
        DecrementQuantity('nbSalade');
    });

    $("#btPlusPizza").click(function () {
        incrementQuantity('nbPizza');
    });
    $("#btMinusPizza").click(function () {
        DecrementQuantity('nbPizza');
    });

    $("#btPlusHamb").click(function () {
        incrementQuantity('nbHamb');
    });
    $("#btMinusHamb").click(function () {
        DecrementQuantity('nbHamb');
    });

    $("#btPlusGat").click(function () {
        incrementQuantity('nbGat');
    });
    $("#btMinusGat").click(function () {
        DecrementQuantity('nbGat');
    });
    $("#btPlusFruit").click(function () {
        incrementQuantity('nbFruit');
    });
    $("#btMinusFruit").click(function () {
        DecrementQuantity('nbFruit');
    });

    $("#btPlusCan").click(function () {
        incrementQuantity('nbCan');
    });
    $("#btMinusCan").click(function () {
        DecrementQuantity('nbCan');
    });




    $("#btOrder").click(function () {

        initDivsError();

        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let civ = getFullCivility();
        let phone = $("#tel").val();
        let date = $("#date").val();
        let tableCapacity = $("#nbP").val();
        var meals = $("div[value='1']");

        let error = "";

        error = inputError(tableCapacity, date, civ, firstName, lastName, phone, meals);
        if (error != "") {
            displayError(error);
        }
        else {

            bootbox.confirm({
                message: "Êtes-vous certain des informations saisies ?",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Annuler'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirmer'
                    }
                },
                callback: function (result) {
                    if (result) {
                        orderATable();
                    }
                }
            });
        }
    });


});

function displayAccRow() {

    var tableCapacity = $("#nbP").val();
    let nbAcc = $("input[name='acc']").length;


    if (nbAcc > tableCapacity && nbAcc != 0) {
        while (nbAcc != 0) {
            let rowNewAccNode = $("input[name='acc']")[0].parentElement.parentElement;
            $("#" + rowNewAccNode.id).remove();
            nbAcc--;
        }

    }
    $("#hiddenNumber").val(0);


    if (tableCapacity == 1 || tableCapacity == -1) {

        $("#accRow").css('display', 'none');
    }
    else {
        $("#accRow").css('display', 'block');
        $("#accRow").removeAttr('style');
    }
}

function removeAcc(id) {
    $("#" + id).remove();
    let newTotalPersons = parseInt($("#hiddenNumber").val()) - 1;
    $("#hiddenNumber").val() = newTotalPersons;
}


function orderATable() {

    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let fullName = lastName + " " + firstName;
    let civ = getFullCivility();
    let date = $("#date").val();
    let tableCapacity = $("#nbP").val();

    let dateFrFormat = getDateFrFormat(date);


    let isAccompanied;

    if (tableCapacity > 1) {
        isAccompanied = "Vous serez accompagné(e) de" + getListAccomp();
    }
    else {
        isAccompanied = "";
    }


    var summaryHtml = "Bonjour " + civ + " " + fullName + "," +
        "<br />Votre réservation du <strong><u>" + dateFrFormat + "</u></strong> a bien été enregistrée." +
        "<br />Vous aurez une table pour " + tableCapacity + " personne(s) avec les repas suivants :" +
        "<br />" + getMealsHtml() + isAccompanied + "Le montant total de la commande est de <strong>" + getTotalAmount() + "</strong> Dinars"

    $("#cardParagraph").html(summaryHtml);
    $(".divResume").css('display', 'block');
    $(window).scrollTop(5000);
}



function getCurrentDate() {

    let date = new Date();

    let day;
    let month;
    let year;
    var currentDate = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();

    return currentDate.toString();
}

function getFullCivility() {
    let civ = $("input[name='civ']:checked").val();
    switch (civ) {
        case 'm': return 'Monsieur';
        case 'mme': return 'Madame';
        case 'mlle': return 'Mademoiselle';
        default: return 'errCiv';
    }
}

function getDateFrFormat(date) {

    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let fullDate = day + "/" + month + "/" + year;
    return fullDate;
}

function getMealsHtml() {

    let listMeals = "";
    let meals = $("div[value='1']");
    for (var i = 0; i < meals.length; i++) {
        listMeals += "<li>" + "<strong>" + meals[i].getAttribute('data-quant') + "</strong> " + meals[i].firstElementChild.nextElementSibling.textContent + "(s)</li>";
    }

    let finalList = "<ul>" + listMeals + "</ul>";

    return finalList;
}

function getTotalAmount() {
    let amount = 0;
    let meals = $("div[value='1']");

    for (var i = 0; i < meals.length; i++) {

        amount += parseFloat(meals[i].getAttribute('data-prix') * meals[i].getAttribute('data-quant'));
    }

    return amount;
}

function getListAccomp() {

    let listAccs = "";
    let finalList = "";
    let accs = $("input[name='acc']");

    for (var i = 0; i < accs.length; i++) {
        listAccs += "<li>" + accs[i].value + "</li>";
    }

    finalList = "<ul>" + listAccs + "</ul>";

    return finalList;
}


function inputError(nbP, date, civ, firstName, lastName, tel, meals) {

    let accs = $("input[name='acc']");

    if (nbP == '-1') {
        return "errNbPersons";
    }

    if (date == '') {
        return "errDate";
    }

    if (civ == 'errCiv') {
        return "errCiv";
    }

    if (lastName == '') {
        return "errLastName";
    }

    if (containsNumber(lastName)) {
        return "errIncorrectLastName";
    }

    if (lastName.length < 3) {
        return "errLengthLastName";
    }

    if (firstName == '') {
        return "errFirstName";
    }

    if (containsNumber(firstName)) {
        return "errIncorrectFirstName";
    }

    if (firstName.length < 3) {
        return "errLengthFirstName";
    }

    if (tel == '') {
        return "errTelEmpty";
    }

    if (tel.length != 8 || isNaN(tel)) {
        return "errTelLength";
    }

    /* Tests concerning the followers */

    if (nbP > 1) {
        if (accs.length == 0) {
            return "errAcc";
        }
        else {
            for (var i = 0; i < accs.length; i++) {
                if (accs[i].value == '') {
                    return "errAcc";
                }
                else {
                    if (accs[i].value.length < 5) {
                        return "errAccLength";
                    }
                    else {
                        if (containsNumber(accs[i].value)) {
                            return "errAccName";
                        }
                    }
                }
            }
        }
    }



    if (meals.length == 0) {
        return "errMeals";
    }

    for (var i = 0; i < meals.length; i++) {
        if (meals[i].getAttribute('data-quant') == 0) {
            return "errMealsQuantity";
        }
    }

    return "";
}


function displayError(error) {
    $("div[id='" + error + "']").removeClass('rowError');
    window.location.hash = '#' + error;
}

function initDivsError() {
    $("#errNbPersons").attr('class', 'row rowError');

    $("#errDate").attr('class', 'row rowError');

    $("#errCiv").attr('class', 'row rowError');

    $("#errAcc").attr('class', 'row rowError');

    $("#errAccName").attr('class', 'row rowError');

    $("#errMeals").attr('class', 'rowError text-center');

    $("#errTelLength").attr('class', 'row rowError');

    $("#errTelEmpty").attr('class', 'row rowError');

    $("#errLastName").attr('class', 'row rowError');

    $("#errIncorrectFirstName").attr('class', 'row rowError');

    $("#errLengthLastName").attr('class', 'row rowError');

    $("#errFirstName").attr('class', 'row rowError');

    $("#errIncorrectFirstName").attr('class', 'row rowError');

    $("#errLengthFirstName").attr('class', 'row rowError');

    $("#errMealsQuantity").attr('class', 'rowError text-center');
}


function containsNumber(string) {
    return /\d/.test(string);
}


function getAncientId() {
    return $("#ancientId").val();
}

function setAncientId(id) {
    $("#ancientId").val(id);
}

function setMap() {
    var mymap = L.map('mapid').setView([35.864000, 10.606427], 15);
    var marker = L.marker([35.864000, 10.606427]).addTo(mymap);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibW9lejk2IiwiYSI6ImNqcHpmb2dxcjA3dmk0MnAzdHJhM2d1cWMifQ.F9tAenloATlCneHfirTbLw'
    }).addTo(mymap);

}

function getCurrentFileName() {
    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);

    return lastPathSegment;
}

function disableAllQuantityButtons() {
    $(".quantity").children('button').attr('disabled', 'true');
}

function enableQuantityButton(id) {
    debugger;
    $("#" + id).children('button').removeAttr('disabled');
}

function disableQuantityButton(id) {

    $("#" + id).children('button').attr('disabled', 'true');
}

function incrementQuantity(spanId) {


    let firstDivNodeId = $("#" + spanId).parent().parent().attr('id');


    let ancientValue = parseInt($("#" + spanId).text());

    if (ancientValue < 5) {
        let newValue = parseInt(ancientValue) + 1;

        $("#" + spanId).text(newValue);
        $("#" + firstDivNodeId).attr('data-quant', newValue);
    }
}

function DecrementQuantity(spanId) {


    let firstDivNodeId = $("#" + spanId).parent().parent().attr('id');


    let ancientValue = parseInt($("#" + spanId).text());
    if (ancientValue > 0) {
        let newValue = parseInt(ancientValue) - 1;

        $("#" + spanId).text(newValue);
        $("#" + firstDivNodeId).attr('data-quant', newValue);

    }
}


