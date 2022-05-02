from flask import render_template, request, session, redirect
from flask_bcrypt import Bcrypt

from flask_app import app

from ..models.user_model import User



bcrypt = Bcrypt(app) #instantiating the Bcrypt class passing the flask app 

# display login/register form 
@app.route("/")
def index():
    if "uuid" in session:
        return redirect("/")

    return render_template("index.html")

# validate data .. if data does not meet criteria then redirect back to index 
@app.route("/", methods = ["POST"])
def register():
    if not User.register_validator(request.form):
        return redirect("/")

# if data meets criteria then hash password 
    hash_browns = bcrypt.generate_password_hash(request.form['password'])

    data  = {
        "first_name": request.form['first_name'],
        "last_name": request.form['last_name'],
        "username": request.form['username'],
        "email": request.form['email'],
        "password": hash_browns
        }
# create user 
    user_id = User.create(data)
# put user id in session
    session['uuid'] = user_id
# after user is created redirect to success page 
    return redirect("/")

# this checks to see if login info both username and password is valid 
@app.route("/dashboard", methods = ["POST"])
def login():
# if login info is not valid redirect back to form 
    if not User.login_validator(request.form):
        return redirect("/")
# if login is valid put user id into session and then redirect to dashboard
    user = User.get_by_username({"username": request.form['username']})
    session['uuid'] = user.id

    return redirect("/dashboard")


@app.route("/logout")
def logout():
    session.clear()

    return redirect("/")
