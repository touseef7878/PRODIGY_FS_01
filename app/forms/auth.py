from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Regexp, ValidationError
from ..models.user import User

# Strong validation patterns
username_re = r"^[A-Za-z0-9_]{3,32}$"
password_re = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\\w\\s]).{12,128}$"


class RegistrationForm(FlaskForm):
    username = StringField("Username", validators=[
        DataRequired(), 
        Length(min=3, max=32), 
        Regexp(username_re, message="3-32 chars, letters numbers underscore only")
    ])
    email = StringField("Email", validators=[
        DataRequired(), 
        Email(), 
        Length(max=255)
    ])
    password = PasswordField("Password", validators=[
        DataRequired(), 
        Length(min=12, max=128), 
        Regexp(password_re, message="Use upper, lower, number, special, 12+ chars")
    ])
    confirm_password = PasswordField("Confirm Password", validators=[
        DataRequired(), 
        EqualTo("password", message="Passwords must match")
    ])
    submit = SubmitField("Create account")

    def validate_username(self, field):
        if User.query.filter_by(username=field.data.lower()).first():
            raise ValidationError("Username is already taken")

    def validate_email(self, field):
        if User.query.filter_by(email=field.data.lower()).first():
            raise ValidationError("Email is already registered")


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[
        DataRequired(), 
        Email(), 
        Length(max=255)
    ])
    password = PasswordField("Password", validators=[
        DataRequired(), 
        Length(min=12, max=128)
    ])
    remember = BooleanField("Remember me")
    submit = SubmitField("Sign in")
