import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or "sqlite:///" + os.path.join(os.getcwd(), "instance", "secure-auth.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    PREFER_SECURE_COOKIES = False
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_DURATION = timedelta(days=14)
    PERMANENT_SESSION_LIFETIME = timedelta(hours=8)
    WTF_CSRF_TIME_LIMIT = None
    ENABLE_TALISMAN = False  # Disabled for development
    CSP = {
        "default-src": "'self'",
        "img-src": "'self' data:",
        "style-src": "'self' 'unsafe-inline'",
        "script-src": "'self' 'unsafe-inline'",
        "font-src": "'self' data:",
        "connect-src": "'self'"
    }


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False
    PREFER_SECURE_COOKIES = True
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    ENABLE_TALISMAN = True


def get_config():
    env = os.getenv("FLASK_ENV", "development").lower()
    if env == "production":
        return ProductionConfig
    return DevelopmentConfig
