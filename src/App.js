import React, {Component} from 'react';
import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Document, Page,pdfjs  } from 'react-pdf';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { GridList } from '@material-ui/core';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import GridListTile from '@material-ui/core/GridListTile';
import { spacing } from '@material-ui/system';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logo from './icon.ico';
import tcimg from './tcimg.png';
import ReactPlayer from 'react-player';
import './App.css';
import ToU from './ToU_PP_OPUS.pdf';
const electron = window.require('electron');
const { ipcRenderer } = electron;
var VIDPATHS = [];
const fs = window.require('fs');
pdfjs.GlobalWorkerOptions.workerSrc = `./pdf.worker.js`;



const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffb74d',
    },
    secondary: {
      main: '#fff',
    },
  },
});

class App extends Component{
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded:0,
        tiles: [],
        width: window.innerWidth,
        height: window.innerHeight,
        progbarOpen: false,
        doneOpen: false,
        expiredOpen: false,
        tcOpen: true
      }
   this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
   this.openProgBar = this.openProgBar.bind(this);
   this.closeProgBar = this.closeProgBar.bind(this);
   this.runBackend = this.runBackend.bind(this);
   this.openDone = this.openDone.bind(this);
   this.closeDone = this.closeDone.bind(this);
   this.closeExpired = this.closeExpired.bind(this);
   this.openTC = this.openTC.bind(this);
   this.closeTC = this.closeTC.bind(this);
  }
  componentDidMount() {
    //terms of use open only first time - not working
    /*let that = this;
    fs.readFile('hasbeenopened.txt', function(err, data) {
      if (err != null &&  err.code == 'ENOENT') {
        // the file doesn't exist
        console.log('first time opening app');
        that.openTC();
        fs.writeFile('hasbeenopened.txt', 'App opened', function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      }
      else{
        console.log('not first time');
      }
      // the file exists if there are no other errors
    });*/
    this.openTC();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    // setting up an event listener to read data that background process
    // will send via the main process after processing the data we
    // send from visiable renderer process
    ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
      console.log(args);
      // var len = args.length-3;
      // var i;
      // for(i = 0; i < len; i++){
      //   if(args[i] + args[i+1] + args[i+2] + args[i+3] == 'DONE'){
      //     this.closeProgBar();
      //     this.openDone();
      //   }
      //   else if(args[i] + args[i+1] + args[i+2] + args[i+3] == 'EXPI'){
      //     this.closeProgBar();
      //     this.setState({expiredOpen: true});
      //   }
      // }
      this.closeProgBar();
      this.openDone();
    });
    // trigger event to start background process
    // can be triggered pretty much from anywhere after
    // you have set up a listener to get the information
    // back from background process, as I have done in line 13
  }

  openTC(){
    this.setState({tcOpen: true});
  }

  closeTC(){
    this.setState({tcOpen: false});
  }

  openProgBar() {
    this.setState({progbarOpen: true});
  }

  closeProgBar() {
    this.setState({progbarOpen: false});
  }

  openDone(){
    this.setState({doneOpen: true});
  }

  closeDone(){
    this.setState({doneOpen: false});
  }

  closeExpired(){
    this.setState({expiredOpen: false});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  onChangeHandler=event=>{

    console.log(event.target.files);
    var len = event.target.files.length;
    var i;
    for(i = 0; i < len; i++){
      let videoFilePath = URL.createObjectURL(event.target.files[i]);
      let newTile = {title: event.target.files[i].name, source: videoFilePath, path: event.target.files[i].path};
      this.setState(previousState => ({
        tiles: [...previousState.tiles, newTile]
      }));
      VIDPATHS.push(event.target.files[i].path);
    }
    console.log(VIDPATHS);
    //tileData.push({title: event.target.files[0].name, source: event.target.files[0].path});
  }

  onSubmit = (e) => {
    e.preventDefault()

  }

  onFolderChange=event=>{
    console.log(event.target.files[0].webkitdirectoy);
  }

  deleteVid = (vidToDelete, vidSource) => {
    console.log(vidToDelete)
    console.log(vidSource)
    this.setState(previousState => ({
      tiles: [
        ...previousState.tiles.filter(tile => tile.title !== vidToDelete)
      ]
    }));
    VIDPATHS = VIDPATHS.filter(path => path !== vidSource);
    console.log(this.state.tiles);
    console.log(VIDPATHS);
  }

  runBackend() {
    if(VIDPATHS.length != 0){
      this.openProgBar();
      var filearray = JSON.stringify(VIDPATHS);
      console.log(filearray);
      ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
        number: filearray
        });
    }
    
  }

  render(){
    return (
      <ThemeProvider theme={theme}>
      <Container>
      <DonePopup open={this.state.doneOpen} onClose={this.closeDone}/>
      <ExpiredPopup open={this.state.expiredOpen} onClose={this.closeExpired}/>
      <TermsandConditionsPopup open={this.state.tcOpen} onClose={this.closeTC}/>
        <Box p={1}>
          <img src={logo} width='7%'height='7%'></img>
          <Typography variant="h5" component="h3" align='center'>
            Welcome to OPUS!
          </Typography>
        </Box>
        <ProgBarPopup open={this.state.progbarOpen} onClose={this.closeProgBar} runBackend={this.runBackend} onChange={this.onFolderChange}
        onSubmit={this.onSubmit}/>
        <GridList cellHeight='auto' cols={3} spacing={10} style={{height:this.state.height*0.73}}>
          {this.state.tiles.map((tile) => (
            <GridListTile key={tile.title}> 
            <IconButton disabled={true}></IconButton>
            <GridListTileBar
              title={tile.title}
              titlePosition="top"
              style={{background:'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
              'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'}}
              actionIcon={<div>
                <IconButton onClick={() => this.deleteVid(tile.title, tile.path)}><HighlightOffIcon fontSize="default" color="secondary" /></IconButton>
                </div>}
              actionPosition = "right"
              />
              <ReactPlayer width={280} height={180} url={tile.source} controls></ReactPlayer>
            </GridListTile>
          ))}
        </GridList>
        <Grid container direction="row" justify="space-between" alignItems="flex-end" spacing={6}>
          <Grid item xs={6}  position='fixed'>
            <Button style={{ bottom: 3, left: 3 }}color='primary' variant='contained' onClick={this.runBackend}>Create Ensemble!</Button>
          </Grid>
          <Grid item xs={3} right={1} alignContent='flex-end' > 
          <label htmlFor="upload-video">
            <input
              style={{ display: 'none' }}
              id="upload-video"
              name="upload-video"
              type="file"
              onChange={this.onChangeHandler}
              onSubmit={this.onSubmit}
              multiple
            />
  
            <Button style={{ bottom: 3, right: 0 }} color='primary' variant='contained' component="span"> 
              Add Videos
            </Button>
          </label>
          </Grid>
        </Grid>
      </Container>
      </ThemeProvider>
    );
  }
  
}


let styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}

export default App;

function ProgBarPopup(props) {
  const { onClose, open} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog disableBackdropClick={true} fullWidth={true} maxWidth='xs' onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Creating Ensemble...</DialogTitle>
      <LinearProgress variant='indeterminate'></LinearProgress>
    </Dialog>
  );
}

ProgBarPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function DonePopup(props) {
  const { onClose, open} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Ensemble complete!</DialogTitle>
      <Grid container direction='column' alignItems='center' justify='center' spacing={1}>
        <Grid item>
          <Typography>Check your Desktop folder for the finished product.</Typography>
        </Grid>
        <Grid item>
          <Button maxWidth='sm' variant='contained' onClick={onClose}>OK</Button>
        </Grid>
        <Grid item>
          <IconButton disabled={true}></IconButton>
        </Grid>
      </Grid>
    </Dialog>
  );
}

DonePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function ExpiredPopup(props) {
  const { onClose, open} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Error: software is expired.</DialogTitle>
    </Dialog>
  );
}

ExpiredPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function TermsandConditionsPopup(props) {
  const { onClose, open} = props;

  const handleClose = () => {
    onClose();
  };

  // react-pdf
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Dialog disableBackdropClick={true} fullWidth={true} maxWidth='sm' onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <div style={{ overflowX: "hidden" }}>
        <Grid container direction='column' alignItems='center' justify='center' spacing={1}>
          <Grid item>
          <div>
          <Document
            file={ToU}
            onLoadSuccess={onDocumentLoadSuccess}
          >
          {Array.from(Array(numPages), (_, i) => i + 1).map(page => (
              <Page pageNumber={page} />
          ))}
          </Document>
        </div>
            </Grid>
        </Grid>
        <Grid container direction='column' alignItems='center' justify='center' spacing={1}>
          <Grid item> 
            <Button maxWidth='sm' variant='contained' onClick={onClose}>AGREE</Button>
          </Grid>
        </Grid>
      </div>
      
      
    </Dialog>
  );
}

TermsandConditionsPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};