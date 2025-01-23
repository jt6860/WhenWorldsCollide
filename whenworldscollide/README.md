# When Worlds Collide Pizza

## Table of Contents

*   [Description](#description)
*   [Features](#features)
*   [Component Details](#component-details)
    *   [App Component](#app-component)
    *   [Home Component](#home-component)
    *   [Menu Component](#menu-component)
    *   [Order Component](#order-component)
    *   [Contact Component](#contact-component)
    *   [Admin Component](#admin-component)
    *   [Menu Editing Component](#menu-editing-component)
    *   [Edit Menu Item Dialog Component](#edit-menu-item-dialog-component)
    *   [Contact Submission Component](#contact-submission-component)
    *   [Order List Component](#order-list-component)
    *   [Auth Service](#auth-service)
    *   [Menu Service](#menu-service)
*   [Technologies Used](#technologies-used)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Running the Application](#running-the-application)
        *   [Development](#development)
        *   [Production (Building and Packaging)](#production-building-and-packaging)
*   [Testing](#testing)
*   [Database](#database)
*   [Authentication](#authentication)
*   [API Endpoints](#api-endpoints)
*   [Contributing](#contributing)
*   [License](#license)

---

## Description

**When Worlds Collide** is a desktop application for a hypothetical pizza restaurant. It's built using Angular for the frontend, Express for the backend, SQLite for the database, and packaged with Electron for a cross-platform desktop experience. The application allows users to browse the menu, place orders, and contact the restaurant. It also provides an admin interface for managing the menu and viewing orders and contact submissions.

This project was developed as a Group Capstone Project for CS492 by John Torres, Rachael Marshall, Deninson Munoz, and Joseph Collins.

---

## Features

*   **Home (`/home`):** Landing page introducing When Worlds Collide Pizza and its unique concept.

*   **Menu (`/menu`):**
    *   Displays the pizza menu, neatly organized by category.
    *   Shows each item's name, description, category, and price.

*   **Order (`/order`):**
    *   Allows users to browse the menu and add items to their order.
    *   Displays a summary of the order, including quantity and total price.
    *   Collects the customer's name for order identification.
    *   Submits the order to the backend for processing.
    *   Provides order confirmation or error messages.

*   **Contact (`/contact`):**
    *   Presents a contact form for users to send inquiries or feedback.
    *   Collects the user's name, email, and message.
    *   Submits the form data to the backend.
    *   Provides feedback on successful submission or errors.

*   **Admin (`/admin`):** (Requires Authentication)
    *   **Login/Registration:** Allows admins to log in or switch to a registration form.
    *   **Menu Editing:**
        *   Displays a list of all menu items.
        *   Allows authorized users to edit menu items using a modal dialog (powered by Angular Material's `MatDialog`).
        *   Updates menu items in the database and refreshes the list.
    *   **Order List:**
        *   Displays a table of all placed orders.
        *   Shows order ID, customer name, order items with quantity and price, and total price.
        *   Parses order items from JSON format for display.
    *   **Contact Submissions:**
        *   Displays a table of messages received through the contact form.
        *   Shows submission ID, name, email, and message.

---

## Component Details

This section provides a detailed overview of each component within the application, including their selectors, file locations, and descriptions of their functionality.

### App Component

*   **Selector:** `app-root`
*   **File:** `src/app/app.component.ts`, `src/app/app.component.html`
*   **Description:** The root component of the application.
    *   Handles the main layout, including the header, navigation, main content area (using `<router-outlet>`), and footer.
    *   Manages the display of the mobile menu using `showMenu`.
    *   Tracks the user's login status and displays the current username using `isLoggedIn` and `currentUsername`.
    *   Provides a logout function `onLogout()`.
    *   Uses `AuthService` to manage user authentication and session.
    *   Listens for the `beforeunload` event to log the user out when the window is closed.

### Home Component

*   **Selector:** `app-home`
*   **File:** `src/app/home/home.component.ts`, `src/app/home/home.component.html`
*   **Description:** Displays a welcome message and a brief introduction to the restaurant's concept.

### Menu Component

*   **Selector:** `app-menu`
*   **File:** `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.html`
*   **Description:** Displays the restaurant's menu.
    *   Fetches menu items from the `MenuService`.
    *   Iterates through the `menuItems` array and displays each item's name, description, category, and price.

### Order Component

*   **Selector:** `app-order`
*   **File:** `src/app/order/order.component.ts`, `src/app/order/order.component.html`
*   **Description:** Handles the order placement process.
    *   Displays the menu items, allowing users to add them to their order with `addToOrder()`.
    *   Manages the `orderItems` array, keeping track of selected items and quantities.
    *   Allows users to update quantities using `updateQuantity()` and remove items using `removeFromOrder()`.
    *   Calculates the `orderTotal` dynamically.
    *   Collects the customer's name using `customerName`.
    *   Submits the order to the backend using `submitOrder()`, sending the customer's name, order items (as a JSON string), and total price.
    *   Displays `confirmationMessage` or `errorMessage` based on the order submission result.

### Contact Component

*   **Selector:** `app-contact`
*   **File:** `src/app/contact/contact.component.ts`, `src/app/contact/contact.component.html`
*   **Description:** Provides a contact form for user inquiries.
    *   Uses Angular's `FormBuilder` and `ReactiveFormsModule` to create a form with `name`, `email`, and `message` fields.
    *   Includes validation using `Validators`.
    *   Submits the form data to the backend using `onSubmit()`.
    *   Displays a `responseMessage` to provide feedback to the user.

### Admin Component

*   **Selector:** `app-admin`
*   **File:** `src/app/admin/admin.component.ts`, `src/app/admin/admin.component.html`
*   **Description:** The main component for the admin section.
    *   Handles admin login and logout using `AuthService`.
    *   Provides navigation between "Menu Editing," "Contact Submissions," and "Customer Orders" sections using `activeSection` and `showSection()`.
    *   Conditionally renders the appropriate admin sub-component (`app-menu-editing`, `app-contact-submission`, or `app-order-list`) based on `activeSection`.

### Menu Editing Component

*   **Selector:** `app-menu-editing`
*   **File:** `src/app/menu-editing/menu-editing.component.ts`, `src/app/menu-editing/menu-editing.component.html`
*   **Description:** Allows admins to edit menu items.
    *   Fetches menu items from the `MenuService`.
    *   Uses Angular Material's `MatDialog` to open the `EditMenuItemDialogComponent` when the "Edit" button is clicked.
    *   Passes the selected menu item to the dialog for editing.
    *   Updates the menu item in the database using `MenuService.updateMenuItem()` and refreshes the list.

### Edit Menu Item Dialog Component

*   **Selector:** `app-edit-menu-item-dialog`
*   **File:** `src/app/edit-menu-item-dialog/edit-menu-item-dialog.component.ts`, `src/app/edit-menu-item-dialog/edit-menu-item-dialog.component.html`
*   **Description:** A modal dialog for editing menu item details.
    *   Uses Angular Material's form field components (`mat-form-field`, `mat-input`).
    *   Provides "Cancel" and "Save" buttons.
    *   Closes the dialog and returns the updated `menuItem` when "Save" is clicked.

### Contact Submission Component

*   **Selector:** `app-contact-submission`
*   **File:** `src/app/contact-submission/contact-submission.component.ts`, `src/app/contact-submission/contact-submission.component.html`
*   **Description:** Displays contact form submissions.
    *   Fetches contact submissions from the backend.
    *   Displays the submissions in an HTML table, showing ID, name, email, and message.

### Order List Component

*   **Selector:** `app-order-list`
*   **File:** `src/app/order-list/order-list.component.ts`, `src/app/order-list/order-list.component.html`
*   **Description:** Displays a list of customer orders.
    *   Fetches orders from the backend.
    *   Displays the orders in an HTML table, showing order ID, customer name, order items, and total price.
    *   Uses `parseOrderItems()` to convert the JSON string representation of order items into an array of objects with item name, quantity, and price. It uses `MenuService` to get menu item details based on IDs.

### Auth Service

*   **File:** `src/app/auth.service.ts`
*   **Description:** Handles user authentication.
    *   Provides `login()` and `logout()` methods.
    *   Uses `HttpClient` to communicate with the backend's `/api/login` endpoint.
    *   Manages the user's login status using `isLoggedIn$` and `currentUser$` observables.
    *   Stores the login status and current username in `sessionStorage`.
    *   Handles login errors with clear messages.

### Menu Service

*   **File:** `src/app/menu.service.ts`
*   **Description:** Manages menu item data.
    *   Provides methods to load menu items (`loadMenuItems()`), get a menu item by ID (`getMenuItemById()`), and update a menu item (`updateMenuItem()`).
    *   Uses `HttpClient` to communicate with the backend's `/api/menu` endpoint.
    *   Uses a `BehaviorSubject` (`menuItemsSubject`) to manage the menu items and an observable (`menuItems$`) to allow components to subscribe to changes.

---

## Technologies Used

*   **Frontend:**
    *   Angular
    *   Angular Material (for UI components like dialogs, tables, form fields, buttons, and toolbar)
    *   RxJS (for Observables)
*   **Backend:**
    *   Express.js
*   **Database:**
    *   SQLite
*   **Packaging:**
    *   Electron
    *   Electron Forge

---

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (usually comes with Node.js)
*   Angular CLI
*   Electron
*   Electron Forge

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd whenworldscollide
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Application

#### Development

1.  **Start the backend server:**

    ```bash
    node start-backend.js
    ```

    or

    ```bash
    npm run start:backend
    ```

2.  **Start the Angular development server (in a separate terminal):**

    ```bash
    npm run proxystart
    ```

    This will open the application in your default browser, typically at `http://localhost:4200/`. The `proxystart` script uses a proxy to route API requests to the backend server running on port 3000.

#### Production (Building and Packaging)

1.  **Build the Angular application:**

    ```bash
    npm run build
    ```

2.  **Package the application using Electron Forge:**

    *   To make executables for your current OS:

        ```bash
        npm run make
        ```

    *   To make a distributable zip file for all supported platforms:

        ```bash
        npm run make-zip-direct
        ```

    The output will be located in the `out` directory.

---

## Testing

```bash
npm run test

This command will run the unit tests using Karma.

## Database

The application uses an **SQLite** database located at `backend/userData/whenworldscollide.db`. The database is pre-populated with sample data for menu items, admin credentials, and customer orders. The `database.js` file handles database interactions and initialization.

## Authentication

The admin section of the application is protected by basic authentication. The default admin credentials are:

*   jtorres: passwordjt
*   rmarshall: passwordrm
*   dmunoz: passworddm
*   jcollins: passwordjc

These credentials are created upon the first initialization of the database.

## API Endpoints

| Method | Endpoint          | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/api/menu`       | Retrieves all menu items.                 |
| GET    | `/api/contact`    | Retrieves all contact submissions.        |
| GET    | `/api/orders`     | Retrieves all orders.                     |
| POST   | `/api/contact`    | Submits a new contact form.               |
| POST   | `/api/login`      | Authenticates an admin user.              |
| POST   | `/api/register`   | Registers a new admin user.              |
| POST   | `/api/orders`     | Submits a new order.                      |
| PUT    | `/api/menu/:id`   | Updates a menu item with the given ID. |
