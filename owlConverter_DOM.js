$(document).ready(function () {

    const pageLoad = {

        clearForm() {
            $('#conversionForm').trigger('reset');
            $('#outputContainer').hide()
            // String used for testing
            // $('#userHTML').val('<div id="1">parent<div id="2">child (tabbed)</div><div id="3">(inline)<div id="4">(tabbed)</div>text</div><div id="5">back one step</div></div>');
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
            process.tabCount = 0;
            return this.arr.join('');
        },
        reset: function () {
            this.arr = [];
            process.tabCount = 0;
        }
    }

    const process = {
        tabCount: 0,

        append(stuff) {
            return output.append(stuff);
        },

        processNodes(list) {
            list.forEach(this.processNode);
        },

        processNode(node) {
            if (node.nodeType == 1) {
                process.processElementNode(node);
            } else if (node.nodeType == 3) {
                process.processTextNode(node);
            }
        },

        processElementNode(node) {
            this.newLine(); //New line applied
            this.applyIndent(); //Indent applied if necessary
            this.indentIncreaseCheck(node); //Indent increase calculation
            this.append('(:' + node.localName);
            this.processAttributes(node);
            if (node.hasChildNodes()) {
                this.append(' ');
                this.processNodes(node.childNodes);
            }
            this.indentDecreaseCheck(node); //Indent decrese calculation
            this.append(')');
        },

        processAttributes(node) {
            for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i];
                this.append(' ').append(attr.localName).append(': ');
                this.append(attr.value ? `"${attr.value}"` : '""');
            }
        },

        processTextNode(node) {
            if (node.data.match(/\S+/)) this.append(' "' + this.escape(node.data) + '" ');
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

        newLine() {
            process.append('\n');
        },

        indentIncreaseCheck(node) {
            //CALCULATED AT THE END OF NODE PROCESSING

            if (node.firstElementChild != null) {
                //Indent if child node present
                this.tabCount++;
            } else if (node.firstElementChild == null && node.nextElementSibling != null) {
                //no change
            }
        },

        indentDecreaseCheck(node) {
            if (node.nextElementSibling == null && this.tabCount > 0) {
                //Reduce indent if no child present and no further siblings present
                this.tabCount--
            }
        },

        applyIndent() {
            process.append('&#9;'.repeat(process.tabCount))
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
            process.processNodes(parsedHTML.body.childNodes); //change made here (processNode(s))

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