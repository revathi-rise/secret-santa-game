# Secret Santa Assignment System

A **NestJS-based Secret Santa generator** that assigns each employee a secret child while avoiding self-assignments and previous year assignments. The system accepts employee and previous year CSV/Excel files as input and generates a CSV output with new assignments.

---

## Features

- Assigns each employee a **unique secret child**.
- **Avoids self-assignment**.
- **Avoids repeating previous year’s assignments**.
- Generates **CSV output** with assignment details.
- Modular, extensible, and fully testable.
- Handles **Excel and CSV inputs**.

---

## Requirements

- Node.js >= 18
- Currently used version v20.19.4
- npm or yarn
- NestJS CLI (for development)

---

## Installation
Installation

Clone the repository:

git clone <repository-url>
cd <repository-folder>


Install dependencies:

npm install
# or using yarn
# yarn install


Run the project:

# Development mode
npm run start

# Watch mode (auto-reload)
npm run start:dev

# Production mode
npm run start:prod


Run tests:

# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch


API Usage – Secret Santa Upload

The Secret Santa system exposes a POST API endpoint to upload employee data and previous year assignments, and generate a new Secret Santa assignment CSV.

Endpoint
POST http://localhost:3000/secret-santa/upload

Request

Content-Type: multipart/form-data

Form Data Keys:

employees – Upload the current employee list file (CSV or Excel).

previous – Upload the previous year’s Secret Santa assignment file (CSV or Excel).

Example using Postman:

Open Postman.

Set method to POST.

Enter the URL:

http://localhost:3000/secret-santa/upload


Go to the Body tab → Select form-data.

Add two keys:

Key	Type	Description
employees	File	Select the current employee list
previous	File	Select previous year assignments

Choose the files for each key using the file chooser.

Response

On successful upload, the API responds with a JSON object containing the message and the path to the generated CSV:

{
    "message": "Assignments generated successfully",
    "status" : true,
    "outputPath": "D:\\secret-santa-game\\assignments\\secret-santa-output.csv"
}


message: Confirms the assignment process completed successfully.

outputPath: Full path where the generated CSV file is stored. The file contains the new Secret Santa assignments.
