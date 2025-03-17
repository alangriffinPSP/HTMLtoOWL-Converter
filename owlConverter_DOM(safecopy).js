// Node Types

// 1 = Element
// 2 = Attribute
// 3 = Text
// 8 = Comment

$(document).ready(function () {

    //Object for methods to run on page load
    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#hiddenHTML').html('')
            $('#outputContainer').hide().html();
            $('#userHTML').val("<div>I'm a div</div><p>I'm a paragraph</p>")
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
        // Grabs user input and passes to method to create node list
        receiveHTML() {
            let HTMLInput = $('#userHTML').val();

            if (!HTMLInput) {
                return;
            }
            $('#hiddenHTML').html(HTMLInput);

            let nodeList = document.getElementById("hiddenHTML").childNodes;

            codeConversion.processConversion(nodeList);
        },

        processConversion(nodes) {
            console.log(nodes);
            let outputString = "";

            nodes.forEach(function (node) {
                outputString += '(:' + node.localName + ' ';
                //Not foolproof. Incorrectly handles attributes that don't have values (eg: "autofocus")
                if (node.hasAttributes()) {

                    for (let i = 0; i < node.attributes.length; i++) {
                        outputString += " " + node.attributes[i].localName + ': "' + node.attributes[i].value + '" '
                    }

                };

                //Remember attributes are not caught by childNodes methods
                if (node.hasChildNodes()) {
                    console.log(node.childNodes)
                    for (let i = 0; i < node.childNodes.length; i++) {
                        // only works with text nodes!
                        //if statements to check node type? 
                        outputString += ' "' + node.childNodes[i].data + '" '
                    }
                }

                //Work out when to correctly add closing bracket -----FIX!
                if (node.hasChildNodes() && !node.firstElementChild) {
                    outputString += ")";
                }

            })
            pageElements.displayOWL(outputString);
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