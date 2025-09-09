from functools import wraps
from flask import abort
from flask_login import current_user


def roles_required(*roles):
    """Decorator to require specific roles for route access"""
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            if not current_user.is_authenticated:
                abort(401)
            if current_user.get_role() not in roles:
                abort(403)
            return fn(*args, **kwargs)
        return decorated
    return wrapper
