import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import PropTypes from 'prop-types'
import {
  consumeAllContextValues,
  provideAllContexts
} from '../contextWrapper'

const DummyComponent = (props) => (
  <React.Fragment>
    {props.children}
  </React.Fragment>
)

export class ServerDiaper extends React.Component {
  log (error) {
    console.error("Server Diaper", error)
  }

  handleError (error) {
    this.log(error)
  }

  render () {
    const cn = `diaper`
    const Fallback = this.props.fallback
    const Providers = this.props.Providers || DummyComponent
    const WrapperComponent = consumeAllContextValues(
      values => {
        const InnerComponent = provideAllContexts(Providers, values)
        try {
          const __html = renderToStaticMarkup(<InnerComponent {...this.props} />)
          return (<div className={cn} dangerouslySetInnerHTML={{__html}} />)
        } catch (e) {
          this.handleError(e)
          return (
            <div className={cn} >
              <Fallback error={e} />
            </div>
          )
        }
      })
    return (<WrapperComponent />)
  }
}

ServerDiaper.propTypes = {
  children: PropTypes.element,
  fallback: PropTypes.elementType,
  Providers: PropTypes.func,
  componentName: PropTypes.string,
}

export default ServerDiaper
