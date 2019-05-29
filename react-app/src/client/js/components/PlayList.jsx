import React, {Component} from 'react';
import PlayListItem from './PlayListItem';
import PropTypes from 'prop-types';

import {connect} from "react-redux";

import * as VideosListActions from "../store/actions/videosList";

export class PlayList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: this.props.listItems || [],
            selectedItem: this.props.selectedItem
        };
    }

    onListItemClicked(itemId) {
        
        this.setState({selectedItem: itemId});
        if (this.props.onItemSelected) {
            this.props.onItemSelected(itemId);
        }

    }
    loadData() {
        this.props.loadList();
    }
    componentDidMount() {
        if (!this.props.listItems.length) {
            this.loadData();
        }
    }

    render() {
        var self = this,
            playlist = this.listItems
                .map(function (ytId) {
                    return (
                        <PlayListItem
                            onClick={self.onListItemClicked.bind(self)}
                            ytId={ytId}
                            key={ytId}>{ytId}</PlayListItem>
                    );
                });
        return (
            <div className="playList">{playlist}</div>
        );
    }
}

PlayList.propTypes = {
    listItems: PropTypes.array,
    selectedItem: PropTypes.string,
    onItemSelected: PropTypes.func,
    loadList: PropTypes.func
};


const mapStateToProps = (state/*, ownProps*/) => {
    //const {organizationId} = ownProps.match.params;
    
    return {
        listItems: state.listItems,
    };
};
  
const mapDispatchToProps = (dispatch) => {
    return {
        loadList: () => {
            return dispatch(VideosListActions.getList());
        }/*,
      findUsersByOrganizationId: (organizationId, limit, skip, sort, order, status) => {
        return dispatch(OrganizationsActions.findUsersByOrganizationId(organizationId, limit, skip, sort, order, status));
      },
      countUsersByOrganizationId: (organizationId) => {
        return dispatch(OrganizationsActions.countUsersByOrganizationId(organizationId));
      },
      createUser: (data) => dispatch(UsersActions.create(data)),
      cleanUsers: () => dispatch(UsersActions.clean())
      */
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PlayList);