# District Frontend

##Quick start

1. Make sure that you have Node.js and npm installed.
2. Clone this repo using `git clone https://github.com/nxn-2019/iDistrictFrontend.git <YOUR_PROJECT_NAME>`
3. Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`
4. Copy the content of `.env.example` file into a new file `.env`
5. Run `npm install`
6. Run `npm start`

Now open http://localhost:3000

## Command Line Commands

### Development

```
npm run start
```

Starts the development server running on `http://localhost:3000`

### Building

```
npm run build
```

Preps your app for deployment (does not run tests). Optimizes and minifies all files, piping them to the `build` folder.

Upload the contents of `build` to your web server to
see your work live!

### Linting

```Shell
npm run lint
```

Lints your JavaScript and your CSS.

## Files Structure

- src
  - api
    - authenticated.js: API instance responsible for sending HTTP requests
  - assets: Contains all the app images, fonts, and common css
  - reduxStore: contains app global store
  - components: Contains all the app components
  - containers: contains all the app containers
    - ActionDetails.js: Screen that opens when a user click on a action (like surveillance or people search)
    - 404Page: contains not found route page
    - ActionDetails: contains action for opening iframe or other actions
    - App: Main app page
    - Dashboard: Dashboard screen containing the insights and the charts
    - Home: App home screen containing the map and the dashboard screen
    - Reducers: Redux reducers
    - Slider: Slider screen which opens when a user clicks on the expand icon in the dashboard
    - Login: Login interface
    - sideBar: sideBar with actions : district selection/logout/reports
  - routes: contains the app routes with config
  - services - contains the app APIs
  - config.js - app configuration file - index.js - app entry point
- .eslintrc: ESlint configuration file
- .prettierc: Prettier configuration file
- DockerFile: A text document that contains all the commands a user could call on the command line to assemble an image
- nginx.conf: NGINX configuration need for the docker build

## Deployment Steps

1.  Login to the server
2.  Pull the changes from git
3.  Run the deleteRunningContainer.sh file using this command: `./deleteRunningContainer.sh`
4.  Run the build.sh file using this command: `./build.sh` or `./build.sh "--env-file ./.env.dubai"`
