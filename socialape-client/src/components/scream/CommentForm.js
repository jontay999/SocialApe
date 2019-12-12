import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

//Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";
//MUI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

//Icons
import SendIcon from "@material-ui/icons/Send";

const styles = theme => ({
  ...theme.spreadIt
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: {}
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }

    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };

  render() {
    const { classes, authenticated, commentCount } = this.props;
    const errors = this.state.errors;
    const placeholderText =
      commentCount !== 0
        ? "Comment on Scream"
        : "No comments yet. Be the first to comment.";
    const commentFormMarkup = authenticated ? (
      <Fragment>
        <Grid item sm={12} style={{ textAlign: "center" }}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              name="body"
              type="text"
              label={placeholderText}
              error={errors.comment ? true : false}
              helperText={errors.comment}
              value={this.state.body}
              onChange={this.handleChange}
              fullWidth
              className={classes.textField}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={this.handleSubmit}>
                      <SendIcon color="primary" style={{ fontSize: "small" }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </form>
          {commentCount !== 0 ? (
            <hr className={classes.visibleSeparator} />
          ) : null}
        </Grid>
      </Fragment>
    ) : null;
    return commentFormMarkup;
  }
}

const mapStateToProps = state => ({
  UI: state.UI,
  commentCount: state.data.scream.commentCount,
  authenticated: state.user.authenticated
});

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  commentCount: PropTypes.number.isRequired
};

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
