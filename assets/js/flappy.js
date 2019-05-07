function criandoElemento(tagname,classname){
  const elemento = document.createElement(tagname)
  elemento.className = classname
  return elemento
}

function ParBarreira(altura,abertura,x){
  this.elemento = criandoElemento('div','par-de-barreira')
  this.superior = new Barreira(true)
  this.inferior = new Barreira(false)
  this.elemento.appendChild(this.superior.elemento)
  this.elemento.appendChild(this.inferior.elemento)

  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura)
    const alturaInferior = altura - abertura - alturaSuperior
    this.superior.setAltura(alturaSuperior)
    this.inferior.setAltura(alturaInferior)
  }
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = x => this.elemento.style.left = `${x}px`
  this.getLargura = () => this.elemento.clientWidth

  this.sortearAbertura()
  this.setX(x)
}

function Barreira(reverse = false){
  this.elemento = criandoElemento('div','barreira')
  const borda = criandoElemento('div', 'barreira-borda')
  const corpo = criandoElemento('div','barreira-corpo')
  this.elemento.appendChild(reverse ? corpo : borda)
  this.elemento.appendChild(reverse ? borda : corpo)
  this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new ParBarreira(500,100,400)
// document.querySelector('.flappy').appendChild(b.elemento)

function Barreiras(altura,abertura,largura,espaco,notificarPontuacao){
  this.pares = [
    new ParBarreira(altura,abertura,largura),
    new ParBarreira(altura,abertura,largura + espaco),
    new ParBarreira(altura,abertura,largura + espaco * 2),
    new ParBarreira(altura,abertura,largura + espaco * 3)
  ]
  const deslocamento = 3
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)
      if(par.getX() < -par.getLargura()){
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }
      // const meio = largura / 2
      // const cruzouOMeio = par.getX() + deslocamento && par.getX() < meio
      // if(cruzouOMeio) {
      //   notificarPontuacao()
      // }
      
    })
  }
}


function Passaro(alturaJogo){
  let voando = false
  this.elemento = criandoElemento('img','passaro')
  this.elemento.src = 'assets/image/passaro.png'
  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
  this.setY = y => this.elemento.style.bottom = `${y}px`
  window.onkeydown = e => voando = true
  window.onkeyup = e => voando = false
  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5)
    const alturaMaxima = alturaJogo - this.elemento.clientHeight
    if (novoY <= 0){
      this.setY(0)
    }
    else if(novoY >= alturaMaxima){
      this.setY(alturaMaxima)
    }
    else{
      this.setY(novoY)
    }
  }
  this.setY(alturaJogo / 2)
}
const passaro = new Passaro(590)
const b = new Barreiras(500,100,1200,450,10)
const flappy = document.querySelector('.flappy')
flappy.appendChild(passaro.elemento)
b.pares.forEach(par => flappy.appendChild(par.elemento))
setInterval(() => {
  b.animar()
  passaro.animar()
},20)