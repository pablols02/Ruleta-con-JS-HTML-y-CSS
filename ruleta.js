function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //Add a zero in front of numbers<10
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + " : " + min + " : " + sec;
    var time = setTimeout(function(){ startTime() }, 500);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// ---PROGRESS BAR---
    // Obtén una referencia al elemento de la barra de progreso
    var progressBar = document.querySelector(".progress-bar");
    // Obtén una referencia al elemento con el ID "segundos"
    var segundosElement = document.getElementById("segundos");
    // Establece la duración del temporizador en milisegundos (15 segundos)
    var duration = 15000;
    // Función para actualizar el atributo aria-valuenow
    function updateAriaValueNow(value) {
        progressBar.setAttribute("aria-valuenow", value.toString());
    }

    // Función para iniciar la cuenta atrás
    function startCountdown() {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = "0";

        var segundos = 15;
        var countdownInterval = setInterval(function () {
            segundos--;
            segundosElement.textContent = segundos;
            if (segundos === 0) {
                clearInterval(countdownInterval);
                segundosElement.textContent = "!NO VA MAS!";
                realizarTirada(); // Llama a la función para realizar la tirada cuando el temporizador llega a cero
                setTimeout(resetTemporizador, 5000); // Vuelve a iniciar el temporizador después de 5 segundos
            }
        }, 1000); // Actualiza cada segundo
    }

// Función para realizar la tirada
function realizarTirada() {
    var tablero = document.getElementById('tablero');
    var botonPlay = document.getElementById('botonPlay');
    tablero.classList.add('desactivado'); // Desactiva el tablero al mostrar el resultado
    botonPlay.click(); // Simula el clic en el botón de jugar
    setTimeout(() => {
        tablero.classList.remove('desactivado'); // Activa el tablero después de 5 segundos
    }, 5000);
}

// Función para reiniciar el temporizador a 15 segundos
function resetTemporizador() {
    var tablero = document.getElementById('tablero');
    tablero.classList.remove('desactivado'); // Reactiva el tablero al reiniciar el temporizador
    numAleatorio.style.opacity = "0"; // Ajusta la opacidad del número aleatorio a 0
    startCountdown(); // Vuelve a iniciar el temporizador
}

// Inicia la cuenta atrás y la barra de progreso cuando se carga la página
window.addEventListener("load", startCountdown);


var fichaSeleccionada = null;
var apuestas = [];
var cantidadApostada = 0;
var saldo = 0; // Inicializamos el saldo en 0
var depositarBtn = document.querySelector('#depositarModal button.btn-success');
var retirarBtn = document.querySelector('#retirarModal button.btn-success');
var saldoElement = document.getElementById('saldo'); // Elemento para mostrar el saldo
var saldoDatosElement = document.getElementById('saldoDatos');

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 37);
}

