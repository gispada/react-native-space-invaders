import React, { PureComponent } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'
import options from '../../config'

export default class Rocket extends PureComponent {
    state = {
        translateY: new Animated.Value(0),
        // x statica, qui per evitare di assegnarla a una costante nelle varie iterazioni del for di checkCollision
        xPosition: this.props.source.x + 22
    }

    componentDidMount() {
        const { translateY } = this.state
        const { limit, animationEnded } = this.props

        //console.log('Rocket mounted')

        this.rocketListener = translateY.addListener(({ value }) => {
            //console.log(value)
            this.checkCollisions(Math.abs(value))
        })

        Animated.timing(
            this.state.translateY,
            {
                toValue: -limit,
                easing: Easing.linear(),
                duration: options.rocketSpeed,
                useNativeDriver: true
            }
        ).start(() => animationEnded())
    }

    componentWillUnmount() {
        //console.log('Rocket unmounted')
    }

    checkCollisions(position) {
        const { translateY, xPosition: rocketXPosition } = this.state
        const { aliens, source, updateScore, removeAlien } = this.props

        // position è relativo, parte da 0 rispetto alla posizione di spawn del missile; bisogna compensare
        const rocketYPosition = position + source.y
        const lastAlien = aliens[aliens.length - 1]

        // Se il missile supera l'ultimo alieno senza colpire, non serve più controllare le collisioni
        if (rocketYPosition > lastAlien.y + 40) {
            translateY.removeListener(this.rocketListener)
            return
        }

        for (let i = 0; i < aliens.length; i++) {
            if (aliens[i].inactive) continue // Se è già morto, non controlla le collisioni
            /*
             *    1___y2___
             *    |        |
             *  x1|        |x2
             *    |________|
             *    0   y1   1
             */
            const y1Threshold = aliens[i].y // sotto
            const y2Threshold = y1Threshold + 40 // sopra
            const x1Threshold = aliens[i].x + 3 // sinistra
            const x2Threshold = x1Threshold + 43 // destra

            // COLPITO!
            // Controlla se il missile è dentro l'hit box dell'alieno (Y1 < missile < Y2 e X1 < missile < X2)
            if (rocketYPosition > y1Threshold && rocketYPosition < y2Threshold && rocketXPosition > x1Threshold && rocketXPosition < x2Threshold) {
                //alert ('HIT' + aliens[i].id)
                translateY.removeListener(this.rocketListener)
                translateY.stopAnimation()
                removeAlien(aliens[i].id)
                updateScore()
                break
            }
        }
    }

    render() {
        const { translateY } = this.state
        const { source } = this.props
        const animatedStyle = { transform: [{ translateY }], bottom: source.y, left: source.x + 22 }

        return <Animated.View style={[styles.base, animatedStyle]} />
    }
}

// onLayout={({nativeEvent}) => {console.log(nativeEvent.layout)} }

const styles = StyleSheet.create({
    base: {
        width: 5,
        height: 15,
        backgroundColor: 'green',
        position: 'absolute'
    }
})