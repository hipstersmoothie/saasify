import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sizeMe from 'react-sizeme'
import BlockImage from 'react-block-image'

import { observer } from 'mobx-react'
import { Motion, spring } from 'react-motion'

import styles from './styles.module.css'

// NOTE (travis): the order of these decorators is important... (hic draconis)
@sizeMe({ monitorWidth: true, monitorHeight: true })
@observer
export class SceneSlideshow extends Component {
  static contextTypes = {
    EventEmitter: PropTypes.object.isRequired
  }

  static propTypes = {
    scenes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedSceneIndex: PropTypes.number.isRequired,
    onSelectScene: PropTypes.func.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }

  render() {
    const { scenes, selectedSceneIndex, onSelectScene, size } = this.props

    const baseHeight = size.height ? size.height : window.innerHeight * 0.4

    console.log(size.width, size.height)
    const ratio = 0.9
    const padding = 48

    const widthC = size.width * ratio
    const heightC = baseHeight * ratio

    const aspectRatio = 1280 / 995

    const heightR = widthC / aspectRatio
    const widthR = heightC * aspectRatio

    const width = Math.min(widthC, widthR)
    const height = Math.min(heightC, heightR)

    const center = {
      x: size.width / 2,
      y: baseHeight / 2
    }

    const selectedScenePos = {
      x: center.x - width / 2,
      y: center.y - height / 2
    }

    const x = selectedScenePos.x - (width + padding) * selectedSceneIndex
    const y = selectedScenePos.y

    return (
      <div className={styles.container}>
        <Motion
          defaultStyle={{
            x,
            y,
            width,
            height
          }}
          style={{
            x: spring(x),
            y: spring(y),
            width: spring(width),
            height: spring(height)
          }}
        >
          {({ x, y, width, height }) => (
            <>
              <div className={styles.track} style={{ left: x, top: y }}>
                {scenes.map((scene, index) => {
                  const isSelected = selectedSceneIndex === index
                  const className = `${styles.scene} ${
                    isSelected ? styles.activeScene : ''
                  }`

                  return (
                    <div
                      className={className}
                      key={scene.src}
                      style={{
                        width,
                        height,
                        transform: `scale(${isSelected ? 1.0 : 0.8})`,
                        filter: isSelected ? 'blur(0)' : 'blur(8px)',
                        zIndex: isSelected ? 1 : 0
                      }}
                    >
                      <BlockImage
                        src={scene.src}
                        style={{ width, height }}
                        onClick={() => onSelectScene(index)}
                      />
                    </div>
                  )
                })}
              </div>
              <div className={styles.overlay} />
            </>
          )}
        </Motion>
      </div>
    )
  }
}
