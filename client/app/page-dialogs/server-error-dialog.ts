/*
 * Copyright (C) 2015 Kaj Magnus Lindberg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// <reference path="../../typedefs/react/react.d.ts" />
/// <reference path="../prelude.ts" />
/// <reference path="../utils/react-utils.ts" />
/// <reference path="../ReactStore.ts" />
/// <reference path="../Server.ts" />


//------------------------------------------------------------------------------
   module debiki2.pagedialogs {
//------------------------------------------------------------------------------

var d = { i: debiki.internal, u: debiki.v0.util };
var r = React.DOM;
var reactCreateFactory = React['createFactory'];
var ReactBootstrap: any = window['ReactBootstrap'];
var Button = reactCreateFactory(ReactBootstrap.Button);
var Input = reactCreateFactory(ReactBootstrap.Input);
var Modal = reactCreateFactory(ReactBootstrap.Modal);
var ModalHeader = reactCreateFactory(ReactBootstrap.ModalHeader);
var ModalTitle = reactCreateFactory(ReactBootstrap.ModalTitle);
var ModalBody = reactCreateFactory(ReactBootstrap.ModalBody);
var ModalFooter = reactCreateFactory(ReactBootstrap.ModalFooter);


var serverErrorDialog;


export function getServerErrorDialog() {
  if (!serverErrorDialog) {
    serverErrorDialog = React.render(ServerErrorDialog(), utils.makeMountNode());
  }
  return serverErrorDialog;
}


export function showAndThrowClientSideError(errorMessage: string) {
  getServerErrorDialog().openForBrowserError(errorMessage);
  throw new Error(errorMessage);
}


var ServerErrorDialog = createComponent({
  getInitialState: function () {
    return {
      isOpen: false,
      error: null,  // COULD rename to serverError
      dialogMessagePrefix: '',
      clientErrorMessage: null,
    };
  },

  openForBrowserError: function(errorMessage: string) {
    this.setState({
      isOpen: true,
      error: null,
      dialogMessagePrefix: '',
      clientErrorMessage: errorMessage,
    });
  },

  open: function(dialogMessagePrefix?: any, error?: any) {
    if (!error) {
      error = dialogMessagePrefix;
      dialogMessagePrefix = '';
    }
    this.setState({
      isOpen: true,
      error: error,
      dialogMessagePrefix: dialogMessagePrefix,
      clientErrorMessage: null
    });
  },

  close: function() {
    this.setState({ isOpen: false });
  },

  render: function () {
    var title: string;
    var message: string;

    if (!this.state.isOpen) {
      // Do nothing.
    }
    else if (this.state.clientErrorMessage) {
      title = "Error";
      message = this.state.clientErrorMessage;
      if (debiki2.utils.isMouseDetected) {
        message += "\n\n" +
            "See Dev Tools for details: usually Ctrl + Shift + C, here in the browser, " +
            "then click Console.";
      }
    }
    else {
      // Server side error.
      var error = this.state.error;

      // Is the status message included on the first line? If so, remove it, because we'll
      // shown it in the dialog title.
      message = error.responseText;
      var matches = message ? message.match(/\d\d\d [a-zA-Z ]+\n+((.|[\r\n])*)/) : null;
      if (matches && matches.length >= 2) {
        message = matches[1];
      }
      else if (/^\s*<!DOCTYPE html>/.test(message)) {
        // Play Framework sent back a HTML page
        message = $(message).filter('#detail').text().trim() +
            '\n\nSee server logs for stack trace. [DwE4KWE85]';
      }

      title = 'Error ' + error.status + ' ' + error.statusText;

      if (!error.status) {
        // COULD check if we're unloading this page. That results in any ongoing requests being
        // aborted with status code 0. Then we should suppress this dialog.
        // See http://stackoverflow.com/a/12621912/694469.
        // Or we might be accessing the website via the wrong URL, e.g. site-NNN.domain.com rather
        // than the-real-name.domain.com, which would result in a cross origin request error.
        title = 'Error: Server not reachable';
        message = "Has the server stopped? Or did you just get disconnected " +
            "from the Internet? Or are you using the wrong hostname, " +
            "cross-origin request blocked? [DwE4KEF2]\n" +
            "\n" +
            "Details: " + JSON.stringify(error);
      }
    }

    message = this.state.dialogMessagePrefix + message;

    return (
      Modal({ show: this.state.isOpen, onHide: this.close, dialogClassName: 'dw-server-error',
          bsSize: 'large' },
        ModalHeader({}, ModalTitle({}, title)),
        ModalBody({},
          r.div({ style: { whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}, message)),
        ModalFooter({},
          Button({ onClick: this.close }, 'Close'))));
  }
});

//------------------------------------------------------------------------------
   }
//------------------------------------------------------------------------------
// vim: fdm=marker et ts=2 sw=2 tw=0 fo=r list
