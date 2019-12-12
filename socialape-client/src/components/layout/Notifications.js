import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom/";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PropTypes from "prop-types";
//Redux
import { markNotificationsRead } from "../../redux/actions/userActions";
import { connect } from "react-redux";
//MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ToolTip from "@material-ui/core/ToolTip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

//icons
import NotificationIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

class Notifications extends Component {
  state = {
    anchorEl: null
  };

  handleOpen = event => {
    this.setState({
      anchorEl: event.target
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onMenuOpened = () => {
    let unreadNotifIds = this.props.notifications
      .filter(notif => !notif.read)
      .map(not => not.notificationId);
    this.props.markNotificationsRead(unreadNotifIds);
  };

  render() {
    const { notifications } = this.props;
    const { anchorEl } = this.state;
    dayjs.extend(relativeTime);
    let notificationIcon;
    if (notifications && notifications.length > 0) {
      let unreadNotifsLength = notifications.filter(
        notif => notif.read === false
      ).length;
      unreadNotifsLength > 0
        ? (notificationIcon = (
            <Badge badgeContent={unreadNotifsLength} color="secondary">
              <NotificationIcon />
            </Badge>
          ))
        : (notificationIcon = <NotificationIcon />);
    } else {
      notificationIcon = <NotificationIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(notif => {
          const verb = notif.type === "like" ? "liked" : "commented on";
          const time = dayjs(notif.createdAt).fromNow();
          const iconColor = notif.read ? "primary" : "secondary";
          const icon =
            notif.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
          return (
            <MenuItem
              key={notif.createdAt}
              component={Link}
              to={`/user/${notif.recipient}/scream/${notif.screamId}`}
              onClick={this.handleClose}
            >
              {icon}
              <Typography color="initial" variant="body1">
                {notif.sender} {verb} your scream {time}.
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );

    return (
      <Fragment>
        <ToolTip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </ToolTip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {notificationsMarkup}
        </Menu>{" "}
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
