import React, { PureComponent } from 'react'
import Sprite from '../sprite'
import options from '../../config'

export default class Explosion extends PureComponent {

    componentDidMount() {
        const { onAnimationEnd } = this.props
        this.explosion = setTimeout(() => { onAnimationEnd() }, options.explosionDuration)
    }

    componentWillUnmount() {
        clearTimeout(this.explosion)
    }

    render() {
        const { variant, position } = this.props

        return (
            <Sprite
                image={`explosion${variant}`}
                style={{ position: 'absolute', left: position[0], bottom: position[1] }}
                width={variant === '1' ? options.alienSize : options.cannonSize}
            />
        )
    }
}