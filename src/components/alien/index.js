import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Sprite from '../sprite'

export default class Alien extends PureComponent {
    static defaultProps = {
        width: 40
    }

    get type() {
        const { type, variant } = this.props
        return `alien${type}_${variant}`
    }

    render() {
        const { width, left, bottom } = this.props

        const dynamicStyles = [styles.base, { left, bottom }]

        return (
            <View style={dynamicStyles}>
                <Sprite image={this.type} width={width} />
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