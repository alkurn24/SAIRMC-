import React from 'react';
import { Col } from 'react-bootstrap';
import CryptoJS from "crypto-js";
import axios from 'axios';
import cookie from 'react-cookies';
import SweetAlert from "react-bootstrap-sweetalert";

import Button from 'components/CustomButton/CustomButton.jsx';

import { backendURL, encdec } from 'variables/appVariables.jsx';
import { downloadFile } from "js/server.js";

class UploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: props.photo,
      alert: "",
      file: null,
      ImageUploader: false,
      documentUplader: false,
      completed: ""
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.warningWithConfirmMessage = this.warningWithConfirmMessage.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  handleImageChange(e) {
    if (this.props.type === "users") {
      var url = backendURL + 'documents/' + this.props.type + '/picture/' + (this.props.details.id ? this.props.details.id : "");
    }
    else {
      var url = backendURL + 'documents/' + this.props.type + '/picture/' + (this.props.details.code ? this.props.details.code : "");
    }
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      if (!file.type.includes('image')) {
        alert('Please select an image file !')
      } else if (file.size / (1024 * 1024) > 3) {
        alert('Please select image smaller than 3 MB')
      } else {
        var ifd = new FormData();
        ifd.append('file', file)
        axios.post(url, ifd, { headers: { 'Authorization': 'Bearer ' + cookie.load('token') } }).then((res) => {
          if (res.status === 200) {
            setTimeout(() => {
              this.props.handleImageChange(res.data);
              this.setState({
                file: file,
                photo: backendURL + res.data
              });
            }, 100);
          }
        }).catch(function (error) {
          console.error(error.response);
        });
      }
    }
    reader.readAsDataURL(file);
  }

  handleMultipleDocumentChange(e) {
    var url = backendURL + 'documents/' + this.props.type + '/documents/' + (this.props.details.code ? this.props.details.code : null);
    e.preventDefault();
    if (this.props.type !== "challanDocument") {
      for (let i = 0; i < e.target.files.length; i++) {
        let reader = new FileReader();
        let file = e.target.files[i];
        reader.onloadstart = () => {
          this.setState({ documentUplader: true })
        }
        reader.onloadend = () => {
          var _this = this;
          if (file.size / (1024 * 1024) > 10) {
            alert('Please choose document smaller than 10 MB')
          } else {
            // var url = url;
            var ifd = new FormData();
            ifd.append('file', file);
            axios({
              url: url, method: 'post',
              onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                _this.setState({ completed: percentCompleted })
              }, headers: { 'Authorization': 'Bearer ' + cookie.load('token') }, data: ifd
            }).then((res) => {
              this.setState({ documentUplader: false });
              this.setState({ file: file });
              var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
              var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              this.props.handleMultipleDocumentChange(decryptedData);
            }).catch(function (error) {
              console.error(error.response);
            });
          }
        }
        reader.readAsDataURL(file);
      }
    } else {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadstart = () => {
        this.setState({ documentUplader: true })
      }
      reader.onloadend = () => {
        var _this = this;
        if (file.size / (1024 * 1024) > 10) {
          alert('Please choose document smaller than 10 MB')
        } else {
          // var url = url;
          var ifd = new FormData();
          ifd.append('file', file);
          axios({
            url: url, method: 'post',
            onUploadProgress: function (progressEvent) {
              var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              _this.setState({ completed: percentCompleted })
            }, headers: { 'Authorization': 'Bearer ' + cookie.load('token') }, data: ifd
          }).then((res) => {
            this.setState({ documentUplader: false });
            this.setState({ file: file });
            var bytes = CryptoJS.AES.decrypt(res.data.toString(), encdec);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            this.props.handleMultipleDocumentChange(decryptedData);
          }).catch(function (error) {
            console.error(error.response);
          });
        }
      }
      reader.readAsDataURL(file);
    }
  }

  deleteDocument(documentFileName, key) {

    var url = backendURL + documentFileName + "?moduleId=" + this.props.details.id;
    var _this = this;
    axios.delete(url, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } }).then(function (res) {
      if (res.status === 200) {
        _this.props.handleDeleteDocument(key);
        _this.setState({ alert: "", })
        _this.successAlert("Document deleted successfully!")
      }
    }).catch(function (error) {
      console.error(error);
    });
  }

  warningWithConfirmMessage(documentFileName, key) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteDocument(documentFileName, key)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel

        >
          You will not be able to recover this document!
        </SweetAlert>
      )
    });
  }
  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  hideAlert() {
    this.setState({
      alert: null
    });
  }

  render() {
    var _this = this;
    return (
      <div>
        <div className="picture-container">
          {this.state.alert}
          <div className={this.props.picture ? "picture" : null}>
            {
              this.props.picture ?
                <div className="parent-picture-src" key={this.props.photo} >
                  <img src={backendURL + this.props.photo} className="picture-src" alt="..." />
                  <input type="file" onChange={(e) => this.handleImageChange(e)} />
                </div> : null
            }
          </div>
        </div>
        <div>
          {
            this.props.document ?
              <div key={this.props.documents}>
                {
                  this.props.documents && this.props.documents.length ? (
                    this.props.documents.map(function (document, key) {
                      return (
                        <Col md={4} key={key}>
                          <div className="actions-right">
                            <a className="editLink" target="_blank"
                              // href={backendURL + document}>
                              onClick={() => {
                                downloadFile(
                                  document.substring(0, document.lastIndexOf("/") + 1),
                                  document.substring(document.lastIndexOf("/") + 1, document.length),
                                  null,
                                  (res) => {
                                    // DO NOT DELETE - method 1
                                    // const url = window.URL.createObjectURL(new Blob([res.data]));
                                    // const link = document.createElement('a');
                                    // link.href = url;
                                    // link.setAttribute('download', code + '.pdf');
                                    // document.body.appendChild(link);
                                    // link.click();

                                    // DO NOT DELETE - method 2
                                    // Create a Blob from the PDF Stream
                                    // const file = new Blob([res.data], { type: 'application/pdf' });
                                    const file = new Blob([res.data], { type: res.data.type });

                                    // Build a URL from the file
                                    const fileURL = URL.createObjectURL(file);
                                    // Open the URL on new Window
                                    window.open(fileURL, '_blank');
                                  },
                                  (error) => {
                                    console.log(error)
                                    alert(error)
                                  }
                                )
                              }}
                            >
                              {((document.split('/')).pop()).substring(document.split('/').pop().lastIndexOf("_") + 1)}
                            </a>
                            <a className="fa fa-trash text-danger" onClick={() => _this.warningWithConfirmMessage(document, key)}>{null}</a>
                          </div>
                        </Col>
                      )
                    })
                  ) : null
                }
                <Col md={12} style={{ marginTop: "10px" }}>
                  <div className="upload-btn-wrapper">
                    <Button className={(this.state.documentUplader) ? "hideDiv" : "uploadButton"} ><i className="fa fa-upload"></i>{this.props.dropText}</Button>
                    <input className={(this.state.documentUplader) ? "hideDiv" : null} type="file" ref="fileInput" onChange={(e) => this.handleMultipleDocumentChange(e)} multiple />
                  </div>
                </Col>
                <Col md={12} className={(this.state.documentUplader) ? null : "hideDiv"} style={{ marginTop: "10px" }}>
                  <div className="progress-line-primary progress">
                    <div role="progressbar" className="progress-bar" aria-valuenow={this.state.completed} aria-valuemin="0" aria-valuemax="100" style={{ width: this.state.completed + "%" }}>
                      <span className="sr-only"></span>
                    </div>
                  </div>
                </Col>
              </div> : ""
          }
        </div>
      </div>
    );
  }
}

export default UploadComponent;