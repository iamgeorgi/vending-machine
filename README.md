# Vending Machine

A responsive vending machine application built with Angular.

The application contains two main areas:

- **Vending Machine** — users can insert coins, purchase products, receive change, and reset the current transaction.
- **Product Management** — products can be created, edited, and deleted in application state.

## Tech Stack

- Angular
- TypeScript
- NgRx Signal Store
- Angular Material
- RxJS
- JSON Server
- SCSS

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm

### Installation

Install project dependencies:

```bash
npm install
```

### Start the Application

Run both the Angular application and the mock API:

```bash
npm run start:all
```

This starts:

- Angular development server
- JSON Server mock API

The application is available at:

```text
http://localhost:4200
```

The mock API is available at:

```text
http://localhost:3000
```

## Running Services Separately

Run only the Angular application:

```bash
npm start
```

Run only the mock API:

```bash
npm run mock-api
```

## Build

Create a production build:

```bash
npm run build
```

## Mock API

Initial product data is provided through JSON Server.

The mock database is located at:

```text
api/db.json
```

The API is used only to load the initial product inventory.

Create, update, and delete operations are performed only in application state and are not persisted back to the mock API.

Because of this, refreshing the browser reloads the original product inventory from `db.json`.

## State Management

The application uses **NgRx Signal Store** for application state management.

The main state areas are:

- Product inventory and CRUD operations
- Current vending transaction
- Inserted coins
- Returned change
- Transaction errors and status

## Currency

The application uses **EUR**.

Accepted coin denominations are:

- €2.00
- €1.00
- €0.50
- €0.20
- €0.10
- €0.05
- €0.02
- €0.01

All monetary values are stored internally as integer cents to avoid floating-point precision issues.

Examples:

```text
€1.25 -> 125
€2.00 -> 200
```

## Inventory

Each individual product can contain between:

```text
0 and 15 units
```

A product with quantity `0` remains visible but cannot be purchased.

## Application Routes

```text
/           Vending Machine
/products   Product Management
```

## Main Features

### Vending Machine

- Display available products
- Insert supported coin denominations
- Display the current inserted balance
- Purchase available products
- Prevent purchases when balance is insufficient
- Prevent purchases when a product is out of stock
- Decrease product inventory after a successful purchase
- Return exact change
- Reset the current transaction
- Return inserted coins when resetting
- Validate that exact change can be returned using supported denominations

### Product Management

- Load initial products from the mock API
- Create products
- Edit products
- Delete products
- Validate product name
- Validate product price
- Validate inventory quantity
- Support quantities between 0 and 15 units
- Keep CRUD changes in application state only

## Product Data

Each product contains information such as:

```text
id
name
category
price
quantity
image
```

Prices are stored internally in cents.

Product images are served from the application's static assets.

## UI

The application uses Angular Material for common UI elements such as:

- Buttons
- Dialogs
- Form controls
- Select inputs
- Icons

Custom SCSS is used for:

- Application layout
- Responsive behavior
- Product cards
- Vending-machine-specific styling
- Transaction and coin-selection sections

## Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

Product grids and vending controls adapt to the available screen width.

## Notes

- Product CRUD operations are intentionally not persisted to the mock backend.
- Refreshing the browser resets in-memory product changes and reloads the initial inventory.
- The mock API represents only the initial external product source.
- Product prices are defined per individual product.
- Different products may have the same price.
- The vending machine is modeled as a digital product catalog rather than a fixed physical slot layout.