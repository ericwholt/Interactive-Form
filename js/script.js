const $form = $('form');
const $otherTitle = $('#other-title');
const $shirtColorsDiv = $('#colors-js-puns');
const $creditCardDiv = $('#credit-card');
const $paypalDiv = $('#paypal');
const $bitcoinDiv = $('#bitcoin');
let activitiesTotal = 0;


/*
    This handles all document load operations.
    Hide what doesn't need to be shown.
    Add HTML that is not needed when javascript is turned off.
    Set focus to name field on load.
*/
$(() => {
    $shirtColorsDiv.hide();
    $paypalDiv.hide();
    $bitcoinDiv.hide();
    $creditCardDiv.hide();
    $otherTitle.hide();
    buildWarnings();
    $('#payment').val('credit card');
    $('#payment').trigger('change');
    $("#name").focus();
});

/*
    Event Listeners
*/

// show other text box when other is selected. Remove placehold text as it is redundant if javascript is enabled.
$('#title').change((e) => {
    if (e.target.value === 'other') {
        $otherTitle.attr('placeholder', '');
        $otherTitle.show();
    } else {
        $otherTitle.hide();
    }
});


// shows or hides colors or entire selector depending on what is selected
$('#design').change((e) => {
    showColors(e.target.value);
});

// shows or hides appropriate payment information
$('#payment').change((e) => {
    if (e.target.value === 'credit card') {
        $('#payment-required').hide();
        $creditCardDiv.show();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    } else if (e.target.value === 'paypal') {
        $('#payment-required').hide();
        $creditCardDiv.hide();
        $paypalDiv.show();
        $bitcoinDiv.hide();
    } else if (e.target.value === 'bitcoin') {
        $('#payment-required').hide();
        $creditCardDiv.hide();
        $paypalDiv.hide();
        $bitcoinDiv.show();
    } else {
        $creditCardDiv.hide();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    }
});

// Event handler for submit when pressing register button
$form.on('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {

    } else {
        location.reload(true);
    }
});

//Validate fields while typing
$form.keyup((e) => {
    fieldEventValidate(e);
});

//Validate fields when it loses focus. Likely not needed.
$form.focusout((e) => {
    fieldEventValidate(e);
});

// Handle checkbox clicks. Remove error if checked, calculate total and disable conflicting schedules
$('.activities input').on('click', (e) => {
    if (isActivityChecked()) {
        $('#activities-required').hide();
        $("#activities-label").removeClass("error-label");
    } else {
        $('#activities-required').show();
        $("#activities-label").addClass("error-label");
    }
    calculateActivitesTotal(e);
    updateTotal(activitiesTotal);
    disableConflictingActivities(e);
});

/*
    End Event Listeners
*/

// handles colors. Parameter accepts string. String should be selected t-shirt design 
const showColors = (design) => {
    const $colors = $('#color');
    $colors.children().show();
    if (design === 'js puns') {
        $shirtColorsDiv.show();
        $colors.children('option[value="tomato"]').hide();
        $colors.children('option[value="steelblue"]').hide();
        $colors.children('option[value="dimgrey"]').hide();
        $colors.val('cornflowerblue');
        $colors.trigger('change');
    } else if (design === 'heart js') {
        $shirtColorsDiv.show();
        $colors.children('option[value="cornflowerblue"]').hide();
        $colors.children('option[value="darkslategrey"]').hide();
        $colors.children('option[value="gold"]').hide();
        $colors.val('tomato');
        $colors.trigger('change');
    } else {
        $colors.children('option[value="cornflowerblue"]').hide();
        $colors.children('option[value="darkslategrey"]').hide();
        $colors.children('option[value="gold"]').hide();
        $colors.children('option[value="tomato"]').hide();
        $colors.children('option[value="steelblue"]').hide();
        $colors.children('option[value="dimgrey"]').hide();
        $shirtColorsDiv.hide();
    }
};

/*
    Function fieldEventValidate()
    This function is called by the event listeners. Must pass the event as the parameter.
    it will check the type of the event target and if needed the id to determine which
    field to validate.
*/

const fieldEventValidate = e => {
    if (e.target.type === 'text' && e.target.id === 'name') {
        validateName();

    } else if (e.target.type === 'email') {
        validateEmail();

    } else if (e.target.type === 'text' && e.target.id === 'cc-num') {
        validateCreditCardNum();

    } else if (e.target.type === 'text' && e.target.id === 'zip') {
        validateZip();

    } else if (e.target.type === 'text' && e.target.id === 'cvv') {
        validateCvv();
    }
};

