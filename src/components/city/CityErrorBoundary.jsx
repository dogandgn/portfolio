import { Component } from 'react';

export default class CityErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="city-route-loading" role="alert">
        <div>
          <p>{this.props.message}</p>
          <button onClick={this.props.onReturn}>
            {this.props.returnLabel} ↗
          </button>
        </div>
      </div>
    );
  }
}
