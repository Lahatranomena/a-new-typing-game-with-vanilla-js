const password= document.querySelector('.password')
const btn = document.querySelector('.submit')
const user = document.querySelector('.user')

if (form) {
    form.addEventListener('submit',function login(e){
      e.preventDefault()
      if (user.value != null && password.value != null) {
        function chargement() {
              btn.innerHTML=`...`
        }
        setTimeout(chargement,1000)
      function callpage() {
        window.open('../html/index.html')
      }
      setTimeout(callpage, 1000)
    }
}
)};