import React from 'react'
import reactCSS from 'reactcss'
import _ from 'lodash'

// can look for close values. if padding="3px" it would suggest you to use 'xs'

const keys = ['display', 'direction', 'color', 'background', 'padding', 'paddingTop',
  'paddingRight', 'paddingBottom', 'paddingLeft', 'fontSize', 'align',
  'verticalAlign', 'spread', 'zDepth']

export const Box = (props) => {
  const styles = reactCSS({
    'default': {
      box: {
        flex: (props.style && props.style.flex) || props.flex,
        height: (props.style && props.style.height) || props.height,
        width: (props.style && props.style.width) || props.width,
        opacity: (props.style && props.style.opacity) || props.opacity,
        borderRadius: (props.style && props.style.borderRadius) || props.borderRadius,
        transition: 'box-shadow 100ms ease-out',
      },
    }
  })

  const Tag = props.tag || 'div'

  return (
    <Tag style={ styles.box } onClick={ props.onClick } className={ props.className }>
      { props.children }
    </Tag>
  )
}

export default Box
