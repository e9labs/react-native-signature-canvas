import React, { Component } from 'react';
import { View, StyleSheet, WebView } from 'react-native';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

const styles = StyleSheet.create({
  signature: {
    width: 200,
    height: 110,
    borderWidth: 2,
    borderColor: "grey"
  },
  signaturBg: {
    alignItems: "center",
    marginTop: 20
  },
  webView: {},
  webBg: {
    width: "100%",
    paddingTop: 20,
    backgroundColor: "#FFF",
    flex: 1
  }
});

class SignatureView extends Component {
  static defaultProps = {
    style: styles.webView,
    webBgStyle: styles.webBg,
    activeOpacity: 0.8
  };

  constructor(props) {
    super(props);
    this.state = { base64DataUrl: props.dataURL || null };
    const { backgroundColor } = StyleSheet.flatten(props.style);
    const injectedJavaScript = injectedSignaturePad + injectedApplication;
    var html = htmlContent(injectedJavaScript);
    html = html.replace("<%Confirm%>", props.confirmTxt);
    html = html.replace("<%Reset%>", props.resetTxt);
    html = html.replace("<%SignAbove%>", props.signAbove)
    this.source = { html };
  }

  state = {
    bridgeJs: `
        (function ready() {
          saveButton.addEventListener("click", function (event) {
            if (signaturePad.isEmpty()) {
                alert("Please provide signature first.");
            } else {
                window.postMessage(signaturePad.toDataURL());
            }
          });
        })();`
  };

  getSignature = e => {
    const { onOK } = this.props;
    onOK(e.nativeEvent.data);
  };

  _renderError = args => {
    console.log("error", args);
  };

  render() {
    return (
      <View style={styles.webBg}>
        <WebView
          style={styles.webView}
          source={this.source}
          onMessage={this.getSignature}
          javaScriptEnabled={true}
          onError={this._renderError}
        />
      </View>
    );
  }
}

export default SignatureView;
