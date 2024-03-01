import React from 'react';
import { Col } from 'react-bootstrap';

import axios from 'axios';
import cookie from 'react-cookies';
import SweetAlert from "react-bootstrap-sweetalert";

// import defaultImage from 'assets/img/default-avatar.png';

import Button from 'components/CustomButton/CustomButton.jsx';

import { backendURL } from 'variables/appVariables.jsx';

class PictureUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: "",
      file: null,
      ImageUploader: false,
      documentUplader: false,
      completed: ""
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.warningWithConfirmMessage = this.warningWithConfirmMessage.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  handleImageChange(e) {
    var entityUrl = backendURL + 'documents/' + this.props.type + '/picture/' + (this.props.details._id ? this.props.details._id : "");

    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      if (!file.type.includes('image')) {
        alert('PLEASE CHOSE AN IMAGE!')
      } else if (file.size / (1024 * 1024) > 3) {
        alert('PLEASE CHOOSE Image Smaller than 3 MB')
      } else {
        var url = entityUrl;
        var ifd = new FormData();
        ifd.append('file', file)
        axios.post(url, ifd, { headers: { 'Authorization': 'Bearer ' + cookie.load('token') } }).then((res) => {
          if (res.status === 200) {
            setTimeout(() => {
              this.props.handleImageChange(res.data);
              this.setState({
                file: file,
                imagePreviewUrl: backendURL + res.data
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
    var entityUrl = backendURL + 'documents/' + this.props.type + '/document/' + (this.props.details._id ? this.props.details._id : null);
    e.preventDefault();
    for (let i = 0; i < e.target.files.length; i++) {
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadstart = () => {
        this.setState({ documentUplader: true })
      }
      reader.onloadend = () => {
        var _this = this;
        if (file.size / (1024 * 1024) > 10) {
          alert('PLEASE CHOOSE Image Smaller than 10 MB')
        } else {
          var url = entityUrl;
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
            this.props.handleMultipleDocumentChange(res.data);
          }).catch(function (error) {
            console.error(error.response);
          });
        }
      }
      reader.readAsDataURL(file);
    }
  }

  deleteDocument(documentFileName, key) {

    var entityUrl = backendURL + "documents/" + this.props.type + "/document/" + documentFileName + "?moduleId=" + this.props.details._id;
    var _this = this;
    axios.delete(entityUrl, { 'headers': { 'Authorization': 'Bearer ' + cookie.load('token') } }).then(function (res) {
      if (res.status === 200) {
        _this.props.handleDeleteDocument(key);
        _this.setState({ alert: "",  })
	window.location.reload();
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
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes"
          cancelBtnText="Cancel"
          showCancel
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
    var self = this;
    return (
      <div>
        <div className="picture-container">
          {this.state.alert}
          <div className={this.props.assetsPicture ? "picture" : null}>
            {
              this.props.assetsPicture ?
                <div className="parent-picture-src">
                  <img src={backendURL + this.props.imagePreviewUrl} className="picture-src" alt="..." />
                  <input type="file" onChange={(e) => this.handleImageChange(e)} />
                </div> : null
            }
          </div>

          <div className={this.props.companyPicture ? "picture" : null}>
            {
              this.props.companyPicture ?
                <div className="parent-picture-src">
                  <img src={backendURL + this.props.imagePreviewUrl} className="picture-src" alt="..." />
                  <input type="file" onChange={(e) => this.handleImageChange(e)} />
                </div> : null
            }
          </div>

          <div className={this.props.profilePicture ? "picture" : null}>
            {
              this.props.profilePicture ?
                <div className="parent-picture-src">
                  <img src={backendURL + this.props.imagePreviewUrl} className="picture-src" alt="..." />
                  <input type="file" onChange={(e) => this.handleImageChange(e)} />
                </div> : null
            }
          </div>
        </div>
        <div>
          {
            this.props.docs ?
              <div>
                {
                  this.props.documents ?
                    this.props.documents.map(function (document, key) {
                      return (
                        <Col md={4} key={key}>
                          <Col md={10}>
                            <a target="_blank" href={backendURL + document.url} >{document.displayName} </a>
                            <Button className="dynamincFieldDeleteButton" id={key} onClick={() => self.warningWithConfirmMessage(document.fileName, key)}>
                              <i className="fa fa-times-circle" style={{ fontSize: "20px" }}></i>
                              {/* <i className="fa fa-times-circle" style={{ fontSize: "20px" }}></i> */}
                            </Button>
                          </Col>
                        </Col>
                      )
                    }) : null
                }
                <Col md={12} style={{ marginTop: "20px", marginLeft: "-15px" }}>
                  <div className="upload-btn-wrapper">
                    <Button className={(this.state.documentUplader) ? "hideDiv" : "uploadButton"} ><i className="fa fa-upload"></i>{this.props.dropText}</Button>
                    <input className={(this.state.documentUplader) ? "hideDiv" : null} type="file" ref="fileInput" onChange={(e) => this.handleMultipleDocumentChange(e)} multiple />
                  </div>
                </Col>
                <Col md={12} className={(this.state.documentUplader) ? null : "hideDiv"}>
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

export default PictureUpload;