/*
    Function validateName()
    Gets the value of the name field and tests to ensure it meets requirements
    Must only have alpha characters and spaces.
    Validation will show warning text and color field red if it fails or
    hide warning text and color field green
*/
const validateName = () => {
    const isValidName = name => /^[a-zA-Z ]+$/i.test(name); // regex function that takes a string and tests string
    const $name = $('#name');
    const $nameWarning = $('#name-warning');
    if (isValidName($name.val())) {
        $name.removeClass("error");
        $name.addClass("valid");
        $name.prev().removeClass("error-label");
        $nameWarning.hide();
        return true;
    } else {
        $name.addClass("error");
        $name.removeClass('valid');
        $name.prev().addClass("error-label");
        $nameWarning.show();
        return false;
    }
}

/*
    Function validateEmail()
    Gets the value of the email field and tests to ensure it meets requirements
    Validation will show warning text and color field red if it fails or
    hide warning text and color field green
    returns boolean. This boolean is used when form is submited
*/

const validateEmail = () => {
    const isValidEmail = email => /^[^@\s]+@[^@\s.]+\.[a-z]{1,256}$/i.test(email); // regex function that takes a string and tests string
    const $mail = $('#mail');
    if (isValidEmail($mail.val())) {
        $mail.removeClass("error");
        $mail.addClass("valid");
        $mail.prev().removeClass("error-label")
        $('#email-warning-required').hide();
        $('#email-warning-invalid').hide();
        return true; // Value in email field is valid
    } else if ($mail.val() === "") { // if email field is empty show the Required warning text
        $mail.addClass("error");
        $mail.removeClass('valid');
        $mail.prev().addClass("error-label");
        $('#email-warning-required').show();
        $('#email-warning-invalid').hide();
        return false; // Value in email field is blank and is invalid
    } else { // else it has a value in the email field and it is not valid
        $mail.addClass("error");
        $mail.removeClass('valid');
        $mail.prev().addClass("error-label");
        $('#email-warning-required').hide();
        $('#email-warning-invalid').show();
        return false; // Value in email field is valid
    }
};

const isActivityChecked = () => {
    let checked = false;
    $('form input[type="checkbox"]').each(function () {
        if ($(this).is(":checked")) {
            checked = true;
        }
    });
    return checked;
};

const validateActivity = () => {
    if (isActivityChecked()) {
        $('#activities-required').hide();
        $("#activities-label").removeClass("error-label");
        return true;
    } else {
        $('#activities-required').show();
        $("#activities-label").addClass("error-label");
        return false;
    }
};
const validatePayment = () => {
    if ($('#payment option:selected').val() === 'credit card' && validateCreditCardNum() && validateZip() && validateCvv()) {
        return true;
    } else if ($('#payment option:selected').val() === 'paypal' || $('#payment option:selected').val() === 'bitcoin') {
        return true;
    } else {
        return false;
    }

};


/*
    Function validateCreditCardNum()
    Gets the value of the cc-num field and tests to ensure it meets requirements
    Validation will show warning text and color field red if it fails or
    hide warning text and color field green
    returns boolean. This boolean is used when form is submited
*/

const validateCreditCardNum = () => {
    const $ccnum = $('#cc-num');
    const isValidCreditCard = creditCardNumber => /^\d{13,16}$/i.test(creditCardNumber);
    const isValidCC = isValidCreditCard($ccnum.val());
    const ccInvalid = 'Number must be 13 to 16 digits'
    const ccRequired = 'Required';
    if (isValidCC && $('#payment option:selected').val() === 'credit card') {
        $ccnum.removeClass("error");
        $ccnum.addClass("valid");
        $ccnum.prev().prev().prev().removeClass("error-label")
        $('#cc-warning-required').hide();
        return true; // Field value was valid
    } else if ($('#payment option:selected').val() === 'select_method') {
        $('#payment-required').show();
        return false // Credit Card payment was selected so CC number can't be valid
    } else if ($('#payment option:selected').val() === 'credit card' && !isValidCC && $ccnum.val() === "") {
        $ccnum.addClass("error");
        $ccnum.removeClass('valid');
        $ccnum.prev().prev().prev().addClass("error-label");
        $('#payment-required').hide();
        $('#cc-warning-required').text(ccRequired);
        $('#cc-warning-required').show();
        return false // Credit Card number value is empty
    } else {
        $ccnum.addClass("error");
        $ccnum.removeClass('valid');
        $ccnum.prev().prev().prev().addClass("error-label");
        $('#payment-required').hide();
        $('#cc-warning-required').text(ccInvalid);
        $('#cc-warning-required').show();
        return false; //CC num value is invalid
    }
};

