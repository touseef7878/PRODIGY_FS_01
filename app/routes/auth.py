from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from .. import db
from ..models.user import User
from ..forms.auth import RegistrationForm, LoginForm
from ..utils.security import is_safe_redirect_url
from datetime import datetime

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        username = form.username.data.strip().lower()
        email = form.email.data.strip().lower()
        user = User(username=username, email=email, role="user")
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        
        # Sign the user in immediately and redirect to dashboard (respect safe next)
        login_user(user)
        user.last_login_at = datetime.utcnow()
        db.session.commit()
        
        flash("Welcome! Your account has been created.", "success")
        next_url = request.args.get("next")
        if next_url and is_safe_redirect_url(next_url):
            return redirect(next_url)
        return redirect(url_for("main.dashboard"))
    
    return render_template("auth/register.html", form=form)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(form.password.data) and user.is_active:
            login_user(user, remember=form.remember.data, duration=None)
            user.last_login_at = datetime.utcnow()
            db.session.commit()
            
            next_url = request.args.get("next")
            if next_url and is_safe_redirect_url(next_url):
                return redirect(next_url)
            return redirect(url_for("main.dashboard"))
        
        flash("Invalid email or password.", "danger")
    
    return render_template("auth/login.html", form=form)


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have been signed out.", "info")
    return redirect(url_for("auth.login"))
