import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import Score from '../score'

export default class Scores extends PureComponent {
    render() {
        const { score, highest, style } = this.props

        return (
            <View style={[styles.base, { ...style }]}>
                <Score label='score' points={score} />
                <Score label='hi-score' points={highest} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})