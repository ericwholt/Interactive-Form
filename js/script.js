const $otherTitle = $('#other-title');
const $selectDesign = $('#design');
const $shirtColorsDiv = $('#colors-js-puns');
const $creditCardDiv = $('#credit-card');
const $paypalDiv = $('#paypal');
const $bitcoinDiv = $('#bitcoin');

// Set focus on load to first input. 
// Might want to accept a param so we can set 
// focus when an error is encountered on submit.
$(() => {
    $shirtColorsDiv.hide();
    $paypalDiv.hide();
    $bitcoinDiv.hide();
    $creditCardDiv.hide();
    $otherTitle.hide();
    $("#name").focus();
});

$('#title').change((e) => {
    if (e.target.value === 'other') {
        $otherTitle.show();
    } else {
        $otherTitle.hide();
    }
});

$('#payment').change((e) => {
    if (e.target.value === 'credit card') {
        $creditCardDiv.show();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    } else if (e.target.value === 'paypal') {
        $creditCardDiv.hide();
        $paypalDiv.show();
        $bitcoinDiv.hide();
    } else if (e.target.value === 'bitcoin') {
        $creditCardDiv.hide();
        $paypalDiv.hide();
        $bitcoinDiv.show();
    } else {
        $creditCardDiv.hide();
        $paypalDiv.hide();
        $bitcoinDiv.hide();
    }
});

$selectDesign.change((e) => {
    showColors(e.target.value);
});

const showColors = (design) => {
    const $colors = $('#color');
    $colors.children().show();
    if (design === 'js puns') {
        $shirtColorsDiv.show();
        $colors.children('option[value="tomato"]').hide()
        $colors.children('option[value="steelblue"]').hide()
        $colors.children('option[value="dimgrey"]').hide()
        $colors.val('cornflowerblue');
        $colors.trigger('change');
    } else if (design === 'heart js') {
        $shirtColorsDiv.show();
        $colors.children('option[value="cornflowerblue"]').hide()
        $colors.children('option[value="darkslategrey"]').hide()
        $colors.children('option[value="gold"]').hide()
        $colors.val('tomato');
        $colors.trigger('change');
    } else {
        $shirtColorsDiv.hide();
    }
};