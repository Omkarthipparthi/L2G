
# Leet2Git

This is an Angular application named **Leet2Git**. Follow the instructions below to set up and run the application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm - Node Package Manager)
- [Angular CLI](https://angular.io/cli)

## Getting Started

### 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone <repository-url>
cd Leet2Git
```

### 2. Install Dependencies

Navigate to the project root directory (where the `angular.json` file is located) and run:

```bash
npm install
```

### 3. Run the Development Server

Start the development server with the following command:

```bash
ng serve
```

The application will be available at `http://localhost:4200/`. Open this URL in your web browser to view the app.

### Additional Commands

- **Run on a different port:**
  ```bash
  ng serve --port 4201
  ```

- **Build for Production:**
  To create a production build, run:
  ```bash
  ng build --configuration production
  ```
  This will generate compiled assets in the `dist/leet2-git` folder.

- **Run Tests:**
  To execute tests, use:
  ```bash
  ng test
  ```

### Troubleshooting

If you encounter issues with Angular CLI commands not being recognized, you may need to install Angular CLI globally:

```bash
npm install -g @angular/cli
```

## License

This project is licensed under the MIT License.
