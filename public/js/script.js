// Example starter JavaScript for disabling form submissions if there are invalid fields: Bootstrap
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

// for tax bitton

let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () =>{
  let taxinfo = document.getElementsByClassName("taxInfo");
  for(info of taxinfo){
    if(info.style.display != "inline"){
      info.style.display = "inline";
    }else{
      info.style.display = "none";
    }
  }
})

(function () {
    'use strict';
    var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms)
        .forEach(function (form) {
                    form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
})();


