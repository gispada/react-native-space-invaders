import React from 'react'
import { View, StyleSheet } from 'react-native'
import Score from '../score'

const Scores = props => {
    
    const { score, highest } = props

    return (
        <View style={styles.base}>
            <Score label='score' points={score}/>
            <Score label='hi-score' points={highest}/>
        </View>
    )
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default Scores