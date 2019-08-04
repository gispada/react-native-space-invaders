import React from 'react'
import { View, StyleSheet } from 'react-native'
import options from '../../config'

const Star = props => {

    const { position, luminosity } = props

    const allStyles = [
        styles.base,
        {
            top: position.y,
            left: position.x,
            backgroundColor: `rgba(255, 255, 255, ${luminosity})`
        }
    ]

    return <View style={allStyles}/>

}

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        height: options.starSize,
        width: options.starSize
    }
})

export default Star