# Hummingbird

## Badges

![react badge](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![typescript badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![material ui badge](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![firebase badge](https://img.shields.io/badge/powered%20by%20firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![powered by vite badge](https://img.shields.io/badge/developed%20on%20Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

### Main (Stable)

[![Node CI](https://github.com/Midlight25/hummingbird/actions/workflows/project-ci.yml/badge.svg?branch=main&event=push)](https://github.com/Midlight25/hummingbird/actions/workflows/project-ci.yml)

### Development (Beta)

[![Node CI](https://github.com/Midlight25/hummingbird/actions/workflows/project-ci.yml/badge.svg?branch=develop&event=push)](https://github.com/Midlight25/hummingbird/actions/workflows/project-ci.yml)

## Description

A full-stack web application for analyzing machine learning data and identifying unique entities in that data. What does that look like? We don't know yet.

## Authors

- Holland, Sean | Team Leader
- Burgher, Jordan
- Mesquita, Michael
- Mylett, Kelly

## Tech Stack

### Frontend

For the web application, we are using a combination of React + Typescript.

### Backend

The web application is supported with Firebase, serverless functions are written in Typescript.

## Running This Project

### First Time Setup

When you first clone this project on your local system, you need to install the dependencies for this project, the dependencies for the Cloud Functions and install the Firebase Emulators in order to run this project locally on your system. Installing the dependencies with NPM will also install `firebase-cli` for you, which you will use to install the emulators for local development.

Step 1: Install dependencies

```shell
# From the root directory of this project. 
# Install dependencies for the webapp and for the functions
npm install
cd functions && npm install
```

Step 2: Configure Firebase CLI Locally:

```shell
# From the root directory
# Login with your Google Developer account where you have access to the Hummingbird Project.
npx firebase login
# Check to make sure you can access the Hummingbird Project from the command line.
npx firebase projects:list
```

`firebase-cli` is not installed globally, so you need to preface firebase commands with npx. You can get around this by installing `firebase-cli` globally with `npm install -g firebase-tools` but this is not recommended for various reasons.
*If you get stuck at this set, check out the `firebase-cli` documentation online at [firebase.google.com](https://firebase.google.com/docs/cli).*

Step 3: Install Firebase Emulators

```shell
npx firebase init
```

The program will prompt you to set up configurations for the project;however those configurations already exist in the repository, so this step is not required. From the prompt, only select the `Emulators: Set up local emulators for Firebase products` from the main menu. If prompted to choose a firebase project, make sure that you have selected the Hummingbird Project. You can always run this command again if you feel like you may have made a mistake during setup.

Make sure to select only these emulators when prompted for installation:

- Auth
- Cloud Functions
- Firestore
- Hosting
- Pub/Sub
- Storage

**Do not install the Database Emulator.** It won't hurt you, but it will just wasted space on your hard drive. Select the default values for emulator ports when prompted. The emulators will now be installed on your system. When they are done, you are ready to begin local development.

*Note: The pub/sub emulator requires Java JRE 11 or above to run, so make sure to have that available on your system. If you're struggling to find a Java JRE 11, check out the [OpenJDK Project](https://openjdk.org/).*

### Developing the Project Locally

The project will probably require two terminal sessions to run locally. One session will be running the emulators so that your application has access to resources in order to function properly. The other session will be running the Vite dev server to build and serve your application on your local machine with hot-reloading enabled. I would recommend that you set up either a tmux/tmuxinator script or a screen session so that you can have a convinent "one-command-start" for your local dev environment. *Or you could also just do manual pane management with your terminal application, no one's here to judge.*

To build and serve your application locally, run:

```shell
npm run dev
```

To start the emulators for your local application, run:

```shell
npm run dev:emulators
```

Once the application is built and the emulators have finished their bootstrapping sequence and you haven't changed the port numbers from the defaults, you can navigate to [localhost:3000](http://localhost:3000) to access the local instance of the webapp or navigate to [localhost:4000](http://localhost:4000) to access the Firebase Emulators dashboard.

*Note: The emulators will quit if the Cloud Function have not been compiled at least once. Make sure to run `functions:build` [-> reference](#build-cloud-functions) least once before starting the emulators to avoid this error.*

If you've reached the point in development where you would like to test the application in as close to a Firebase Environment on your local system as you can, you may build the application and serve it with the Firebase Hosting emulator.

```shell
# Build the whole thing
npm run all:build
# Serve it
npm run dev:emulators:all
```

You can also use a single command for checking, building, then serving the project locally.

```shell
npm run fire-all-engines
```

Please note, this may take a long time if you are running these commands for the first time or if you've cleared the Vite build cache recently.

## Scripts

### Building

Suppose you need to build this project.

#### Build Webapp

If you need to build the webapp for your local machine

```shell
npm run build
```

If you need to build the webapp for production, either to deploy or for E2E testing. **PROVIDED YOU HAVE A `.env.production` FILE ON YOUR MACHINE.** Vite will build the webapp for production, meaning *production access keys will be embeded into your built artifacts and the code that makes the webapp access the emulators will be disabled.* Be extremely sure that you need to run this command: even if production-artifacts are run locally on your system and the emulators are running, **they will still access our production resources online.**

```shell
npm run build:prod
```

#### Build Cloud Functions

If you need to build the artifacts for the Cloud Functions.

```shell
npm run functions:build
```

There is no option for building functions for production since the Cloud Function artifacts do not currently require production access keys or configs. However, this could change in the future.

#### Build Everything

If you need to build both the Webapp and the Cloud Functions at the same time, a script has been provided for your convinence.

```shell
npm run all:build
```

This build process is not performed concurrently. This could change in the future. If you need to build the entire product for production (maybe you're deploying it), you may run this script.

```shell
npm run all:build:prod
```

### Local Development

These scripts are related to running the app in your local environment.

#### Webapp

To start up the dev server, which gives you automatic building of your webapp and hot reloading:

```shell
npm run dev
```

To start up the firebase emulators for local development, sans the hosting emulator since the Vite Dev Server is the one technically hosting the Webapp in this instance:

```shell
npm run dev:emulators
```

If you want to start the full suite of firebase emulators, including the hosting emulator, run:

```shell
npm run dev:emulators:all
```

*Note: The hosting emulator will only work if there are build artifacts that in `/dist`. It does also not support hot reloading. Please don't use it to actively write code.* If you really want to start the full suite of emulators, you will need to build the project first. Alternatively, you can use `fire-all-engines` [*-> reference*](#everything-at-once).

*Note: The emulators will quit if the Cloud Function have not been compiled at least once. Make sure to run `functions:build` [-> reference](#build-cloud-functions) least once before starting the emulators to avoid this error.*

To lint your code using ESlint, use:

```shell
npm run lint
```

If there are code issues that ESLint can fix for you, use:

```shell
npm run lint:fix
```

To type-check your code using the Typescript Compiler, use:

```shell
npm run type-check
```

If you wish to trigger both linting and type-checking at the once, use:

```shell
npm run check
```

*Note: this command will not fix code issues for you.*

If you find yourself in need of cleaning up your environment, these commands have been provided for you.

If you need to clean out the build artifacts, use:

```shell
npm run clean:artifacts
```

If you need to clean your directory of all the debug log files from the Firebase Emulators, use:

```shell
npm run clean:debug
```

If you need to clear the vite cache, use:

```shell
npn run clean:vite
```

If you would like to clean out both debug files and the vite artifacts all at once: use,

```shell
npm run clean
```

#### Cloud Functions

To compile the Cloud Function and serve them with the Functions Emulator, use:

```shell
npm run functions:serve
```

*Note: This command does compile the functions in real time and does not enable hot-reloading.*

The Functions Emulator does indeed support hot-reloading as long as something is built to `functions/dist`. But because the Functions Emulator does not compile the code like Vite does for it's dev server, you will need something to compile the commands in real time for the Functions Emulator to hot-reload the code.

To compile the Cloud Functions and enable watching for recompilation on change, use:

```shell
npm run functions:build:watch
```

*Note: you will need another terminal session to run the Functions Emulator as currently there is no support for concurrently running the compiler and running the emulator using a single command.* This may change in the future. I recommend that you setup something with tmux and tmuxinator if you really want that one-command-start experience.

To compile the Cloud Functions and start an interactive shell in the Firebase Emulator, use:

```shell
npm run functions:shell
```

*Note: This command does not enable hot-reloading of Cloud Functions. I recommend using this command in conjunction with `functions:build:watch` [-> reference](#cloud-functions) to enable that experience. There is currently no support for running these commands concurrently.

To lint and type-check Cloud Functions code at once, run:

```shell
npm run functions:check
```

*Note: There is currently no support for running linting or type-checking on Cloud Functions code independently from the base project directory. If you need to run either tool indepdently, change into the `functions/` directory and run the requiste scripts from in there. Check out `functions/package.json` for all Cloud Functions NPM Scripts.

To let ESLint attempt to fix some of your code's problems for you, run:

```shell
npm run functions:fix
```

If you need to clean out the Cloud Functions build artifacts, use:

```shell
npm run functions:clean
```

#### EVERYTHING AT ONCE

If you would like to check your code, compile both the Webapp and the Cloud Functions, and then start the entire emulation suite to serve your compiled artifacts, use:

```shell
npm run fire-all-engines
```

In essence, this command will build everything required for the application to run and then start everything that is required for the application to run successfull on your local system. If ESLint or the Typescript Compiler reports any problems with your code, the project will not be built and the emulators will not be started. Fix your code's issues and run this command again. This behavior is intentional.

### Deployment

Developers should never be the ones to deploy the project to production unless it's an emergency. Deployment will be handled by our CI/CD system Github Actions. If there is an emergency, contact a project administrator immediately.
