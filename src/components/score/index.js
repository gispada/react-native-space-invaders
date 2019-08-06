import React, { PureComponent } from 'react'
import Heading from '../heading'

export default class Score extends PureComponent {
    get formattedPoints() {
        const { points } = this.props
        return points.toString().padStart(4, '0')
    }

    render() {
        const { label } = this.props

        return <Heading upperCase>{label}: <Heading color='#22cc00'>{this.formattedPoints}</Heading></Heading>
    }
}