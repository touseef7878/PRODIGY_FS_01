from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from ..utils.decorators import roles_required

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def home():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    return redirect(url_for("auth.login"))


@main_bp.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")


@main_bp.route("/admin")
@login_required
@roles_required("admin")
def admin():
    return render_template("admin.html")


# Error handlers
@main_bp.errorhandler(403)
def forbidden(error):
    return render_template("403.html"), 403


@main_bp.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404