document.addEventListener('DOMContentLoaded', function() {
    var fichas = document.querySelectorAll('.ficha');
    var casillas = document.querySelectorAll('#tablero td');
    var apuestaLabel = document.getElementById('apuestaLabel'); // Elemento para mostrar la cantidad apostada
    var botonBorrar = document.getElementById('botonBorrar');
    var botonPlay = document.getElementById('botonPlay');

    fichas.forEach(ficha => {
        ficha.addEventListener('click', function() {
            fichaSeleccionada = parseFloat(this.id.replace('ficha', '')); // Convertir la ficha a su valor en euros
            // Remover la clase 'ficha-seleccionada' de todas las fichas
            fichas.forEach(f => {
                f.classList.remove('ficha-seleccionada');
            });
            
            // Agregar la clase 'ficha-seleccionada' solo a la ficha actualmente seleccionada
            this.classList.add('ficha-seleccionada');
        });
    });

    casillas.forEach(casilla => {
        casilla.addEventListener('click', function() {
            if (fichaSeleccionada !== null) {
                var valorCasilla = this.textContent.trim();
    
                // Calcular el valor de la apuesta
                var valorFichaEnEuros = fichaSeleccionada / 100; // Convertir la ficha a su valor en euros
                var nuevaApuesta = new Apuesta(valorFichaEnEuros, valorCasilla); // Crear el objeto Apuesta
    
                // Verificar si hay saldo suficiente para realizar la apuesta
                if (saldo >= nuevaApuesta.valor) {
                    apuestas.push(nuevaApuesta);
                    cantidadApostada = cantidadApostada + nuevaApuesta.valor;
                    saldo = saldo - nuevaApuesta.valor; // Restar la apuesta del saldo
    
                    apuestaLabel.textContent = `Apuesta: ${cantidadApostada.toFixed(2)}€`; // Actualizar el valor en el HTML
                    console.log('Apuestas realizadas:', apuestas);
                } else {
                    alert("No tienes saldo suficiente para realizar esta apuesta");
                }
            } else {
                alert("Primero selecciona una ficha");
                console.log('Primero selecciona una ficha');
            }
        });
    });

    botonBorrar.addEventListener('click', function() {
        apuestas.splice(0, apuestas.length);
        console.log('Apuestas borradas:', apuestas);
        apuestaLabel.textContent = `Apuesta: 0.00€`;
    });

    
    // Objeto para almacenar la frecuencia de los números
    var frecuenciaNumeros = {};

    // Función para incrementar la frecuencia de un número
    function actualizarFrecuenciaNumero(numero) {
        if (frecuenciaNumeros[numero]) {
            frecuenciaNumeros[numero]++;
        } else {
            frecuenciaNumeros[numero] = 1;
        }
    }

    // Función para mostrar los números en un contenedor
    function mostrarNumerosEnContenedor(numeros, contenedorId) {
        var contenedor = document.getElementById(contenedorId);
        var circleElements = contenedor.querySelectorAll('.circle');

        circleElements.forEach((circle, index) => {
            if (numeros[index]) {
                circle.textContent = numeros[index];
            } else {
                circle.textContent = '';
            }
        });
    }

    // Función para obtener los números más frecuentes
    function obtenerNumerosMasFrecuentes(frecuenciaNumeros) {
        var numeros = Object.keys(frecuenciaNumeros);
        numeros.sort((a, b) => frecuenciaNumeros[b] - frecuenciaNumeros[a]);
        return numeros.slice(0, 5); // Obtener los 5 números más frecuentes
    }

    // Función para obtener los números menos frecuentes
    function obtenerNumerosMenosFrecuentes(frecuenciaNumeros) {
        var numeros = Object.keys(frecuenciaNumeros);
        numeros.sort((a, b) => frecuenciaNumeros[a] - frecuenciaNumeros[b]);
        return numeros.slice(0, 5); // Obtener los 5 números menos frecuentes
    }
    
    // Llamada para obtener los números menos frecuentes
    var menosFrecuentes = obtenerNumerosMenosFrecuentes(frecuenciaNumeros);
    // Función para mostrar los números menos frecuentes en un contenedor con colores
    function mostrarNumerosMenosFrecuentesEnContenedor(numeros, contenedorId) {
        var contenedor = document.getElementById(contenedorId);
        var circleElements = contenedor.querySelectorAll('.circle');

        circleElements.forEach((circle, index) => {
            if (numeros[index]) {
                var number = parseInt(numeros[index]);
                circle.textContent = number;
            } else {
                circle.textContent = '';
                circle.style.backgroundColor = ''; // Limpiar el color si no hay número
            }
        });
    }
    // Llamada para mostrar los números menos frecuentes con sus colores en el contenedor
    mostrarNumerosMenosFrecuentesEnContenedor(menosFrecuentes, 'contenedorFrios');

    function actualizarYMostrarCalientesFrios(numeroAleatorio) {
        actualizarFrecuenciaNumero(numeroAleatorio);
        var numerosMasFrecuentes = obtenerNumerosMasFrecuentes(frecuenciaNumeros);
        var numerosMenosFrecuentes = obtenerNumerosMenosFrecuentes(frecuenciaNumeros);
        mostrarNumerosEnContenedor(numerosMasFrecuentes, 'contenedorCalientes');
        mostrarNumerosEnContenedor(numerosMenosFrecuentes, 'contenedorFrios');
    }

    botonPlay.addEventListener('click', function() {
        var numeroAleatorio = generarNumeroAleatorio();
        console.log(numeroAleatorio);
        actualizarYMostrarCalientesFrios(numeroAleatorio);

        var contenedorUltimosNumeros = document.getElementById('contenedorUltimosNumeros');
        var circleElements = contenedorUltimosNumeros.querySelectorAll('.circle2');
        var rojo = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        var negro = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        var par = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
        var impar = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
        var docena1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var docena2 = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        var docena3 = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
        var fila1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
        var fila2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
        var fila3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
        var mitad1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        var mitad2 = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
        var ganancia = 0;

        var colores = {
            rojo: 'rgb(255, 0, 0)',
            negro: 'rgb(0, 0, 0)',
            verde: 'rgb(0, 128, 0)'
        };
    
        // Cambiar el color de fondo basado en el número aleatorio
        if (numeroAleatorio === 0) {
            document.getElementById('numAleatorio').style.backgroundColor = colores.verde;
            document.getElementById('numAleatorio').style.opacity = 100;
            circleElements[0].style.backgroundColor = 'green';
        } else if (rojo.includes(numeroAleatorio)) {
            document.getElementById('numAleatorio').style.backgroundColor = colores.rojo;
            document.getElementById('numAleatorio').style.opacity = 100;
            circleElements[0].style.backgroundColor = 'red';
        } else if (negro.includes(numeroAleatorio)) {
            document.getElementById('numAleatorio').style.backgroundColor = colores.negro;
            document.getElementById('numAleatorio').style.opacity = 100;
            circleElements[0].style.backgroundColor = 'black';
        }

        // Actualizar los números en los círculos
        for (var i = circleElements.length - 1; i > 0; i--) {
            circleElements[i].textContent = circleElements[i - 1].textContent;
        }

        circleElements[0].textContent = numeroAleatorio;

        // Actualizar los colores de los círculos
        circleElements.forEach((circle, index) => {
            var number = parseInt(circle.textContent);
            if (number === 0) {
                circle.style.backgroundColor = 'green';
            } else if (rojo.includes(number)) {
                circle.style.backgroundColor = 'red';
            } else if (negro.includes(number)) {
                circle.style.backgroundColor = 'black';
            }
        });

        if (apuestas.length > 0) {
            apuestas.forEach(apuesta => {
                console.log(apuesta.casilla);
                if (apuesta.casilla == numeroAleatorio) {
                    ganancia = ganancia + (apuesta.valor * 36);
                } else if (apuesta.casilla === 'Rojo' && rojo.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                } else if (apuesta.casilla === 'Negro' && negro.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                } else if (apuesta.casilla === 'Par' && par.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                } else if (apuesta.casilla === 'Impar' && impar.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                } else if (apuesta.casilla === '1-12' && docena1.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '13-24' && docena2.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '25-36' && docena3.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '1ºFila' && fila1.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '2ºFila' && fila2.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '3ºFila' && fila3.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 3);
                } else if (apuesta.casilla === '1-18' && mitad1.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                } else if (apuesta.casilla === '19-36' && mitad2.includes(numeroAleatorio)) {
                    ganancia = ganancia + (apuesta.valor * 2);
                }

                console.log(ganancia);
            });
        }
        saldo = saldo + ganancia;
        actualizarSaldo();
        mostrarGanancia(ganancia);
        document.getElementById('numAleatorio').innerHTML = numeroAleatorio;
        apuestas.splice(0, apuestas.length);
        apuestaLabel.textContent = `Apuesta: 0.00€`;
        cantidadApostada = 0;
    });
});


