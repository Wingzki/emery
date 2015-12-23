import React from 'react'
import ReactDOM from 'react-dom'
import ReactCanvas, { Surface, Image, Text, FontFace, measureText } from 'react-canvas'

function measureTextByStyle(text, style) {
  return measureText(text, style.width, style.fontFace || FontFace.Default(),
    style.fontSize, style.lineHeight)
}

function measureImage(url, callback) {
  let image = document.createElement("img")
  image.src = url
  image.onload = function() {
    callback({ width: this.width, height: this.height })
  }
}

const FontSize = 14,
      LineHeight = 19,
      MarginY = 20,
      MarginX = 15,
      Width = 159,
      Height = 189,
      FontColor = '#393E45',
      HighlightFontColor = '#FF6666',
      ImageWidth = 105

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
    const image = this.props.image
    if (image) {
      measureImage(image, (imageMetrics) => {
        this.setState({ ratio: imageMetrics.height / imageMetrics.width })
      })
    }
  }

  save() {
    let canvas = ReactDOM.findDOMNode(this.refs.surface.refs.canvas)
    let anchor = document.createElement("a")
    anchor.href = canvas.toDataURL("image/png")
    anchor.download = "preview.png"
    anchor.click()
  }

  calculateStyles() {
    const { advertise, price, image, width, right, bottom } = this.props

    let imageWidth = ImageWidth
    let imageHeight = ImageWidth * this.state.ratio
    let imageStyle = this.imageStyle = {
      top: Height - imageHeight + MarginY,
      left: Width - imageWidth + MarginX,
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
      height: LineHeight * 2
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
      height: LineHeight
    }

    let priceMetrics = measureTextByStyle(price, priceStyle)

    let priceSuffixStyle = this.priceSuffixStyle = {
      fontSize: FontSize,
      lineHeight: LineHeight,
      color: FontColor,
      top: MarginY + advertiseMetrics.height,
      left: MarginX + priceMetrics.width,
      width: Width - priceMetrics.width,
      height: LineHeight
    }
  }

  render() {
    this.calculateStyles()
    const { advertise, price, image } = this.props

    return (
      <Surface
        ref="surface"
        className="preview"
        top={0}
        left={0}
        width={189}
        height={229}
        >

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

        {image &&
          <Image key={image} src={image} style={this.imageStyle}/>
        }
      </Surface>
    )
  }
}