/*
    Function validateZip()
    Gets the value of the zip field and tests to ensure it meets requirements
    Validation will show warning text and color field red if it fails or
    hide warning text and color field green
    returns boolean. This boolean is used when form is submited
*/

const validateZip = () => {
    const isValidZip = zip => /^\d{5}$/i.test(zip);
    const $zip = $('#zip');
    const $zipValid = isValidZip($zip.val());
    const $zipwarn = $('#zip-required');
    const ziprequired = 'Required';
    const zipinvalid = 'Must be 5 digits';


    if ($zipValid && $('#payment option:selected').val() === 'credit card') {
        $zip.removeClass("error");
        $zip.addClass("valid");
        $zip.prev().prev().prev().removeClass("error-label");
        $zipwarn.hide();
        return true; // zip field is valid
    } else if ($('#payment option:selected').val() === 'select_method') {
        $('#payment-required').show();
        return false // payment type isn't selected
    } else if ($('#payment option:selected').val() === 'credit card' && !$zipValid && $zip.val() === "") {
        $('#payment-required').hide();
        $zip.addClass("error");
        $zip.removeClass('valid');
        $zip.prev().prev().prev().addClass("error-label");
        $zipwarn.text(ziprequired);
        $zipwarn.show();
        return false //zip field value is empty
    } else {
        $zip.addClass("error");
        $zip.removeClass('valid');
        $zip.prev().prev().prev().addClass("error-label");
        $zipwarn.text(zipinvalid);
        $zipwarn.show();
        return false; // zip field value is invalid
    }
};

/*
    Function validateCvv()
    Gets the value of the cvv field and tests to ensure it meets requirements
    Validation will show warning text and color field red if it fails or
    hide warning text and color field green
    returns boolean. This boolean is used when form is submited
*/

const validateCvv = () => {
    const isValidCvv = cvv => /^\d{3}$/i.test(cvv);
    const $cvv = $('#cvv');
    const $ccvValid = isValidCvv($cvv.val());
    const $cvvWarning = $('#cvv-required');
    const cvvRequired = 'Required';
    const cvvInvalid = 'Must be 3 digits';
    if ($ccvValid && $('#payment option:selected').val() === 'credit card') {
        $('#payment-required').hide();
        $cvv.removeClass("error");
        $cvv.addClass("valid");
        $cvv.prev().prev().prev().removeClass("error-label");
        $cvvWarning.hide();
        $cvvWarning.hide();
        return true; // cvv field is valid
    } else if ($('#payment option:selected').val() === 'select_method') {
        $('#payment-required').show();
        return false; // Payment type isn't credit card
    } else if ($('#payment option:selected').val() === 'credit card' && !$ccvValid && $cvv.val() === "") {
        $('#payment-required').hide();
        $cvv.addClass("error");
        $cvv.removeClass('valid');
        $cvv.prev().prev().prev().addClass("error-label");
        $cvvWarning.text(cvvRequired);
        $cvvWarning.show();
        return false; // ccv field value is empty
    } else {
        $cvv.addClass("error");
        $cvv.removeClass('valid');
        $cvv.prev().prev().prev().addClass("error-label");
        $cvvWarning.text(cvvInvalid);
        $cvvWarning.show();
        return false; // ccv field value is invalid
    }
};

const calculateActivitesTotal = e => {
    if (e.target.checked) {
        if (e.target.name === 'all') {
            activitiesTotal += 200;
        } else {
            activitiesTotal += 100;
        }
    } else {
        if (e.target.name === 'all') {
            activitiesTotal -= 200;
        } else {
            activitiesTotal -= 100;
        }
    }
}

/*
    Function updateTotal()
    This updates the total variable. 
    Must provide a number to the parameter.
    If value of passed parameter is greater than 0 we show it in the activites section
    if not greater than zero we hide the total in activities section
*/
const updateTotal = (total) => {
    const $totalh4 = $('#total');
    if (total > 0) {
        // $('#total').show();
        $totalh4.text('Total: $' + total).show();
    } else {
        $totalh4.hide();
    }
};

