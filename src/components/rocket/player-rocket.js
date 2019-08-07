import React, { PureComponent } from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import options from '../../config'

const offset = {
    bottom: options.alienSize - (options.alienSize * 0.8),
    top: options.alienSize * 0.8
}

export default class PlayerRocket extends PureComponent {
    /*
     * Il giocatore spara verso l'alto, la posizione del razzo è ricavata a partire dal valore di translateY
     * Posizione di partenza: valore da bottom (compensato con altezza del cannone)
     * Movimento: translate negativo verso l'alto, come se fosse bottom: +x
     * Posizione alieni: valore da bottom
     * CollisioneY: quando razzoY > alienoY1 e razzoY < alienoY2
     */

    state = {
        translateY: new Animated.Value(0),
        // x statica, qui per evitare di assegnarla a una costante nelle varie iterazioni del for di checkCollision
        xPosition: this.props.rocketData.x + (options.cannonSize / 2) - 2.5
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
                toValue: -limit,
                easing: Easing.linear,
                duration: options.rocketSpeed,
                useNativeDriver: true
            }
        ).start(() => removeRocket(rocketData.id)) // A fine animazione, rimuove il razzo
    }

    checkCollisions(position) {
        const { translateY, xPosition: rocketXPosition } = this.state
        const { aliens, rocketData, updateScore, removeAlien } = this.props

        // A fine partita, con alieni a 0, se c'è ancora un missile su schermo, disattivare il controllo
        if (!aliens.length) {
            translateY.removeListener(this.rocketListener)
            return
        }

        // position è relativo, parte da 0 rispetto alla posizione di spawn del missile; bisogna compensare
        const rocketYPosition = position + rocketData.y + 15 // altezza missile
        const firstAlien = aliens[0]
        const lastAlien = aliens[aliens.length - 1]

        // Se il missile non è ancora arrivato agli alieni, salta i controlli
        if (rocketYPosition < firstAlien.y - 10) return

        // Se il missile supera l'ultimo alieno senza colpire, non serve più controllare le collisioni
        if (rocketYPosition > lastAlien.y + (options.alienSize - 10)) {
            translateY.removeListener(this.rocketListener)
            return
        }

        for (let i = 0; i < aliens.length; i++) {
            /*
             *    1___y2___
             *    |        |
             *  x1|        |x2
             *    |________|
             *    0   y1   1
             */
            const y1Threshold = aliens[i].y + offset.bottom // sotto
            const y2Threshold = y1Threshold + offset.top // sopra
            const x1Threshold = aliens[i].x // sinistra
            const x2Threshold = x1Threshold + options.alienSize // destra

            // COLPITO!
            // Controlla se il missile è dentro l'hit box dell'alieno (Y1 < missile < Y2 e X1 < missile < X2)
            if (rocketYPosition > y1Threshold && rocketYPosition < y2Threshold && rocketXPosition > x1Threshold && rocketXPosition < x2Threshold) {
                translateY.removeListener(this.rocketListener)
                translateY.stopAnimation()
                removeAlien(aliens[i].id)
                updateScore()
                break
            }
        }
    }

    render() {
        const { translateY, xPosition } = this.state
        const { rocketData } = this.props
        const animatedStyle = { transform: [{ translateY }], bottom: rocketData.y - 10, left: xPosition }

        return <Animated.View style={[styles.base, animatedStyle]} />
    }
}

const styles = StyleSheet.create({
    base: {
        width: 5,
        height: 15,
        backgroundColor: options.mainColor,
        position: 'absolute'
    }
})