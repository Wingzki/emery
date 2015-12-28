import './sass/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Preview from './preview'

import Dropzone from 'react-dropzone'
import ReactBootstrap, { Input, Button, ButtonGroup } from 'react-bootstrap'

class App extends React.Component {

  state = {
    imageCenterX: 122,
    imageCenterY: 143,
    imageWidth: 135,
    exportFilename: "preview"
  }

  handleZoom(offset) {
    const imageWidth = this.state.imageWidth + offset
    this.setState({ imageWidth })
  }

  handleScroll(offsetX, offsetY) {
    const imageCenterX = this.state.imageCenterX + offsetX,
          imageCenterY = this.state.imageCenterY + offsetY
    this.setState({ imageCenterX, imageCenterY })
  }

  handleChange(event) {
    const target = event.target
    this.setState({ [target.name]: target.value })
  }

  handleChangeImage(files) {
    const url = window.URL.createObjectURL(files[0])
    this.setState({ image: url })
  }

  handleSave() {
    this.refs.preview.save()
  }

  render() {
    return (
      <div className="container">
        <div className="left-side">
          <Input
            type="textarea"
            name="advertise"
            value={this.state.advertise}
            onChange={::this.handleChange}
            placeholder="文案"
            label="1. 输入文案"
            />
          <Input
            type="number"
            name="price"
            value={this.state.price}
            onChange={::this.handleChange}
            placeholder="0"
            label="2. 输入分值"
            />
          <div className="form-group">
            <label className="control-label">
              3. 导入图片
            </label>
            <Dropzone
              className="dropzone"
              activeClassName="active"
              onDrop={::this.handleChangeImage}
              multiple={false}
              >
              <span>点击或拖拽文件到此处</span>
            </Dropzone>
          </div>
        </div>

        <div className="right-side">
          <Preview ref="preview" {...this.state}/>

          <div className="buttons">
            <ButtonGroup>
              <Button onClick={this.handleZoom.bind(this, 5)}>放大</Button>
              <Button onClick={this.handleZoom.bind(this, -5)}>缩小</Button>
            </ButtonGroup>
          </div>
          <div className="buttons">
            <ButtonGroup>
              <Button onClick={this.handleScroll.bind(this, 0, -2)}>上</Button>
              <Button onClick={this.handleScroll.bind(this, 0, 2)}>下</Button>
              <Button onClick={this.handleScroll.bind(this, -2, 0)}>左</Button>
              <Button onClick={this.handleScroll.bind(this, 2, 0)}>右</Button>
            </ButtonGroup>
          </div>
          <div className="buttons">
            <Input
              type="text"
              name="exportFilename"
              onChange={::this.handleChange}
              placeholder="文件名"
              label="4. 导出图片"
              />
            <ButtonGroup>
              <Button onClick={::this.handleSave}>导出</Button>
            </ButtonGroup>
          </div>
          <div className="overlays"/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("main"))
