import './sass/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Preview from './preview'

import ReactBootstrap, { Input, Button, ButtonGroup } from 'react-bootstrap'

class App extends React.Component {

  state = {
    width: 135,
    right: 0,
    bottom: 0
  }

  handleZoom(offset) {
    const width = this.state.width + offset,
          right = this.state.right - offset / 2,
          bottom = this.state.bottom - offset / 2
    this.setState({ width, right, bottom })
  }

  handleScroll(offsetX, offsetY) {
    const right = this.state.right + offsetX,
          bottom = this.state.bottom + offsetY
    this.setState({ right, bottom })
  }

  handleChange(event) {
    const target = event.target
    this.setState({ [target.name]: target.value })
  }

  handleChangeFile(event) {
    const target = event.target
    const url = window.URL.createObjectURL(target.files[0])
    this.setState({ [target.name]: url })
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
          <Input
            type="file"
            name="image"
            onChange={::this.handleChangeFile}
            label="3. 导入图片"
            />
          <Input
            type="text"
            name="image"
            onChange={::this.handleChange}
            placeholder="输入网址：http://"
            />
        </div>

        <div className="right-side">
          <Preview ref="preview" {...this.state}/>

          <div className="buttons">
            <ButtonGroup>
              <Button onClick={this.handleZoom.bind(this, 10)}>放大</Button>
              <Button onClick={this.handleZoom.bind(this, -10)}>缩小</Button>
            </ButtonGroup>
          </div>
          <div className="buttons">
            <ButtonGroup>
              <Button onClick={this.handleScroll.bind(this, 0, 10)}>上</Button>
              <Button onClick={this.handleScroll.bind(this, 0, -10)}>下</Button>
              <Button onClick={this.handleScroll.bind(this, 10, 0)}>左</Button>
              <Button onClick={this.handleScroll.bind(this, -10, 0)}>右</Button>
            </ButtonGroup>
          </div>
          <div className="buttons">
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
