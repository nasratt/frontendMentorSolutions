let btn = document.querySelector('.btn');
let inputField = document.querySelector('.email');
let errorMsg = document.querySelector('.errorMsg');
let errorIcon = document.querySelector('.errorIcon');

function checkEmail(val) {
  const regex = /^\w+[@]\w+[\.]\w+([\.]\w+)?$/;
  return regex.test(val);
}

function checkInput(val) {
  if(val === '') return false;
  else return true;
}

function showError() {
  [errorMsg, errorIcon].forEach((cur) => {
    cur.classList.add('error');
  });
  inputField.classList.add('notValid');
}
function removeError() {
  [errorMsg, errorIcon].forEach((cur) => {
    cur.classList.remove('error');
  });
  inputField.classList.remove('notValid');
}

function validate(e) {
  let inputEmail = inputField.value;
  let isEmailValid = checkEmail(inputEmail);
  let isInputFilled = checkInput(inputEmail);
  if((!isEmailValid) || (!isInputFilled)) {
    showError();
  } else if(isEmailValid && isInputFilled) {
    removeError();
  }
}

btn.addEventListener('click', (e) => {
  e.preventDefault();
  validate();
});
inputField.addEventListener('keyup', validate)