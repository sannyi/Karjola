//JAVASCRIPT DATOTEKA ZA FORME
$(document).ready(function() {

    /*$("#inputZip").focusout(function(){
      
        var zipcode = $('#inputZip').val();
        
        const regexZipCode = /\d\d\d\d/; //ok regex bo še treba refinat
        console.log(regexZipCode.test(zipcode));

        if(regexZipCode.test(zipcode)){
            var api = new XMLHttpRequest();
            api.open("GET","https://api.lavbic.net/kraji/"+zipcode, true);
            api.addEventListener("load",function(){
                console.log(api.status);
                if(api.status<400)
                {
                    //console.log(api.responseText);
                    var krajInPosta  = JSON.parse(api.responseText);
                    //console.log(krajInPosta);
                    var kraj = krajInPosta.kraj;
                    //console.log(kraj);
                    $('#inputCity').prop('disabled',false);
                    $('#inputCity').val(krajInPosta.kraj);
                    $('#inputCity').prop('disabled',true);

                }
                else{
                    $('#inputCity').prop('disabled',false);
                    $('#inputCity').val("Ponovi vajo!");
                    $('#inputCity').prop('disabled',true);
                }
            });
            api.send(null)
            //api.removeEventListener("load"); -> bo potrebno urediti v LP2
        }
    });*/
});  