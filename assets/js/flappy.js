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
      const meio = largura / 2
      const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() == meio
      if(cruzouOMeio) {
        notificarPontuacao()
      }
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
function Progresso(){
  this.elemento = criandoElemento('span','progresso')
  this.atualizarPontos = pontos => {
    this.elemento.innerHTML = pontos
  }
  this.atualizarPontos(0)
}
function estaoSobrepostos(elementoA,elementoB){
  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
  return horizontal && vertical
}
function colidiu(passaro, barreiras) {
  let colidiu = false
  barreiras.pares.forEach(parDeBarreiras => {
      if (!colidiu) {
          const superior = parDeBarreiras.superior.elemento
          const inferior = parDeBarreiras.inferior.elemento
          colidiu = estaoSobrepostos(passaro.elemento, superior)
              || estaoSobrepostos(passaro.elemento, inferior)
      }
  })
  return colidiu
}
function Flappy(){
  let pontos = 0
    const flappy = document.querySelector('.flappy')
    const altura = flappy.clientHeight
    const largura = flappy.clientWidth
    const progresso = new Progresso
    const barreiras = new Barreiras(altura,200,largura,450,() => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    flappy.appendChild(progresso.elemento)
    flappy.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => flappy.appendChild(par.elemento))
    this.start = () => {
      const temporizador = setInterval(() => {
        barreiras.animar()
        passaro.animar()
        if(colidiu(passaro,barreiras)){
          clearInterval(temporizador)
        }
      },20)
    }
}
new Flappy().start()

