# OPUS
The front-end of the app is  bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and the back-end is written in python.
#### Main front-end files:
 - `Start.js`
		 - Electron interface
 - `App.js`
		 - User Interface and pop up windows, etc.
 - `background.html`
		 - Facilitate the front-end and back-end communications
#### Main back-end files:
 - `backend_test.py` 
		- Preprocess the input
 - `virtual_ensemble.py`
		- Core algorithms
#### Dependencies:
 - Node
 - Electron
 - Python 3.7(or higher)
 - Git

## Get Started

 - Run git clone https://github.com/VMET-OPUS/Desktop-PC.git to copy the repo to your local machine. 
 - Create a new branch and name it with your first name.
 - Run `npm install` at the root directory of the project folder on your local machine. This will install all necessary node dependencies for you.
 - Check modules imported in the back-end files in the `pythonfiles` folder. Make sure to install those modules (using `pip3 install xxx`)
 - Run `npm start`

# React Related Information 
## Available Scripts

In the project directory, you can run:

### `npm start`
 
Runs the app in the development mode.<br  />

You can open the Developer Tool using `Ctrl`+`Shift`+`I` on Windows  

### `npm test`
  

Launches the test runner in the interactive watch mode.<br  />

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
  

### `npm run build`
  

Builds the app for production to the `build` folder.<br  />

It correctly bundles React in production mode and optimizes the build for the best performance.
  

The build is minified and the filenames include the hashes.<br  />

Your app is ready to be deployed!
  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
  

### `npm run eject`
  

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
  

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
  

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.
  

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
  

## Learn More (React)
  

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
  

To learn React, check out the [React documentation](https://reactjs.org/).
  

### Code Splitting
  

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting
  

### Analyzing the Bundle Size
  

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size
  

### Making a Progressive Web App
  

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
  

### Advanced Configuration
  

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration
  

### Deployment
  

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment
  

### `npm run build` fails to minify
  

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
