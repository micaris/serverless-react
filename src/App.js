import React, { Component, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from './component/NavBar'
import { CustomInput, FormGroup, Container, Jumbotron, Button } from 'reactstrap';


const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};
const activeStyle = {
  borderColor: '#2196f3'
};
const acceptStyle = {
  borderColor: '#00e676'
};
const rejectStyle = {
  borderColor: '#ff1744'
};
function StyledDropzone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: 'image/*' });
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
      isDragActive,
      isDragReject
    ]);
  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
}

class App extends Component {
  state = {
    fileName: '',
    invalidFile: false,
    file: null,
    isLoading: null,
    content: ""
  }

  handleFileChange = (e) => {
    const files = e.target.files;
    const cancel = !files.length;
    if (cancel) return;
    const [{ size, name }] = files;
    const maxSize = 50000;
    if (size < maxSize) {
      this.setState({
        fileName: name,
        invalidFile: false,
        file: files
      });
    } else {
      this.setState({ fileName: '', invalidFile: true });
    }
  }
  uploadFile = async event => {
    let file = this.state.file[0]
    var reader = new FileReader();
    reader.readAsBinaryString(file)
    console.log(file.type)
    reader.onload = async () => {
      let file_string = window.btoa(reader.result)
      console.log(file_string)
      await fetch('<Your API endpoint>', {
        method: 'POST',
        headers: {
          'Accept': `${file.type}`,
          'Content-Type': `${file.type}`,
          'Access-Control-Allow-Origin': "*"
        },
        body: file_string
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      console.log("file uploaded")
    }
    reader.onerror = error => console.log('Error :', error)


  }
  renderUploadButton = () => {
    if (this.state.fileName) {
      return (
        <Button onClick={() => this.uploadFile()}>
          Upload
        </Button>
      )
    }
  }

  render() {
    return (
      <div>
        <Container>
          <Navbar />
          <Jumbotron>
            <StyledDropzone />
          </Jumbotron>
          <FormGroup>
            <CustomInput
              type="file"
              id="exampleCustomFileBrowser"
              name="customFile"
              label={ this.fileName || 'choose an image file'}
              onChange={this.handleFileChange}
              invalid={this.invalidFile} />
          </FormGroup>
          {
            this.renderUploadButton()
          }
          {
            this.file ? 'File Uploaded' : null
          }
        </Container>
      </div>
    )
  }
}

export default App;
