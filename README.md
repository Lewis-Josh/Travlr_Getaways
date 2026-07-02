# CS-465
CS-465 Full Stack Development with MEAN

# Travlr Getaways

## Project Overview

Travlr Getaways is a full stack travel web application created as part of my computer science coursework. The application was developed using the MEAN stack: MongoDB, Express, Angular, and Node.js. It includes a public-facing customer website and a separate Angular administrator single-page application for managing travel packages.

The project demonstrates full stack development concepts, including server-side routing, RESTful API design, MongoDB database integration, Angular component-based architecture, form handling, and JSON Web Token authentication.

## Current Application State

The current version of Travlr Getaways includes two major user experiences:

1. A customer-facing website built with Express, Node.js, and Handlebars templates.
2. An administrator single-page application built with Angular.

The customer-facing site allows users to browse available travel packages. Trip information is retrieved dynamically from the backend instead of being hard-coded into static HTML pages.

The Angular administrator application allows authenticated users to view trips, add new trips, and edit existing trip records. Administrator actions are connected to protected REST API endpoints and require a valid JWT token.

## Technology Stack

### Front End

* Angular
* TypeScript
* HTML
* CSS
* Bootstrap
* Handlebars templates for the public-facing Express views

### Back End

* Node.js
* Express.js
* RESTful API routing
* Passport.js local authentication
* JSON Web Tokens

### Database

* MongoDB
* Mongoose object data modeling

### Development Tools

* Visual Studio Code
* Git and GitHub
* Postman for API testing
* Browser developer tools
* npm package management

## Application Architecture

Travlr Getaways follows a layered full stack architecture.

The public website is served by Express and uses MVC routing. The browser sends requests to Express routes, which forward requests to controllers. The controllers retrieve trip data through the API and render the data through Handlebars views.

The Angular administrator application runs as a separate SPA. It communicates with the backend through HTTP requests to the REST API. The Angular application uses services to retrieve, create, and update trip data. It also stores JWT tokens in browser storage after login so protected API requests can be authorized.

MongoDB stores the trip records and user authentication data. Mongoose schemas define the structure of the application data and provide the connection between the Express API and MongoDB.

## Current Features

### Customer-Facing Website

* Public travel website
* Dynamic Travel page
* Trip data rendered through Handlebars templates
* Express MVC structure
* Static assets served through the public directory

### Administrator SPA

* Angular-based admin interface
* Trip listing page
* Trip cards displaying travel package details
* Add Trip form
* Edit Trip form
* Login and logout navigation
* Conditional display of admin actions based on login status

### API Functionality

The backend API currently supports:

| Method | Endpoint               | Purpose                                             |
| ------ | ---------------------- | --------------------------------------------------- |
| GET    | `/api/trips`           | Retrieve all trip records                           |
| GET    | `/api/trips/:tripCode` | Retrieve a single trip by trip code                 |
| POST   | `/api/trips`           | Add a new trip record                               |
| PUT    | `/api/trips/:tripCode` | Update an existing trip record                      |
| POST   | `/api/register`        | Register an administrator user                      |
| POST   | `/api/login`           | Authenticate an administrator user and return a JWT |

### Security

The application includes a basic authentication and authorization flow using Passport.js and JSON Web Tokens.

Current security features include:

* Password hashing with salt
* Local login strategy with Passport.js
* JWT token generation after login or registration
* Token storage in browser local storage
* Protected POST and PUT trip routes
* Angular login/logout state management
* Conditional display of Edit Trip functionality based on authentication status

## Local Development Setup

This project requires Node.js, npm, Angular CLI, and MongoDB.

### 1. Clone the Repository

```bash
git clone [repository-url]
cd travlr
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root project directory and add the JWT secret:

```bash
JWT_SECRET=yourSecretHere
```

### 4. Start MongoDB

Make sure MongoDB is running locally.

The application currently expects the database connection to use the local MongoDB instance and the `travlr` database.

### 5. Start the Express Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

### 6. Start the Angular Admin Application

Open a second terminal:

```bash
cd app_admin
npm install
ng serve
```

The Angular admin application runs on:

```text
http://localhost:4200
```

## Testing Performed

The current application has been tested through a combination of browser testing, Angular developer tools, backend server logs, and Postman API requests.

Testing has included:

* Verifying that the public Travel page loads dynamic trip data
* Verifying that `GET /api/trips` returns trip data from MongoDB
* Verifying that `GET /api/trips/:tripCode` retrieves a single trip
* Testing administrator login
* Confirming that JWT tokens are saved after authentication
* Confirming that protected POST and PUT routes require authentication
* Testing Add Trip functionality from the Angular SPA
* Testing Edit Trip functionality from the Angular SPA
* Verifying that trip updates are reflected in MongoDB and displayed in the admin interface

## Current Limitations

The current version of Travlr Getaways satisfies the original full stack application requirements, but there are several opportunities for improvement.

Planned or recommended future improvements include:

* Add Angular route guards for protected admin routes
* Improve form validation and user feedback
* Add stronger server-side validation
* Add centralized error handling for API responses
* Refactor repeated Add Trip and Edit Trip form logic
* Move API URLs into Angular environment configuration
* Add trip search, filtering, sorting, and recommendation logic
* Add MongoDB indexes for frequently searched fields
* Expand the database model with collections such as bookings, reviews, or saved trips
* Add automated tests for API routes and Angular components
* Improve deployment readiness

## CS 499 Capstone Enhancement Direction

For my CS 499 capstone, I plan to use Travlr Getaways as a single artifact enhanced across the three required computer science categories.

### Software Design and Engineering

The application can be enhanced by improving the Angular and Express architecture. Planned improvements include protected Angular routes, improved validation, cleaner component structure, centralized configuration, better error handling, and stronger documentation.

### Algorithms and Data Structures

The application can be enhanced by adding search, filtering, sorting, and recommendation logic for trip data. This would demonstrate the use of arrays, comparison functions, ranking logic, and data processing techniques to improve how users interact with available travel packages.

### Databases

The application can be enhanced by improving the MongoDB/Mongoose layer. Planned improvements include stronger schema validation, indexes for searchable fields, query-based API endpoints, and possible additional collections such as saved trips, bookings, or reviews.

## Portfolio Purpose

This project demonstrates my ability to design and build a full stack web application using modern web development tools and practices. It shows my growth in software design, database integration, API development, frontend development, authentication, and full stack architecture.

Travlr Getaways will continue to serve as the foundation for my CS 499 capstone enhancements and professional ePortfolio.

## Author

Joshua Lewis

Computer Science Student
Southern New Hampshire University
