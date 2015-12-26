import React from 'react'
import ReactDOM from 'react-dom'
import ReactCanvas, { Surface, Image, Text, FontFace, Group, measureText } from 'react-canvas'

import thumbnailer from './thumbnailer'

const FontSize = 14,
      LineHeight = 19,
      MarginX = 15,
      MarginY = 20,
      Width = 159,
      Height = 189,
      FontColor = '#393E45',
      HighlightFontColor = '#FF6666'

function measureTextByStyle(text, style) {
  return measureText(text, style.width, style.fontFace || FontFace.Default(),
    style.fontSize, style.lineHeight)
}

function measureImage(url, callback) {
  let image = document.createElement("img")
  image.src = url
  image.onload = callback
}

export default class Preview extends React.Component {

  state = {}

  componentDidMount() {
    this.measureImage()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.image !== prevProps.image) {
      this.measureImage()
    }
  }

  measureImage() {
    const image = this.props.image,
          self = this
    if (image) {
      measureImage(image, function() {
        var canvas = document.createElement("canvas")
        thumbnailer(canvas, this, Width, 1)

        var image = canvas.toDataURL("image/png")

        self.setState({ ratio: this.height / this.width, image })
      })
    } else {
      self.setState({ image: null })
    }
  }

  save() {
    let canvas = ReactDOM.findDOMNode(this.refs.surface.refs.canvas)
    let anchor = document.createElement("a")
    anchor.href = canvas.toDataURL("image/png")
    anchor.download = `${this.props.exportFilename}.jpg`
    anchor.click()
  }

  calculateStyles() {
    const { advertise, price, width, right, bottom } = this.props

    let imageWidth = this.props.imageWidth
    let imageHeight = imageWidth * this.state.ratio
    let imageStyle = this.imageStyle = {
      top: this.props.imageCenterY - imageHeight / 2,
      left: this.props.imageCenterX - imageWidth / 2,
      width: imageWidth,
      height: imageHeight
    }

    let advertiseStyle = this.advertiseStyle = {
      fontSize: FontSize,
      lineHeight: LineHeight,
      color: FontColor,
      top: MarginY,
      left: MarginX,
      width: Width,
      height: LineHeight * 2,
      zIndex: 1
    }

    let advertiseMetrics = measureTextByStyle(advertise, advertiseStyle)
    if (advertiseMetrics.height > LineHeight * 2)
      advertiseMetrics.height = LineHeight * 2

    let priceStyle = this.priceStyle = {
      fontSize: FontSize,
      lineHeight: LineHeight,
      color: HighlightFontColor,
      top: MarginY + advertiseMetrics.height,
      left: MarginX,
      width: Width,
      height: LineHeight,
      zIndex: 1
    }

    let priceMetrics = measureTextByStyle(price, priceStyle)

    let priceSuffixStyle = this.priceSuffixStyle = {
      fontSize: FontSize,
      lineHeight: LineHeight,
      color: FontColor,
      top: MarginY + advertiseMetrics.height,
      left: MarginX + priceMetrics.width,
      width: Width - priceMetrics.width,
      height: LineHeight,
      zIndex: 1
    }
  }

  render() {
    this.calculateStyles()
    const { advertise, price } = this.props,
          image = this.state.image,
          width = Width + MarginX * 2,
          height = Height + MarginY * 2

    return (
      <Surface
        ref="surface"
        className="preview"
        top={0}
        left={0}
        width={width}
        height={height}
        >

        <Group style={{
          top: 0,
          left: 0,
          width: width,
          height: height,
          backgroundColor: 'white'
        }}>

          {image &&
            <Image key={image} src={image} style={this.imageStyle}/>
          }

          <Text style={this.advertiseStyle}>
            {advertise}
          </Text>

          <Text style={this.priceStyle}>
            {price}
          </Text>

          {price &&
            <Text style={this.priceSuffixStyle}>
              分
            </Text>
          }

        </Group>

      </Surface>
    )
  }
}
