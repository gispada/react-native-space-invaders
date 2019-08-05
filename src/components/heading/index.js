import React, { PureComponent } from 'react'
import { Text, StyleSheet, Platform } from 'react-native'

export default class Heading extends PureComponent {
    static defaultProps = {
        color: '#fdfdfd'
    }
    
    render() {
        const { children, color, style, upperCase } = this.props

        const allStyles = [
            styles.base,
            { color, textTransform: upperCase ? 'uppercase' : 'none', ...style }
        ]

        return <Text style={allStyles}>{children}</Text>
    }
}

const styles = StyleSheet.create({
    base: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 18
    }
})