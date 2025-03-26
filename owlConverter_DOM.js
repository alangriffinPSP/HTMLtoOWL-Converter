
// TO FIX:

//Closing parentheses not accurate

$(document).ready(function () {

    //Object for methods to run on page load
    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#hiddenHTML').html('')
            $('#outputContainer').hide().html();
            // $('#userHTML').val('<div class="testClass" id="testID"><h1 id="childH1">This is a child node (text)</h1></div>')
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

            //POTENTIAL ISSUE - Always includes HTML/HEAD/BODY as it's an entire document. 
            const domParser = new DOMParser();
            let parsedHTML = domParser.parseFromString(HTMLInput, "text/html");

            //ISSUE
            //Only grabs nodes from body and below (i.e user content)
            //This means that user entered <HTML>, <HEAD> etc are ignored.
            let nodeList = parsedHTML.body.childNodes;

            codeConversion.stringHandling(nodeList);
        },

        stringHandling(nodeList) {
            console.log(nodeList);
            let outputString = "";
            outputString += codeConversion.mainLoop(nodeList);

            pageElements.displayOWL(outputString);
        },

        mainLoop(nodeList) {
            let loopString = "";

            nodeList.forEach(function (node) {
                //element node check
                if (node.nodeType == 1) {
                    loopString += `(:${node.localName} `;
                    //attribute check
                    if (node.hasAttributes()) {
                        for (let i = 0; i < node.attributes.length; i++) {
                            let attr = node.attributes[i];
                            if (!attr.nodeValue == "") {
                                loopString += `${attr.localName}: "${attr.value}" `;
                            } else {
                                //attributes without values given quote marks (i.e. autofocus, required)
                                loopString += `"${attr.localName}" `;
                            }
                        }
                    }
                    //NOT CURRENTLY WORKING - incorrect placement?
                    // loopString += codeConversion.closingBracket(node)
                }

                //text node check (Ignoring nodes of whitespace)
                else if (node.nodeType == 3 && node.data.match(/\S+/)) {
                    loopString += `"${node.data}" `;
                }

                //child node check
                if (node.hasChildNodes()) {
                    //restart loop with child nodelist
                    loopString += codeConversion.childProcessing(node);
                }

            })
            //string returned at the end of each node's interrogation
            return loopString;
        },

        childProcessing(node) {
            //pass child nodelist back to original loop
            let children = "";
            children += codeConversion.mainLoop(node.childNodes);
            //findings from child nodes returned and added to string
            return children;
        },

        //FIX THIS 
        // closingBracket(node) {
        //     if (node.nextElementSibling == null) {
        //         console.log("bracket")
        //         return ")";
        //     }
        // }

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

        displayOWL(OWLOutput) {
            $('#outputContainer').show().html(OWLOutput);
        },

        convertClickListener() {
            $('#convert').click(codeConversion.receiveHTML);
            // codeConversion.successCheck();
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