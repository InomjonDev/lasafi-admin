import { Component } from 'react'
import type { ReactNode } from 'react'
import { AlertIcon } from '../utils/icons'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-screen">
          <AlertIcon />
          <h2>Nimadir xato ketdi</h2>
          <p>{this.state.error.message}</p>
          <button className="btn btn--primary" onClick={() => this.setState({ error: null })}>
            Qayta urinish
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
