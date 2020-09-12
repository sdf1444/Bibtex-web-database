const inputUsername = document.querySelector('.input-username');
const inputPassword = document.querySelector('.input-password');
const divError = document.querySelector('.error-div')

document.querySelector('.login-form').onsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/', {
        method: 'POST',
        body: JSON.stringify({
            username: inputUsername.value,
            password: inputPassword.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
    console.log(res);
    if (res.ok) {
        const token = res.response.token
        chrome.storage.local.set({ token });
        chrome.extension.sendMessage({ tokenreceived: true, token });
    } else {
        divError.innerHTML = res.error.reason;
        divError.classList.remove('disabled');
    }
}

inputUsername.onchange = (e) => {
    divError.innerHTML = '';
    divError.classList.add('disabled');
}

inputPassword.onchange = (e) => {
    divError.innerHTML = '';
    divError.classList.add('disabled');
}