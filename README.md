# Flask Secure Auth

A robust and secure user authentication system built with Flask, providing a solid foundation for web applications requiring user management. This project emphasizes security best practices, including password hashing, CSRF protection, and secure session management.

## About The Project

This project is a complete authentication system featuring user registration, login, and a protected dashboard. It is designed to be easily extensible and integrated into larger Flask applications. The frontend is built with vanilla JavaScript and communicates with the Flask backend.

## Features

*   **User Authentication:** Secure user registration and login functionality.
*   **Password Hashing:** Uses Flask-Bcrypt for hashing user passwords.
*   **Session Management:** Employs Flask-Login for secure session handling.
*   **CSRF Protection:** Integrated with Flask-WTF to prevent Cross-Site Request Forgery attacks.
*   **Role-Based Access Control:** Simple role system with 'user' and 'admin' roles.
*   **Protected Routes:** Example of a protected route that requires authentication.
*   **Command-Line Interface:** Includes a CLI for creating an admin user.
*   **Security Headers:** Utilizes Flask-Talisman to set security headers.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Python 3.6+
*   Pip

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/PRODIGY_FS_01.git
    cd PRODIGY_FS_01
    ```
2.  **Create and activate a virtual environment:**
    ```sh
    python -m venv .venv
    # On Windows
    .venv\Scripts\activate
    # On macOS/Linux
    source .venv/bin/activate
    ```
3.  **Install the dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
4.  **Create a `.env` file** in the root directory and add the following environment variables:
    ```env
    SECRET_KEY='a-very-secret-key'
    FLASK_ENV='development'
    # Optional: For the admin user creation CLI
    ADMIN_USERNAME='admin'
    ADMIN_EMAIL='admin@example.com'
    ADMIN_PASSWORD='a-strong-password'
    ```

## Usage

1.  **Run the application:**
    ```sh
    flask run
    ```
2.  Open your browser and navigate to `http://127.0.0.1:5000`.

## CLI Commands

This project includes a command-line interface to simplify common tasks.

### Create an Admin User

You can create an admin user directly from the command line.

```sh
flask create-admin
```

You will be prompted to enter a username, email, and password for the new admin user. You can also provide these as options or environment variables.

## Security

This project incorporates several security best practices:

*   **Password Hashing:** Passwords are never stored in plain text. Instead, they are hashed using `bcrypt`.
*   **CSRF Protection:** All forms are protected against Cross-Site Request Forgery (CSRF) attacks using `Flask-WTF`.
*   **Secure Headers:** `Flask-Talisman` is used to set various security headers, such as `Content-Security-Policy` and `X-Frame-Options`.
*   **Session Protection:** `Flask-Login` is configured for "strong" session protection.

## Technologies Used

*   [Flask](https://flask.palletsprojects.com/)
*   [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
*   [Flask-Login](https://flask-login.readthedocs.io/)
*   [Flask-WTF](https://flask-wtf.readthedocs.io/)
*   [Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/)
*   [Flask-Talisman](https://github.com/GoogleCloudPlatform/flask-talisman)
*   [SQLite](https://www.sqlite.org/)
*   [Jinja2](https://jinja.palletsprojects.com/)
*   [Vanilla JavaScript](http://vanilla-js.com/)