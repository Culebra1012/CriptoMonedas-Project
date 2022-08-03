const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedasSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario');

const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}
//Crear un Promise

const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)
})



document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario);
    monedasSelect.addEventListener('change', leerValor);

    criptomonedasSelect.addEventListener('change', leerValor)
})

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const { FullName, Name }   = cripto.CoinInfo;
        
        const Option = document.createElement('option');
        Option.value = Name;
        Option.textContent = FullName;
        criptomonedasSelect.appendChild(Option)
    })
}

function leerValor(e){
   objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validación

    const { moneda, criptomoneda } = objBusqueda;
    if(moneda === '' || criptomoneda === '' ) {
        mostrarAlerta('Ambos campos son obligatorios')   
        return; 
    }

    //Consultar la API para ontener la información
    consultarAPI()
}

function mostrarAlerta(msg){
    
    const divMensaje = document.createElement('div')
    divMensaje.classList.add('error');


    //mensaje de error
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);
    
    setTimeout(() => {
        divMensaje.remove()
    }, 3000);
}

function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })
}
function mostrarCotizacionHTML(cotizacion){

    limpiarHTML()
    
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima actualización <span>${LASTUPDATE}</span>`

    

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }    
}