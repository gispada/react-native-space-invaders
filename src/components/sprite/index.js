import React, { PureComponent } from 'react'
import { Image } from 'react-native'

const sprites = {
    cannon: require('../../../assets/512/cannon.png'),
    explosion1: require('../../../assets/512/explosion1.png'),
    explosion2: require('../../../assets/512/explosion2.png'),
    alien1_1: require('../../../assets/512/alien1_1.png'),
    alien1_2: require('../../../assets/512/alien1_2.png'),
    alien2_1: require('../../../assets/512/alien2_1.png'),
    alien2_2: require('../../../assets/512/alien2_2.png'),
    alien3_1: require('../../../assets/512/alien3_1.png'),
    alien3_2: require('../../../assets/512/alien3_2.png')
}

export default class Sprite extends PureComponent {
    static defaultProps = {
        width: 50
    }

    get getSprite() {
        const { image } = this.props
        return sprites[`${image}`]
    }

    render() {
        const { width, tintColor, style } = this.props
        
        // Auto height
        //const source = Image.resolveAssetSource(img)
        //const height = width / (source.width / source.height)
        return <Image source={this.getSprite} style={{width, height: width, tintColor, ...style}}/>
    }
}
