from flask import render_template, request, session, redirect
from flask_bcrypt import Bcrypt

from flask_app import app
from ..models.user_model import User

from ..models.post_model import Post

bcrypt = Bcrypt(app) #instantiating the Bcrypt class passing the flask app 


# gets all posts and puts them in the table on the dashboard page after loggin in .. 
@app.route("/dashboard")
def get_all_posts_controller():
    if "uuid" not in session:
        return redirect("/")
    all_posts = Post.get_all_posts()
    print(all_posts)
    return render_template("dashboard.html", all_posts = all_posts, user = User.get_by_id({"id": session['uuid']}))


@app.route("/dashboard")
def dashboard():
    if "uuid" not in session:
        return redirect("/")
    
    return render_template(
        "dashboard.html",
        user = User.get_by_id({"id": session['uuid']}), all_posts = Post.get_all_users_posts({"id": session['uuid']}))


@app.route("/dashboard/posts")
def display_my_posts(id):
    if "uuid" not in session:
        return redirect("/")
    
    return redirect("/dashboard",
        user = User.get_by_id({"id": session['uuid']}),
        all_posts = Post.get_all_users_posts({"id": session['uuid']}))



# this function takes you from the dashboard to the add/create posts page
@app.route("/posts/new")
def dashboard_to_add_post_page():
    if "uuid" not in session:
        return redirect("/")
    return render_template("add_post.html")

# this route creates/adds a new post for the user joining by the foreign key 

@app.route("/posts/new", methods = ['POST'])
def create_post():
    if not Post.validate(request.form):
        return redirect("/posts/new")
    data = {
        "title": request.form['title'],
        "category": request.form['category'],
        "posting": request.form['posting'],
        "user_id": session['uuid']
    }
    Post.create_post(data)
    return redirect("/dashboard")

@app.route("/edit/<int:id>")
def edit_post(id):
    if "uuid" not in session:
        return redirect("/")
    
    return render_template("edit_post.html", post = Post.get_one({"id": id}), user = User.get_by_id({"id": session["uuid"]}))


# this route updates my posts on my edit post form 
@app.route("/edit/<int:id>", methods = ['POST'])
def update_post(id):
    if not Post.validate(request.form):
        return redirect(f"/edit/{id}")
    print(request.form)

    data = {
        "title": request.form['title'],
        "category": request.form['category'],
        "posting": request.form['posting'],
        "id": id
    }
    Post.update(data)
    return redirect("/dashboard")


@app.route("/post/<int:id>/delete")
def delete_post(id):
    Post.delete({"id": id})
    return redirect("/dashboard")



# display specfic posting // view page
@app.route("/posts/<int:id>")
def view_posts(id):
    if "uuid" not in session:
        return redirect("/")

    return render_template("view_post.html", post = Post.get_one({"id": id}), user = User.get_by_id({"id": session["uuid"]}))



@app.route("/view")
def view_button():
    if "uuid" not in session:
        return redirect("/")
    return render_template("/dashboard")