let username = prompt("Enter Your Username")

while (validateUsername(username) == false) {
    username = prompt("Username is invalid, please enter a valid username")
}

let password = prompt("Enter Your Password")
validatePassword(password)

while (validatePassword(password) == false) {
    password = prompt("Password is invalid, please enter a valid password")
}

let confirmPassword = prompt("Confirm your password")

while (validateConfirmPassword(confirmPassword) == false) {
    confirmPassword = prompt("The password doesn't match, please reconfirm your password")
}

alert(`Welcome ${username}, your password is "${password}"`)


function validateUsername (username) {
    if (username == null) {
        return true
    }
    
    if (username == "") {
        return false
    }


    if (username.length > 10) {
        return false
    } else {
        return true
    }
}



function validatePassword (password) {
    if (password == null) {
        return true
    }
    
    if (password == "") {
        return false
    }

    if (password.length < 6) {
        return false
    } else {
        return true
    }
}



function validateConfirmPassword (confirmPassword) {
    if (confirmPassword == password) {
        return true
    } else {
        return false
    }
};






let userDetails = {
    name: username,
    userPassword : password
};

console.log(userDetails)
