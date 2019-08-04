import React, { PureComponent } from 'react'
import { Text, StyleSheet, Platform } from 'react-native'

export default class Heading extends PureComponent {
    render() {
        const { children } = this.props

        return <Text style={styles.base}>{children}</Text>
    }
}

const styles = StyleSheet.create({
    base: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        color: '#fdfdfd',
        textTransform: 'uppercase',
        fontSize: 18
    }
})