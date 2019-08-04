import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import GameView from './src/components/game-view'
import options from './src/config'

const { width, height } = Dimensions.get('window')

export default class App extends PureComponent {
  state = {
    winner: 0, // 0: nessuno, 1: giocatore, 2: computer
    speed: options.defaultSpeed,
    score: 0,
    highest: 0,
    fire: false,
    source: {},
    aliens: [],
    explosion: [],
    direction: 1,
    down: false
  }


  componentDidMount() {
    this.initGame()
  }


  componentDidUpdate(prevProps, prevState) {
    const { winner, aliens } = this.state

    // Un alieno in meno, aumentare la velocità
    if (prevState.aliens.length !== 0 && prevState.aliens.length !== aliens.length) {
      clearInterval(this.run)
      // Velocità aumenta di x% rispetto al suo ultimo valore
      const newSpeed = (prevState.speed - (prevState.speed * options.speedMultiplier)).toFixed(0)
      this.setState({ speed: newSpeed }, () => this.run = setInterval(() => this.renderFrame(), newSpeed))
    }

    // C'è un vincitore
    if (winner && prevState.winner !== winner) {
      winner === 1 ? this.victory() : this.gameOver()
    }

  }


  initGame() {
    this.generateAliens()
    this.run = setInterval(() => this.renderFrame(), this.state.speed)
    //this.intervalTimeout = setTimeout(() => this.dynamicInterval(), this.state.speed)
  }


  dynamicInterval() {
    const { speed, winner } = this.state

    if (winner) return
    if (this.intervalTimeout) clearTimeout(this.intervalTimeout)

    this.renderFrame()
    this.intervalTimeout = setTimeout(() => this.dynamicInterval(), speed)
  }


  victory() {
    alert('HAI VINTO')
    //clearTimeout(this.intervalTimeout)
    clearInterval(this.run)
  }


  gameOver() {
    const { score, highest } = this.state
    //clearTimeout(this.intervalTimeout)
    clearInterval(this.run)
    alert('Game over')
    this.setState({ highest: Math.max(score, highest) })
  }


  cloneAliens(source) {
    const destination = []
    source.map(el => {
      //destination.push({ ...el })
      destination.push(Object.assign({}, el))
    })
    return destination
  }


  generateAliens() {
    const aliens = []

    const xOffset = (width - options.aliensHorSpace * 5) / 2 // per centrare gli alieni
    const yOffset = 80

    options.aliensInit.map((el, ind) => {
      for (let i = 0; i < el; i++) {
        const type = ind + 1
        const num = i + 1
        // Un alieno è { id: 't1n1', t: 1, x: 120, y: 40, inactive: false }
        aliens.push(
          {
            id: `t${type}n${num}`,
            t: type,
            x: xOffset + (options.aliensHorSpace * i),
            y: height - (options.aliensVerSpace * (ind + 1)) - yOffset,
            inactive: false
          }
        )
      }
    })
    aliens.reverse() // I primi nell'array devono essere quelli più vicini al basso

    this.setState({ aliens })
  }


  moveAliens(dX, dY) {
    const { aliens, direction } = this.state

    // Con alieni su più file, l'inversione al limite è ripetuta per ogni fila, causando un bug sulla direzione, che viene invertita più volte
    // Il controllo è effettuato quindi solo una volta, se bisogna invertire inutile controllare ancora
    let inversionTrue = false

    // Resetta lo stato down, di default gli alieni non devono scendere
    this.setState({ down: false })

    const clonedAliens = this.cloneAliens(aliens)

    clonedAliens.forEach(el => {
      el.x += dX
      el.y -= dY

      if (inversionTrue) return // Bisogna invertire? Fermarsi, controllare altri alieni non serve

      // Fuori dallo schermo? Invertire! Controllo solo se gli alieni vanno nella stessa direzione del limite
      // per evitare un bug in renderFrame quando si muovono solo verso il basso
      if (direction === 1 && el.x + 60 > width || direction === -1 && el.x < 10) {
        this.setState(prevState => ({ direction: prevState.direction *= -1, down: true }))
        inversionTrue = true
      }

      if (el.y <= 50) this.setState({ winner: 2 })
    })

    return clonedAliens
  }


  renderFrame() {
    const { direction, down } = this.state
    const dX = down ? 0 : options.aliensHorStep * direction
    const dY = down ? options.aliensVerStep : 0

    const aliens = this.moveAliens(dX, dY)

    // Ritorna un nuovo array degli alieni, come FRAME FINALE
    this.setState({ aliens })
  }


  updateScore = () => this.setState(prevState => ({ score: prevState.score + 1 }))


  removeAlien = id => {
    const { aliens } = this.state

    const clonedAliens = this.cloneAliens(aliens)

    const killedAlienInd = clonedAliens.findIndex(el => el.id === id)
    const killedAlienType = clonedAliens[killedAlienInd].t

    // Trova gli alieni successivi nella stessa fila (stesso type di quello morto e index inferiore perché l'array è invertito)
    const nextAliens = clonedAliens.filter((el, ind) => el.id !== id && el.t === killedAlienType && ind < killedAlienInd)

    // Sposta la fila di alieni successivi di un offset pari allo spazio occupato da un alieno
    nextAliens.forEach(el => el.x + options.aliensHorSpace)

    const commonState = {
      aliens: clonedAliens,
      // Coordinate per renderizzare l'esplosione
      explosion: [clonedAliens[killedAlienInd].x, clonedAliens[killedAlienInd].y]
    }

    clonedAliens.splice(killedAlienInd, 1)

    this.setState(clonedAliens.length === 0 ? { ...commonState, winner: 1 } : commonState)
  }


  fire = source => this.setState({ fire: true, source })


  animationEnded = () => this.setState({ fire: false })


  clearExplosion = () => this.setState({ explosion: [] })

  render() {
    const { score, highest, source, fire, aliens, explosion } = this.state

    return (
      <GameView
        width={width} // screen width
        height={height} // screen height
        score={score}
        highest={highest}
        fire={this.fire}
        aliens={aliens}
        fireStatus={fire}
        source={source}
        animationEnded={this.animationEnded}
        updateScore={this.updateScore}
        removeAlien={this.removeAlien}
        explosion={explosion}
        clearExplosion={this.clearExplosion}
      />
    )
  }
}