import React, { PureComponent } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native'
import Sprite from '../sprite';

export default class ControlsArea extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            width: this.props.width,
            translateX: new Animated.Value(0),
            position: { x: 0, y: 0 } // TODO Invece di usare ref e measure, prendere la posizione dallo stato
        }

        this.cannonRef = React.createRef()

        this._panResponder = PanResponder.create({

            // Il pan responder è attivo, ma risponde solo allo scrolling (?)
            onMoveShouldSetPanResponder: (e, gestureState) => true,

            // A inizio scrolling imposta un offset per partire dall'ultima posizione, e non dal centro
            onPanResponderGrant: (e, gestureState) => {
                this.state.translateX.setOffset(this.state.translateX._value)
            },

            // Allo scrolling prende il valore dello spostamento sull'asse X, che sarà usato in un transform
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.moveX > 25 && gestureState.moveX < (this.state.width - 25)) {
                    this.state.translateX.setValue(gestureState.dx)
                } else {
                    // Se va fuori schermo, imposta un dX più o meno pari a metà cannone per riportarlo dentro
                    const safeDx = gestureState.dx + (gestureState.dx < 0 ? 25 : -25)
                    this.state.translateX.setValue(safeDx)
                }
                //const boundaries = this._calcBoundaries(e.nativeEvent.locationX)
            },

            // A fine scrolling, aggiunge l'offset al valore finale e lo reimposta a 0
            onPanResponderRelease: (e, gestureState) => {
                this.state.translateX.flattenOffset()
                this.props.updatePlayerPosition(gestureState.moveX-25)
            }

        })
    }

    // TODO eliminare
    afire = () => {
        const { fire, height } = this.props
        //console.log(this.cannonRef.current)

        // Passa a fire() la posizione del cannone, per sincronizzare il proiettile
        this.cannonRef.current.measure((x, y, elWidth, elHeight, pageX, pageY) => {
            fire({ x: pageX, y: height - pageY })
        })
    }

    render() {
        const { translateX } = this.state
        const { height, winner } = this.props

        console.log('Controls rendered')

        // Il dx è passato a transform, per traslare la View del valore dx
        const viewStyle = { transform: [{ translateX }] }

        return (
            <View style={[styles.outer, { height: height / 2 }]}>

                {/* Area in cui è possibile sparare al touch */}
                <TouchableWithoutFeedback onPress={this.afire}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>

                {/* Area in cui muovere il cannone; qui solo un touch sul cannone spara */}
                <View style={styles.inner}>

                    <Animated.View style={viewStyle} {...this._panResponder.panHandlers}>
                        <TouchableWithoutFeedback onPress={this.afire}>
                            <View ref={this.cannonRef}>
                                {winner !== 2 && <Sprite image='cannon'/>}
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    outer: {
        //backgroundColor: 'green',
        position: 'absolute',
        justifyContent: 'flex-end',
        bottom: 4,
        left: 0,
        right: 0,
        zIndex: 2
    },
    inner: {
        //backgroundColor: 'red',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
})