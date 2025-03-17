//WORKING (I think!)
// Closing tags identified
// Opening tags identified
// Output pane working
// Tag content
// Tag attributes
// Nested tags
// Auto closing tags detected

//NOT WORKING
// Empty div undetected
// Script tags handled correctly?

//REGEX EXPRESSIONS
// /<\/.*?>/gm    </xxxx> closing tag
// /\/\s?>/gm   Auto closing tag
// /</g         <
// />/g         >
// /=/g         =
// /(?<=>)\s*([^<\s][^<]*?[^<\s])\s*(?=<)/gm  'Content' after opening tag, before closing tag, multiline, ignore whitespace

$(document).ready(function () {

    //Object for methods to run on page load
    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#outputContainer').hide().html();
        },

        themeSet() {
            if ($('html').attr('data-theme') == 'dark') {
                $('#theme-change').html('LIGHTER');
            } else {
                $('#theme-change').html('DARKER');
            }
        }
    }

    const codeConversion = {

        receiveHTML() {
            let HTMLInput = $('#userHTML').val();

            if (!HTMLInput) {
                return;
            }
            codeConversion.tagContentDetection(HTMLInput);
        },

        //Detects html tag content and encases in quote marks
        tagContentDetection(input) {
            const matchCase = input.match(/(?<=>)\s*([^<\s][^<]*?[^<\s])\s*(?=<)/gm);

            if (input.match(/(?<=>)\s*([^<\s][^<]*?[^<\s])\s*(?=<)/gm)) {

                let newString = input;
                matchCase.forEach(function (match) {
                    newString = newString.replace(match, ' "' + match + '" ');
                });
                codeConversion.emptyTagDetection(newString);
                return;
            }
            codeConversion.emptyTagDetection(input);
            return (input);
        },

        //Does not work correctly
        emptyTagDetection(input){
            const matchCase = input.match(/<(.*)>\s*<(\/\1)>/gm);
            
            if (input.match(/<(.*)>\s*<(\/\1)>/gm)){
                
                let newString = input;
                matchCase.forEach(function (match) {
                    newString = newString.replace("<" + match + ">", 'X' + match + 'X');
                });
                this.processSlash(newString);
                return;
            }
            this.processSlash(input);
            return (input);
           
        },

        //Replaces forward slash
        processSlash(input) {
            let slash = input.replace(/<\/.*?>/gm, ')').replace(/\/\s?>/gm, ' "" )');
            this.processLessThan(slash);
        },

        //Replaces less than
        processLessThan(input) {
            let lessThan = input.replace(/</g, '(:');
            this.processMoreThan(lessThan);
        },

        //Replaces more than
        processMoreThan(input) {
            let moreThan = input.replace(/>/g, ' ');
            this.processEquals(moreThan);
        },

        //Replaces equals
        processEquals(input) {
            let equals = input.replace(/=/g, ': ');
            console.log(`Current state = ${equals}`);
            pageElements.displayOWL(input);;
        }
    }

    //Handles page elements 
    const pageElements = {
        changeTheme() {
            if ($('html').attr('data-theme') == 'dark') {
                ($('html').attr('data-theme', 'light'));
                $('#theme-change').html('DARKER');
            } else {
                ($('html').attr('data-theme', 'dark'));
                $('#theme-change').html('LIGHTER');
            }
        },

        //Receives converted HTML and displays in output pane
        displayOWL(OWLOutput) {
            $('#outputContainer').show().html(OWLOutput);
        },

        convertClickListener() {
            $('#convert').click(codeConversion.receiveHTML);
        },

        resetClickListener() {
            $('#reset').click(pageLoad.clearForm);
        }
    }

    //User controlled method calls
    $("#theme-change").click(pageElements.changeTheme);

    //Methods run on page load
    pageElements.convertClickListener();
    pageElements.resetClickListener();
    pageLoad.clearForm();
    pageLoad.themeSet();
});