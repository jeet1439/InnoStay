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

  //for edit.ejs
  let para = document.getElementById('para');
    let loader = document.getElementById('loader');
    setTimeout(() => {
        para.textContent = "Redirecting to the /listings";
        loader.style.display = 'flex';
    }, 4000);
    setTimeout(() => {
        window.location.href = "/listings";
    }, 6000);