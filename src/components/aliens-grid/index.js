import React, { PureComponent } from 'react'
import Alien from '../alien'

export default class AliensGrid extends PureComponent {
    state = {
        variant: 2
    }

    componentDidUpdate(prevProps, prevState) {
        // Non cambia il variant se un alieno è stato eliminato
        if (prevProps.config.length === this.props.config.length) {
            this.setState({ variant: prevState.variant === 2 ? 1 : 2 })
        }
    }

    renderAliens() {
        const { variant } = this.state
        const { config } = this.props

        return config.map((el, ind) => (
            <Alien key={el.id} id={el.id} type={el.t} variant={variant} left={el.x} bottom={el.y} />
        ))
    }

    render() {
        return this.renderAliens()
    }
}