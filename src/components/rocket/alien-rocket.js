import React, { PureComponent } from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import options from '../../config'

export default class AlienRocket extends PureComponent {
    /*
     * Gli alieni sparano verso il basso, la posizione del razzo è ricavata a partire dal valore di translateY
     * Posizione di partenza: valore da bottom (compensato)
     * Movimento: translate positivo verso il basso, convertito come se fosse bottom: +x
     * Posizione giocatore: valore da bottom
     * CollisioneY: quando razzoY < giocatoreY
     */

    state = {
        translateY: new Animated.Value(0),
        // x statica, qui per evitare di assegnarla a una costante nelle varie iterazioni del for di checkCollision
        xPosition: this.props.rocketData.x + (options.alienSize / 2) - 2.5 // metà larghezza missile
    }

    componentDidMount() {
        const { translateY } = this.state
        const { limit, removeRocket, rocketData } = this.props

        this.rocketListener = translateY.addListener(({ value }) => {
            this.checkCollisions(Math.abs(value))
        })

        Animated.timing(
            this.state.translateY,
            {
                // Quanto translate usare per arrivare giù, dipende dalla posizione iniziale del razzo
                toValue: limit - (limit - rocketData.y),
                easing: Easing.linear,
                // Durata minore al discendere degli alieni, perché il missile ha meno spazio da percorrere
                duration: options.rocketSpeed * Math.sqrt(rocketData.y / limit),
                useNativeDriver: true
            }
        ).start(() => removeRocket(rocketData.id)) // A fine animazione, rimuove il razzo
    }

    checkCollisions(position) {
        const { translateY, xPosition: rocketXPosition } = this.state
        const { playerXPosition, rocketData, limit, updateLives } = this.props

        // position è relativo, parte da 0 rispetto alla posizione di spawn del missile; bisogna compensare
        // Nel caso degli alieni, converte la posizione da top: +x a bottom: +x
        const rocketYPosition = limit - (position + (limit - rocketData.y))

        // Prima di arrivare al cannone, non serve controllare
        if (rocketYPosition > options.cannonSize + 20) return
        
        const y2Threshold = options.cannonSize // sopra: altezza del cannone dal basso, che rimane fissa
        const x1Threshold = playerXPosition // sinistra
        const x2Threshold = x1Threshold + options.cannonSize // destra
        
        // COLPITO!
        if (rocketYPosition < y2Threshold && rocketXPosition > x1Threshold && rocketXPosition < x2Threshold) {
            translateY.removeListener(this.rocketListener)
            translateY.stopAnimation()
            updateLives()
        }
    }

    render() {
        const { translateY, xPosition } = this.state
        const { rocketData } = this.props
        
        const animatedStyle = {
            transform: [{ translateY }],
            bottom: rocketData.y - 15, // altezza missile
            left: xPosition
        }

        return <Animated.View style={[styles.base, animatedStyle]} />
    }
}

const styles = StyleSheet.create({
    base: {
        width: 5,
        height: 15,
        backgroundColor: 'red',
        position: 'absolute'
    }
})