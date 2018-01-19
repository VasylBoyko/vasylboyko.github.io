import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

export default class PlayListItem extends Component {
    constructor(props) {
        super(props);
        this.ytId = this.props.ytId
    }
	onClick () {
		this.props.onClick(this.ytId)
	}
    render() {
        return <div className = "playListItem" onClick={this.onClick.bind(this)}> {this.ytId}</div>
    }
}

PlayListItem.propTypes = {
    ytId: PropTypes.string.isRequired,
	onClick: PropTypes.func
};
