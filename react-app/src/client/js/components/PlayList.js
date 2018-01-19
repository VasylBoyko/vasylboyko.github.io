import React, {
    Component
} from 'react';
import PlayListItem from './PlayListItem';
import PropTypes from 'prop-types';

export default class PlayList extends Component {
    constructor(props) {
        super(props);
        this.listItems = this.props.listItems || [];
		this.selectedItem = this.props.selectedItem;
    }

	onListItemClicked(itemId) {
		this.props.selectedItem = itemId;
	}

    render() {
        var self = this,
			playlist = this.listItems.map(function (ytId) {
            return (
                 <PlayListItem onClick={self.onListItemClicked.bind(self)} ytId={ytId} key={ytId}>{ytId}</PlayListItem>
			);
        })
        return (<div className="playList">{playlist}</div>);
    }
}

PlayList.propTypes = {
    listItems: PropTypes.array,
	selectedItem: PropTypes.string
};
