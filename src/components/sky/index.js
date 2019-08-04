import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Star from './star'
import options from '../../config'

export default class Sky extends PureComponent {

    get renderStars() {
        const { width, height } = this.props

        return Array(options.numberOfStars).fill(0).map((el, id) => {
        
            const position = {
                x: Math.random() * width,
                y: Math.random() * height
            }

            // Genera un numero tra 0.3 e 1
            const luminosity = (Math.random() * 0.7 + 0.3).toFixed(2)

            return <Star key={id} position={position} luminosity={luminosity}/>

        })
    }

    render() {

        return (
            <View style={styles.base}>
                {this.renderStars}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        ...StyleSheet.absoluteFill,
        backgroundColor: '#000',
    }
})