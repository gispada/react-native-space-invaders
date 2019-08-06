import React, { PureComponent } from 'react'
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, Animated, Easing } from 'react-native'
import Sprite from '../sprite'
import options from '../../config'

export default class Controls extends PureComponent {
    constructor(props) {
        super(props)
        this.scrollView = React.createRef()
        this.cannonXPosition = 0
        this.translateY = new Animated.Value(0)
    }

    componentDidMount() {
        // Centra il cannone
        // Senza timeout non chiama scrollTo.. perché?
        setTimeout(() => this.scrollView.current.scrollTo({ x: this.props.width / 2 - 25, y: 0, animated: false }), 200)
        Animated.timing(
            this.translateY,
            {
                toValue: -50,
                easing: Easing.bezier(.04, .38, .18, .93),
                delay: 200,
                duration: 600,
                useNativeDriver: true
            }
        ).start()
    }

    afire = () => {
        const { fire } = this.props

        // Passa a fire() la posizione del cannone, per sincronizzare il proiettile
        if (!this.coolDown) {
            fire({ x: this.cannonXPosition, y: 50 })
            this.coolDown = true
            setTimeout(() => this.coolDown = false, options.rocketCoolDown)
        }

    }

    calculateCannonPosition(offset) {
        const { width, updatePlayerPosition } = this.props
        const currentPosition = (width - 50) - offset
        this.cannonXPosition = currentPosition
        updatePlayerPosition(this.cannonXPosition)
    }

    render() {
        const { width, height, winner } = this.props

        console.log('Controls rendered')

        const animatedStyle = { transform: [{ translateY: this.translateY }] }
        const sidePaddingStyle = [styles.sidePaddingBase, { width: width - 50 }]

        return (
            <Animated.View style={[styles.base, { height: height / 2, ...animatedStyle }]}>
                <ScrollView
                    ref={this.scrollView}
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    overScrollMode='never'
                    decelerationRate={0.01}
                    contentContainerStyle={styles.scrollViewContainer}
                    scrollEventThrottle={50}
                    onScroll={({ nativeEvent }) => this.calculateCannonPosition(nativeEvent.contentOffset.x)}

                >
                    <View style={sidePaddingStyle} />

                    {winner !== 2 && <Sprite image='cannon' />}

                    <View style={sidePaddingStyle} />

                </ScrollView>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        alignItems: 'flex-end'
    },
    sidePaddingBase: {
        height: 50,
        //backgroundColor: 'orangered'
    },
    base: {
        //backgroundColor: 'green',
        position: 'absolute',
        bottom: -50,
        left: 0,
        zIndex: 2
    }
})