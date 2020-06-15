import React, { Component } from 'react';

//Resources
import Something_Went_Wrong from '../resources/Images/Something_Went_Wrong.svg';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-page-img-container">
            <img src={Something_Went_Wrong} alt="Something went wrong" />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
