function validateEmail(email) {
    if (email === '') return 'Please enter your email.'
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) return '';
    else return 'Please enter a valid email address.'
}

function validatePassword(password) {
    if (password.length < 8 || password.length > 24) return "Password should be 8-24 characters long."
    return '';
}

export {validateEmail, validatePassword}