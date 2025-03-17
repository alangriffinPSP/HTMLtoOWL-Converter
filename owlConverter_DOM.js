// Node Types

// 1 = Element
// 2 = Attribute
// 3 = Text
// 8 = Comment


// TO FIX:
// Text content of tags is output before node's attributes
// Nested child nodes still not correctly handled
// Closing parentheses still needs to be implemented

$(document).ready(function () {

    //Object for methods to run on page load
    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#hiddenHTML').html('')
            $('#outputContainer').hide().html();
            // $('#userHTML').val("<div>I'm a div</div><p>I'm a paragraph</p>")
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

            codeConversion.conversionLoop(nodeList);
        },

        conversionLoop(nodes) {
            let outputString = "";

            nodes.forEach(function (node) {
                if (node.nodeType == 1) {
                    outputString += `(:${codeConversion.processElementNodes(node)} `;
                    if (node.hasChildNodes()) {
                        outputString += codeConversion.processChildNodes(node);
                    }
                }
                if (node.attributes) {
                    outputString += codeConversion.processAttributeNodes(node)
                }
                if (node.nodeType == 3) {
                    if (!node.data.match(/\s+/)){
                    outputString += codeConversion.processTextNodes(node)
                    }
                }
            })
            pageElements.displayOWL(outputString);
        },

        processElementNodes(node) {
            //localName maintains case sensitivity
            return `${node.localName}`;
        },

        //NOT WORKING --- FIX NEXT
        processChildNodes(node) {
            let childrenFound = node.childNodes;
            
            let processedChildren = "";
            // attempting to loop through childnodes
            //sort of working. Needs to drill deeper to return children's children and content
            childrenFound.forEach(function (child) {
                if(child.nodeType == 3){
                    processedChildren += `"${child.data}" ` 
                    console.log(processedChildren);
                } else if (child.nodeType == 1){
                    processedChildren += `(:${child.localName} ` 
                    console.log(processedChildren);
                }
            })
            return processedChildren;
        },

        //loops through attributes by index and returns name & value in desired format
        processAttributeNodes(node) {
            let attributesFound = "";
            for (let i = 0; i < node.attributes.length; i++) {
                attributesFound += `${node.attributes[i].localName}: "${node.attributes[i].nodeValue}" `;
            }
            return attributesFound;
        },

        //returns text nodes outside of tags
        processTextNodes(node) {
            return ` "${node.data}" `
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