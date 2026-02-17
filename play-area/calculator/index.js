let num1 = document.getElementById("Num1")

let num2 = document.getElementById("Num2")

let plus = document.getElementById("plus")

let minus = document.getElementById("minus")

let multiply = document.getElementById("multiply")

let divide = document.getElementById("divide")

let result = document.getElementById("result")


function plusFunc () {

    let sum = Number(num1.value) + Number(num2.value)

    result.innerText=`${sum}`

    return

}

function minusFunc () {

    let substraction = Number(num1.value) - Number(num2.value)

    result.innerText=`${substraction}`

    return

}

function divideFunc () {

    let division = Number(num1.value) / Number(num2.value)

    result.innerText=`${division.toFixed(2)}`

    return

}

function multiplyFunc () {

    let multiply = Number(num1.value) * Number(num2.value)

    result.innerText=`${multiply}`

    return

}

plus.addEventListener('click', plusFunc)
minus.addEventListener('click', minusFunc)
divide.addEventListener('click', divideFunc)
multiply.addEventListener('click', multiplyFunc)
