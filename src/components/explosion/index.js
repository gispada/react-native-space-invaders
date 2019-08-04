import React, { PureComponent } from 'react'
import Sprite from '../sprite'

export default class Explosion extends PureComponent {

    componentDidMount() {
        const { onEnd } = this.props
        setTimeout(() => { onEnd() }, 400)
    }

    render() {
        const { variant, position } = this.props

        return (
            <Sprite
                image={`explosion${variant}`}
                style={{position: 'absolute', left: position[0], bottom: position[1]}}
            />
        )
    }
}