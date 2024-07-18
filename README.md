# UniSafe MOBILE FRONTEND

This section explains how to set up and run UniSafe App in Android studio

## Prerequisites

1. [Flutter (3.14 or higher)](https://flutter.dev/), can be updated by running `flutter upgrade`
2. git

## Setup

Clone repository

```bash
 git clone https://github.com/FYP-UniSafe/frontend-mobile.git
```

Clear Any Cache

```bash
flutter clean
```

Install all required dependencies for the app

```bash
flutter pub get
```

## Development

Duplicate .env.example and rename the copied file to .env and add the required values in the .env

```bash
cp .env.example .env
```

1. Add the Google Maps API Key to the [AppDelegate.swift](/ios/Runner/AppDelegate.swift) in the runner folder in the ios directory. Replace `api_key_here` with your API Key

2. Add the Google Maps API Key to the [AndroidManifest.xml](/android/app/src/main/AndroidManifest.xml) in the android app directory. Replace `api_key_here` with your API Key

Run the app on the available emulator/device

```bash
flutter run
```

## Build

After making the changes we build the application by following the steps below:

Run the following command to build the application for android

```bash
flutter build apk
```

## Contributing

Contributions are welcome. Please follow our guidelines...

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For inquiries, contact [Reuben William Mollam](mailto:euphoricreuben@gmail.com).

# UniSafe WEB FRONTEND
## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: The runtime environment for running JavaScript on the server side. This project requires Node.js version 18.19.0. Download and install it from [Node.js official website](https://nodejs.org/).

- **Angular CLI**: The command-line interface tool that you use to initialize, develop, scaffold, and maintain Angular applications. This project uses Angular CLI version 17.3.8. Install it globally via npm:

```bash
  npm install -g @angular/cli@17.3.8
```

- **Angular Framework**: This project is developed with Angular version 17.3.10. Ensure that your Angular CLI is compatible with this version by installing the specific version of Angular CLI mentioned above.

- **Git**: Version control system for tracking changes in source code during software development. Download and install it from [Git's official website](https://git-scm.com/).

## Installation

To install and set up the project, follow these steps:

1. **Clone the repository:**

```bash
   git clone https://github.com/FYP-UniSafe/Frontend_Web.git
```

2. **Navigate to the project directory:**

```bash
   cd UniSafe
```

3. **Install dependencies:**

```bash
   npm install
```

4. **Serve the application:**

```bash
   ng serve
```

   This command will compile the application and start a web server. By default, the application will be available at `http://localhost:4200/`.

5. **Open your browser and navigate to `http://localhost:4200/` to view the application.**

## Development to Vercel (Shared Hosting was used)

To deploy the Angular project to Vercel, follow these steps:

1. If you haven't already, install the Vercel CLI globally:

```bash
   npm i -g vercel
```

2. Navigate to the root of your project directory.
3. Run the following command to deploy your project to Vercel:

```bash
   vercel deploy --prod
```

   This command deploys your project and provides you with a production URL. Follow the prompts in your terminal to set up your project on Vercel the first time you run it.

For more detailed instructions and configuration options, refer to the [Vercel documentation](https://vercel.com/docs).

## Contributing
**Contact**
For inquiries, contact [Mandy, Nuhu Paschal](mailto:caljr9301@gmail.com).