function mostrarGanancia(ganancia) {
    var gananciaElement = document.getElementById('ganancia');
    gananciaElement.innerHTML = `Ganancia: ${ganancia.toFixed(2)}€`;
}

function Apuesta(valor, casilla) {
    this.valor = valor;
    this.casilla = casilla;
}

// Función para actualizar el saldo en el HTML
function actualizarSaldo() {
    saldoElement.textContent = `Saldo: ${saldo.toFixed(2)} €`;
    saldoDatosElement.textContent = `Saldo: ${saldo.toFixed(2)} €`;
}

// Evento al confirmar el depósito
depositarBtn.addEventListener('click', function() {
    var inputDepositar = document.querySelector('#depositarModal input.inpuntModal');
    var cantidad = parseFloat(inputDepositar.value);

    if (!isNaN(cantidad) && cantidad > 0) {
        saldo += cantidad;
        actualizarSaldo();
    }

    inputDepositar.value = ''; // Limpiar input después de depositar
});

// Evento al confirmar el retiro
retirarBtn.addEventListener('click', function() {
    var inputRetirar = document.querySelector('#retirarModal input.inpuntModal');
    var cantidad = parseFloat(inputRetirar.value);

    if (!isNaN(cantidad) && cantidad > 0 && saldo >= cantidad) {
        saldo -= cantidad;
        actualizarSaldo();
    } else if (isNaN(cantidad)) {
        alert('Por favor, ingresa una cantidad válida');
    } else if (saldo < cantidad) {
        alert('No tienes suficiente saldo para retirar esa cantidad');
    }

    inputRetirar.value = ''; // Limpiar input después de retirar
});
