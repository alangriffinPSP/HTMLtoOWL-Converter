$(document).ready(function () {

    //Object for methods to run on page load
    class PageLoad {
        constructor() { }
        clearForm() {
            $('#conversionForm').trigger('reset')
        }

        themeSet() {
            if ($('html').attr('data-theme') == 'dark') {
                $('#theme-change').html('LIGHTER');
            } else {
                $('#theme-change').html('DARKER');
            }
        }
    }
    //New object created from PageLoad class
    const freshPage = new PageLoad();

    class UserInteraction {
        constructor() { }
        
        changeTheme() {
            if ($('html').attr('data-theme') == 'dark') {
                ($('html').attr('data-theme', 'light'));
                $('#theme-change').html('DARKER');
            } else {
                ($('html').attr('data-theme', 'dark'));
                $('#theme-change').html('LIGHTER');
            }
        }
        
        replaceHTML(input) { //This method will do the conversion against regex and return to node method
            // const regex = [/</, />/, /\//, /=/];
            
            // $.each(regex, function(index, value){
            //     console.log(index + ':' + value);
            //     console.log("user input = " + input)
            // })
            
            const newOutput = input.replace(/</g, "(:").replace(/>/g, ")").replace(/\//g, "").replace(/=/g, ": ");
            console.log("newOutput " + newOutput);
            return newOutput;
            
        }
        createNode() {
            let $htmlInput = $('#userHTML').val();
           
            if (!$htmlInput){
                return
            }
            const output = interact.replaceHTML($htmlInput);
            // console.log(output);
            
            $('#outputContainer').html(output); 
            $(window).scrollTop(0);
            freshPage.clearForm();
        }

        formClickListener() {
            $('#convert').click(this.createNode);
        }
    }

    //New object created from UserInteraction class
    const interact = new UserInteraction();
    interact.formClickListener();

    //User controlled method calls
    $("#theme-change").click(interact.changeTheme);

    //Methods run on page load
    freshPage.clearForm();
    freshPage.themeSet();

});