/*
    Function disableConflictingActivities()
    Must provide a event from eventlistener as the parameter
    This will disable a activity if happens at the same time as another activity
*/
const disableConflictingActivities = e => {
    const name = e.target.name;
    const $express = $("input[name='express']");
    const $jsframeworks = $("input[name='js-frameworks']");
    const $jslibs = $("input[name='js-libs']");
    const $node = $("input[name='node']");

    if (name === 'js-frameworks') {
        if (e.target.checked) {
            // js-frameworks was checked so disable express activity
            $express.prop('disabled', true);
            $express.parent().css('color', 'LightGray')
        } else {
            //js-frameworks was unchecked so enable express activity
            $express.prop('disabled', false);
            $express.parent().css('color', '')
        }
    } else if (name === 'js-libs') {
        if (e.target.checked) {
            // js-libs was checked so disable node activity
            $node.prop('disabled', true);
            $node.parent().css('color', 'LightGray')
        } else {
            // js-libs was unchecked so enable node activity
            $node.prop('disabled', false);
            $node.parent().css('color', '')
        }
    } else if (name === 'express') {
        if (e.target.checked) {
            // express was checked so disable js-frameworks activity
            $jsframeworks.prop('disabled', true);
            $jsframeworks.parent().css('color', 'LightGray')
        } else {
            // express was unchecked so enable js-frameworks activity
            $jsframeworks.prop('disabled', false);
            $jsframeworks.parent().css('color', '')
        }
    } else if (name === 'node') {
        if (e.target.checked) {
            // node was checked so disable js-libs
            $jslibs.prop('disabled', true);
            $jslibs.parent().css('color', 'LightGray')
        } else {
            // node was unchecked so enable js-libs
            $jslibs.prop('disabled', false);
            $jslibs.parent().css('color', '')
        }
    }
};

/* 
    Function validateForm()
    This function is called on submit. It tests all the fields and if they all return true
    it returns true. When it test the fields if they are not valid it will display errors on form.
*/
const validateForm = () => {
    if (validateName() && validateEmail() && validateActivity() && validatePayment()) {
        return true; // all form fields are valid
    } else {
        // set boolean variables of fields to true if valid or false if invalid
        // we want to call each function so the warnings for each field are set
        const validName = validateName();
        const validEmail = validateEmail();
        const validActivity = validateActivity();
        const validCreditCard = validateCreditCardNum();
        const validZip = validateZip();
        const validCvv = validateCvv();

        // now we know which fields are invalid.
        // lets set the first invalid field on form as focus
        if (!validName) {
            $("#name").focus();
        } else if (!validEmail) {
            $('#mail').focus();
        } else if (!validActivity) {
            $("#activities-label").focus();
        } else if (!validCreditCard) {
            $('#cc-num').focus();
        } else if (!validZip) {
            $('#zip').focus();
        } else if (!validCvv) {
            $('#cvv').focus();
        }
        return false; // form has invalid fields
    }
};

/*
    Function buildWarnings()
    This function creates warning html for fields in form. 
    We do this with Javascript to keep it unobtrusive 
*/

const buildWarnings = () => {

    // add name warning HTML and hide
    $('#name').prev().after('<span id="name-warning">Required</span>');
    $('#name-warning').hide();

    // add email warning HTML and hide
    $('#mail').prev().after('<span id="email-warning-required" class="error-label">Required</span>');
    $('#mail').prev().after('<span id="email-warning-invalid" class="error-label">Please enter a valid email</span>');
    $('#email-warning-required').hide();
    $('#email-warning-invalid').hide();

    // add activities warning HTML and hide
    $('.activities').append('<h4 id="total">Total: </h4>');
    $('#total').hide();
    $('.activities').append('<span id="activities-required" class="error-label">You must select one activity</span>');
    $('#activities-required').hide();

    // add payment warning HTML and hide
    $('#payment').prev().after('<span id="payment-required" class="error-label">Required</span>');
    $('#payment-required').hide();

    // add credit card number warning HTML and hide
    $('#cc-num').prev().after('<span id="cc-warning-required" class="error-label">Required</span><br>');
    $('#cc-warning-required').hide();

    // add zip warning HTML and hide
    $('#zip').prev().after('<span id="zip-required" class="error-label">Required</span><br>');
    $('#zip-required').hide();

    // add cvv warning HTML and hide
    $('#cvv').prev().after('<span id="cvv-required" class="error-label">Required</span><br>');
    $('#cvv-required').hide();
}