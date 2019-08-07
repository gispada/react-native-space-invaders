import React, { PureComponent } from 'react'
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, Animated, Easing } from 'react-native'
import Sprite from '../sprite'
import options from '../../config'

const cannonHalf = options.cannonSize / 2

export default class Controls extends PureComponent {
    constructor(props) {
        super(props)
        this.scrollView = React.createRef()
        this.cannonXPosition = this.props.width / 2
        this.translateY = new Animated.Value(0)
        this.opacity = new Animated.Value(1)
        this.coolDown = false
    }

    componentDidMount() {
        const { width } = this.props
        // Centra il cannone
        // Senza timeout non chiama scrollTo.. perché?
        setTimeout(() => this.scrollView.current.scrollTo({ x: width / 2 - cannonHalf, y: 0, animated: false }), 250)
        Animated.timing(
            this.translateY,
            {
                toValue: -options.cannonSize,
                easing: Easing.bezier(.04, .38, .18, .93),
                delay: 200,
                duration: 600,
                useNativeDriver: true
            }
        ).start()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.lives > 0 && prevProps.lives !== this.props.lives) {
            // Effetto lampeggiante quando il cannone viene colpito
            Animated.sequence([
                Animated.timing(this.opacity, {
                    toValue: 0.2,
                    easing: Easing.linear,
                    duration: 80,
                    useNativeDriver: true
                }),
                Animated.timing(this.opacity, {
                    toValue: 1,
                    easing: Easing.linear,
                    duration: 80,
                    useNativeDriver: true
                })
            ]).start()
        }
    }

    fire = () => {
        const { fire } = this.props

        // Prima della scadenza del periodo di cool down non si può sparare
        if (!this.coolDown) {
            fire({ x: this.cannonXPosition, y: options.cannonSize })
            this.coolDown = true
            setTimeout(() => this.coolDown = false, options.rocketCoolDown)
        }
    }

    calculateCannonPosition(offset) {
        const { width, updatePlayerPosition } = this.props
        const currentPosition = (width - options.cannonSize) - offset
        this.cannonXPosition = currentPosition
        // Posizione cannone: offset da inizio schermo a sinista fino a lato sinistro della view
        updatePlayerPosition(this.cannonXPosition)
    }

    render() {
        const { width, height } = this.props

        const animatedStyle = { transform: [{ translateY: this.translateY }] }
        const touchableArea = [styles.innerView, { width: width * 2 - options.cannonSize }]

        return (
            <Animated.View style={[styles.base, { height: height / 2, ...animatedStyle }]}>
                <ScrollView
                    ref={this.scrollView}
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    overScrollMode='never'
                    decelerationRate={0.01}
                    scrollEventThrottle={50}
                    onScroll={({ nativeEvent }) => this.calculateCannonPosition(nativeEvent.contentOffset.x)}
                >
                    <TouchableWithoutFeedback onPress={this.fire}>
                        <View style={touchableArea}>
                            <Animated.View style={[styles.flashView, { opacity: this.opacity }]} >
                                <Sprite image='cannon' width={options.cannonSize} />
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </Animated.View >
        )
    }
}

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        bottom: -options.cannonSize,
        left: 0,
        zIndex: 2
    },
    innerView: {
        //backgroundColor: 'orangered',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    flashView: {
        // Senza background su Android non fa l'animazione alla prima chiamata a cDU (!?)
        backgroundColor: 'rgba(0,0,0,0)'
    }
})