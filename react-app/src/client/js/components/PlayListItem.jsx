import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PlayListItem extends Component {
    constructor(props) {
        super(props);
        //this.props.itemData;
    }
    onClick() {
        this.props.onClick(this.itemData);
    }
    render() {
        let imageSrc = this.props.itemData.images.poster["200x300"].full;
        return <div class="playListItem" onClick={this.onClick.bind(this)}>
            <img src={imageSrc} />
        </div>;
    }
}

PlayListItem.propTypes = {
    itemData: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

/*
{
	"id": 10688,
	"post_type": "show",
	"labels": {
		"layout_hero": {
			"slot_1": "First Eight Episodes of Season 8",
			"slot_2": "11 Full Episodes & Extras",
			"slot_3": "The Walking Dead"
		},
		"layout_poster": {
			"slot_1": "the walking dead",
			"slot_2": "11 Full Episodes & Extras"
		},
		"layout_hero_info": {
			"slot_1": "The Walking Dead",
			"slot_2": "",
			"slot_3": "Header Touts: 6 ToutsTout, Tout, Tout, Tout, Tout, ToutTabbed Content: 1 TabSocial Show.cfct-module.georgia, .cfct-module.rb-dart,.cfct-module.doubleclick {margin: 0;}.cfct-module.georgia .cfct-mod-content {padding:0;}body .submit-button {  line-height:0!important;  color:transparent!important;}\t\t\tvar axel = Math.random() + \"\";\tvar a = axel * 10000000000000;\tdocument.write('');"
		},
		"layout_hero_stack": {
			"slot_1": "The Walking Dead",
			"slot_2": "11 Full Episodes & Extras",
			"slot_3": ""
		},
		"layout_content_list": {
			"slot_1": "",
			"slot_2": "11 Full Episodes & Extras"
		},
		"layout_content_list_item": {
			"slot_1": "",
			"slot_2": "The Walking Dead",
			"slot_3": "The official site of AMC's original series The Walking Dead. Get the latest news, photos, video extras and more.",
			"slot_4": "",
			"slot_5": "",
			"slot_6": ""
		},
		"layout_info": {
			"slot_1": "Returns Sun, Feb. 25 at 9/8c on AMC. The Walking Dead tells the story of the months and years that follow after a zombie apocalypse. It follows a group of survivors, led by former police officer Rick Grimes, who travel in search of a safe and secure home. As the world overrun by the dead takes its toll on the survivors, their interpersonal conflicts present a greater danger to their continuing survival than the walkers that roam the country. Over time, the characters are changed by the constant exposure to death and some grow willing to do anything to survive."
		}
	},
	"images": {
		"poster": {
			"200x300": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-logo-400x600-200x300.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-logo-400x600-200x300.jpg",
				"width": 200,
				"height": 300
			}
		},
		"square": {
			"3000x3000": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-1920x1440.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-1920x1440.jpg",
				"width": 1920,
				"height": 1440
			}
		},
		"wide": {
			"1280x720": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-1280x720.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-1280x720.jpg",
				"width": 1280,
				"height": 720
			},
			"800x450": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-800x450.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-800x450.jpg",
				"width": 800,
				"height": 450
			},
			"427x240": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-427x240.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-OTT-2560x1440-427x240.jpg",
				"width": 427,
				"height": 240
			}
		},
		"ultrawide": {
			"3200x1440": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-3200x1440.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-3200x1440.jpg",
				"width": 3200,
				"height": 1440
			},
			"2400x1080": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-3200x1440-2400x1080.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-8B-key-3200x1440-2400x1080.jpg",
				"width": 2400,
				"height": 1080
			}
		}
	},
	"meta": {
		"amcn_field_amcn_tribune_id": "SH013240020000",
		"amcn_field_network": "AMC",
		"amcn_field_nonpremiere_badging": "",
		"amcn_field_permalink_full": "http://www.amc.com/shows/the-walking-dead",
		"amcn_field_permalink_relative": "/shows/the-walking-dead",
		"amcn_field_post_date_gmt": "2010-12-17 23:51:29",
		"amcn_field_post_id": "10688",
		"amcn_field_post_modified_gmt": "2018-01-25 17:51:05",
		"amcn_field_post_name": "the-walking-dead",
		"amcn_field_post_title": "The Walking Dead",
		"amcn_field_post_type": "show",
		"amcn_field_relation": "the-walking-dead|-1|-1",
		"amcn_field_relation_episode_display": "-1",
		"amcn_field_relation_episode_id": "-1",
		"amcn_field_relation_episode_name": "-1",
		"amcn_field_relation_episode_number": "-1",
		"amcn_field_relation_season_display": "-1",
		"amcn_field_relation_season_id": "-1",
		"amcn_field_relation_season_name": "-1",
		"amcn_field_relation_season_number": "-1",
		"amcn_field_relation_show_display": "The Walking Dead",
		"amcn_field_relation_show_id": "10688",
		"amcn_field_relation_show_name": "the-walking-dead",
		"amcn_field_show_accent_color": "#d7df59",
		"amcn_field_show_accent_hover_color": "#d7df59",
		"amcn_field_show_availability": "",
		"amcn_field_show_branding": {
			"logo": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-logo-white-C.png",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-logo-white-C.png",
				"width": 638,
				"height": 200
			},
			"background": {
				"full": "http://images.amcnetworks.com/amc.com/wp-content/uploads/2010/12/the-walking-dead-masthead.jpg",
				"relative": "/amc.com/wp-content/uploads/2010/12/the-walking-dead-masthead.jpg",
				"width": 1920,
				"height": 1080
			},
			"accent_color": "#d7df59"
		},
		"amcn_field_show_current_season": "1393031",
		"amcn_field_show_featured": "true",
		"amcn_field_show_headline": "",
		"amcn_field_show_menu_active_color": "#000000",
		"amcn_field_show_menu_color": "#FFFFFF",
		"amcn_field_show_mobile_order": "100",
		"amcn_field_show_nielsen_program_name": "Walking Dead",
		"amcn_field_show_nielsen_summary_type_code": "GD",
		"amcn_field_show_nielsen_summary_type_description": "General Drama",
		"amcn_field_show_nielson_detail_type_code": "Series - Drama",
		"amcn_field_show_season": "true",
		"amcn_field_show_type": "",
		"amcn_field_tribune_id": "",
		"amcn_field_updated": "1517342404"
	}
}"
*/