import React, { PureComponent } from 'react'
import { Image } from 'react-native'
import { sprites } from '../../config'

export default class Sprite extends PureComponent {
    static defaultProps = {
        width: 50
    }

    get image() {
        const { image } = this.props
        return sprites[`${image}`]
    }

    render() {
        const { width, color, style } = this.props
        
        // Auto height
        //const source = Image.resolveAssetSource(img)
        //const height = width / (source.width / source.height)
        return <Image source={this.image} style={{width, height: width, tintColor: color, ...style}}/>
    }
}
