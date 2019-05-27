import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { grey } from "@material-ui/core/colors";

class InfoBox extends React.Component {
  render() {
    const { color, title, value, Icon } = this.props;
    const styles = {
      content: {
        padding: "5px 10px",
        height: 80
      },
      number: {
        display: "block",
        fontWeight: 400,
        fontSize: 18,
        marginTop: 40,
        textAlign: "center",
        color: grey[800]
      },
      text: {
        fontSize: 20,
        fontWeight: 300,
        color: "white",
        verticalAlign: "middle",
        lineHeight: 1,
        textAlign: "center"
      },
      iconSpan: {
        float: "left",
        height: 30,
        width: "100%",
        textAlign: "center",
        backgroundColor: color
      },
      icon: {
        height: 25,
        width: 25,
        marginTop: 2,
        maxWidth: "100%",
        verticalAlign: "middle"
      }
    };

    return (
      <Paper>
        <span style={styles.iconSpan}>
          <div style={{ color: "white" }}>
            <Icon style={styles.icon} />
            <span style={styles.text}>{title}</span>
          </div>
        </span>
        <div style={styles.content}>
          <span style={styles.number}>{value}</span>
        </div>
      </Paper>
    );
  }
}

InfoBox.propTypes = {
  Icon: PropTypes.any, // eslint-disable-line
  color: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string
};

export default InfoBox;
