import React, { PureComponent } from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import Scores from '../scores'
import ControlsArea from '../controls-area'
import AliensGrid from '../aliens-grid'
import Rocket from '../rocket'
import Sky from '../sky'
import Explosion from '../explosion'

export default class GameView extends PureComponent {

    render() {
        const {
            score,
            highest,
            aliens,
            fire,
            fireStatus,
            source,
            width,
            height,
            animationEnded,
            updateScore,
            removeAlien,
            explosion,
            clearExplosion
        } = this.props

        return (
            <View style={styles.base}>

                <StatusBar barStyle='light-content' />

                <View style={styles.container}>

                    <Scores score={score} highest={highest} />

                    <AliensGrid config={aliens} width={width} height={height} />

                    {explosion.length > 0 && <Explosion variant='1' position={explosion} onEnd={clearExplosion}/>}

                    {fireStatus &&
                        <Rocket
                            aliens={aliens}
                            limit={height}
                            source={source}
                            animationEnded={animationEnded}
                            updateScore={updateScore}
                            removeAlien={removeAlien}
                        />
                    }

                    <ControlsArea fire={fire} width={width} height={height} />

                </View>

                <Sky width={width} height={height} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        //backgroundColor: 'orangered',
        paddingTop: 30,
        flex: 1,
        zIndex: 1
    }
})