from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_wtf import CSRFProtect
from flask_talisman import Talisman
from .config import get_config
import os
import click

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
csrf = CSRFProtect()


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(get_config())
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError:
        pass
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    
    # Configure Flask-Login
    login_manager.login_view = "auth.login"
    login_manager.login_message_category = "warning"
    login_manager.session_protection = "strong"
    
    # User loader
    from .models.user import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.main import main_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    
    # Security headers (Talisman disabled for development)
    if app.config.get("ENABLE_TALISMAN", False):
        Talisman(
            app,
            content_security_policy=app.config.get("CSP"),
            frame_options="DENY",
            force_https=app.config.get("PREFER_SECURE_COOKIES", False)
        )
    
    @app.after_request
    def set_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        return response
    
    # CLI commands
    @app.cli.command("create-admin")
    @click.option("--username", prompt=True, envvar="ADMIN_USERNAME", help="Admin username (can be set via ADMIN_USERNAME)")
    @click.option("--email", prompt=True, envvar="ADMIN_EMAIL", help="Admin email (can be set via ADMIN_EMAIL)")
    @click.option(
        "--password",
        prompt=True,
        hide_input=True,
        confirmation_prompt=True,
        envvar="ADMIN_PASSWORD",
        help="Admin password (can be set via ADMIN_PASSWORD). If provided via env/option, no confirmation is prompted."
    )
    @click.option(
        "--update-existing",
        is_flag=True,
        default=False,
        help="If a user with the given username or email exists, update their password and role to admin instead of failing."
    )
    def create_admin(username, email, password, update_existing):
        """Create an admin user, or update existing with --update-existing."""
        username = username.strip().lower()
        email = email.strip().lower()

        # Detect conflicts where username and email belong to different users
        existing_by_username = User.query.filter_by(username=username).first()
        existing_by_email = User.query.filter_by(email=email).first()
        if existing_by_username and existing_by_email and existing_by_username.id != existing_by_email.id:
            click.echo("Conflict: the provided username and email belong to different existing users. Please resolve and retry.")
            return

        existing = existing_by_username or existing_by_email
        if existing:
            if not update_existing:
                click.echo("User with that username or email already exists. Re-run with --update-existing to update password and role.")
                return
            existing.username = username
            existing.email = email
            existing.role = "admin"
            existing.set_password(password)
            db.session.commit()
            click.echo("Existing user updated to admin and password reset.")
            return

        user = User(username=username, email=email, role="admin")
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        click.echo("Admin user created successfully.")
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
