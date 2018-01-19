import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

export default class VideoFrame extends Component {
    constructor(props) {
        super(props);
		this.ytId = this.props.ytId || "PS5RShJUSHo"
    }
    render() {
        return (
			<iframe width="640" height="385" src={"https://www.youtube.com/embed/"+this.ytId} frameBorder="0" allowFullScreen=""></iframe>
		);
    }
}

VideoFrame.propTypes = {
  ytId: PropTypes.string
}; 

