import React from 'react'
import { View } from 'react-native'
import Heading from '../heading'

const Score = props => {
    const { label, points } = props
    
    const formatPoints = () => points.toString().padStart(4, '0')

    return (
        <View>
            <Heading>{label}: {formatPoints()}</Heading>
        </View>
    )
}

export default Score