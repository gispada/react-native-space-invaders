import React, { PureComponent } from 'react'
import { View, StatusBar, StyleSheet, SafeAreaView, Platform } from 'react-native'
import Controls from '../controls'
import AliensGrid from '../aliens-grid'
import PlayerRocket from '../rocket/player-rocket'
import AlienRocket from '../rocket/alien-rocket'
import Sky from '../sky'
import Explosion from '../explosion'
import UpperBar from '../upper-bar'

export default class GameView extends PureComponent {

    renderRockets() {
        const { rockets, aliens, height, removeAlien, removeRocket, updateScore, playerXPosition, updateLives } = this.props

        return rockets.map(el => (
            el.player === 1 ?
                <PlayerRocket key={el.id} aliens={aliens} limit={height} rocketData={el} removeRocket={removeRocket} updateScore={updateScore} removeAlien={removeAlien} />
                :
                <AlienRocket key={el.id} playerXPosition={playerXPosition} limit={height} rocketData={el} removeRocket={removeRocket} updateLives={updateLives} />
        ))
    }

    render() {
        const {
            score,
            highest,
            aliens,
            fire,
            width,
            height,
            explosion,
            clearExplosion,
            updatePlayerPosition,
            lives,
            winner,
            exit
        } = this.props

        return (
            <SafeAreaView style={styles.base}>

                <StatusBar barStyle='light-content' />

                <View style={styles.container}>

                    <UpperBar score={score} highest={highest} lives={lives} onButtonPress={exit}/>

                    <AliensGrid config={aliens} width={width} height={height} />

                    {explosion.length > 0 &&
                        <Explosion
                            variant={explosion[1] === 0 ? '2' : '1'} // Solo il cannone ha y = 0
                            position={explosion}
                            onAnimationEnd={clearExplosion}
                        />
                    }

                    {this.renderRockets()}

                    {winner !== 2 && <Controls fire={fire} width={width} height={height} updatePlayerPosition={updatePlayerPosition} lives={lives}/>}
                    
                </View>

                <Sky width={width} height={height} />

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#000',
        flex: 1
    },
    container: {
        //backgroundColor: 'orangered',
        paddingTop: Platform.OS === 'ios' ? 4 : 24,
        flex: 1,
        zIndex: 1
    }
})