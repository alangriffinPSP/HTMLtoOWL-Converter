$(document).ready(function () {

    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#outputContainer').hide();
            // Strings used for testing
            // $('#userHTML').val('<div id="1">#1<div id="2">child of #1</div><div id="3">child of #1, sibling of #2<div id="4">child of #3</div>#3</div><div id="5">#5</div></div>');
            // $('#userHTML').val('<div>text<div id="elem"></div>more text</div><div></div>');
            // $('#userHTML').val('<div id="1">one<div id="2">two</div><div id="3">three</div></div>');
        },

        themeSet() {
            if ($('html').attr('data-theme') == 'dark') {
                $('#theme-change').html('LIGHTER');
            } else {
                $('#theme-change').html('DARKER');
            }
        }
    }

    var output = {
        arr: [],
        append: function (stuff) {
            this.arr.push(stuff);
            return this;
        },
        get: function () {
            return this.arr.join('');
        },
        reset: function () {
            this.arr = [];
        }
    }

    const process = {

        selfClose: ['area', 'base', 'br', 'col', 'embed', 'hr',
            'img', 'input', 'link', 'meta', 'param',
            'source', 'track', 'wbr'],

        append(stuff) {
            return output.append(stuff);
        },

        processNodes(list) {
            list.forEach(this.processNode);
        },

        processNode(node) {
            process.newLine(node);
            process.indent(node);
            //void element handling added
            if (process.selfClose.includes(node.localName)) {
                process.voidCheck(node);
            } else if (node.nodeType == 1) {
                process.processElementNode(node);
            } else if (node.nodeType == 3) {
                process.processTextNode(node);
            }
        },

        //----New method for indent tracking
        getNodeDepth(node) {
            //Indent resets on each method call
            let indent = 0;
            let currentNode = node;
            //Whilst current node: is NOT <BODY> nor direct child of <BODY>
            while (currentNode.tagName != "BODY" && currentNode.parentNode.tagName != "BODY") {
                //Indent incremented
                indent++;
                //currentNode reassigned to current node's parent
                currentNode = currentNode.parentElement;
            }
            //Indent returned on loop exit
            return indent;
        },

        processElementNode(node) {
            this.append('(:' + node.localName);
            this.processAttributes(node);
            this.contentCheck(node);
            if (node.hasChildNodes()) {
                this.append(' ');
                this.processNodes(node.childNodes);
            }
            this.append(')');
        },

        //Void elements checked for attributes 
        voidCheck(node) {
            this.append('(:' + node.localName);
            this.processAttributes(node);
            this.append(')');
        },

        processAttributes(node) {
            for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i];
                this.append(' ').append(attr.localName).append(': ');
                this.append(attr.value ? `"${attr.value}"` : '""');
            }
        },

        contentCheck(node) {
            if (!node.innerHTML) {
                process.append(' ""');
            }
        },

        processTextNode(node) {
            if (node.data.match(/\S+/)) this.append('"' + this.escape(node.data) + '"');
        },

        indent(node) {
            if (node.nodeType == 3 && node.parentElement != null && (node.nextSibling != null || node.previousSibling != null)) {
                process.append('&#9;'.repeat(process.getNodeDepth(node)));
            } else if (node.nodeType == 1) {
                process.append('&#9;'.repeat(this.getNodeDepth(node)));
            }
        },

        escape(text) {
            let textarr = text.split('')

            textarr.forEach(function (char, index) {
                if (char == '"') {
                    textarr[index] = '\\"';
                }
            })
            return textarr.join('');
        },

        newLine(node) {
            //Text with next or previous sibling = new line
            if (node.nodeType == 3 && (node.nextSibling != null || node.previousSibling != null)) {
                process.append('\n');
                //Element, not direct child of BODY with no previous sibling = no new line
            } else if (node.nodeType == 1 && node.parentElement.tagName == "BODY" && node.previousSibling == null) {
                return;
                //Element with previous sibling = new line
            } else if (node.nodeType == 1 && node.previousSibling != null) {
                process.append('\n');
                //Element not direct child of BODY but has parent element (i.e. is child)
            } else if (node.nodeType == 1 && node.parentElement.tagName != "BODY" && node.parentElement != null) {
                process.append('\n');
            }
        }
    }

    const stringReceiver = {
        receiveHTML() {
            let HTMLInput = $('#userHTML').val();

            if (!HTMLInput) {
                return;
            }

            const domParser = new DOMParser();
            let parsedHTML = domParser.parseFromString(HTMLInput, "text/html");

            output.reset();
            process.processNodes(parsedHTML.body.childNodes);

            pageElements.displayOWL(output.get());
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
            $('#outputContainer').show();
            $('#output').html(OWLOutput);
        },

        convertClickListener() {
            $('#convert').click(stringReceiver.receiveHTML);
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