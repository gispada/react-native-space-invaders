import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Sprite from '../sprite'

export default class Alien extends PureComponent {
    static defaultProps = {
        width: 40
    }

    state = {
        exploded: false
    }

    componentDidUpdate(prevProps, prevState) {
        // Solo quando un alieno diventa inattivo...
        if (prevProps.inactive !== this.props.inactive) {
            this.explosionTimeout = setTimeout(() => {
                this.setState(
                    { exploded: true }, // ...dopo x secondi l'esplosione sparisce...
                    () => clearTimeout(this.explosionTimeout) // ...e a quel punto, distrugge il timeout
                )
            }, 600)
        }
    }

    get getAlienType() {
        const { type, variant } = this.props
        return `alien${type}_${variant}`
    }

    get explode() {
        const { exploded } = this.state
        const { width } = this.props
        // Se è già esploso, niente
        return exploded ? null : <Sprite image='explosion1' width={width} />
    }

    render() {
        const { width, left, bottom, inactive } = this.props

        const dynamicStyles = [styles.base, { left, bottom }]

        return (
            <View style={dynamicStyles}>
                {inactive ? this.explode : <Sprite image={this.getAlienType} width={width} />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'blue'
    }
})