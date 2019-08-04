import React, { PureComponent } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Alien from '../alien'

export default class AliensGrid extends PureComponent {
    state = {
        variant: 2
    }

    componentDidUpdate(prevProps, prevState) {
        // Non cambia il variant se un alieno è stato eliminato
        if (prevProps.config.length === this.props.config.length) {
            this.setState({variant: prevState.variant === 2 ? 1 : 2})
        }
    }

    get renderAliens() {
        const { variant } = this.state
        const { config, width, height } = this.props

        return config.map((el, ind) => (
            <Alien
                key={el.id}
                type={el.t}
                variant={variant}
                left={el.x}
                bottom={el.y}
                id={el.id}
                inactive={el.inactive}
            />
        ))
    }

    render = () => this.renderAliens
}

const styles = StyleSheet.create({
    base: {
        //backgroundColor: 'green'
    }
})