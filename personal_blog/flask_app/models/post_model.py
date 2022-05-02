from ..config.mysqlconnection import connectToMySQL
from flask import flash
from ..models import user_model


class Post:
    def __init__(self, data):
        self.id = data['id']
        self.title = data['title']
        self.category = data['category']
        self.posting = data['posting']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']


    # this displays all the posts on the dashboard
    @classmethod
    def get_all_posts(cls):
        query = "SELECT * FROM posts"
        results = connectToMySQL("blog_schema").query_db(query)
        all_posts = []
        for post_row in results:
            post_obj = cls(post_row)
            all_posts.append(post_obj)
        return all_posts


    # this function grabs one specefic posting by the ID 
    @classmethod
    def get_one(cls, data):
        query = "SELECT * FROM posts WHERE id = %(id)s"
        results = (connectToMySQL("blog_schema").query_db(query, data))
        row_data = {
            "id": results[0]['id'],
            "title": results[0]['title'],
            "category": results[0]['category'],
            "posting": results[0]['posting'],
            "created_at": results[0]['created_at'],
            "updated_at": results[0]['updated_at'],
            "user_id": results[0]['user_id']
        }
        return cls(row_data)



    @property
    def get_user(self):
        info = {
            "id": self.user_id,
        }
        return user_model.User.get_by_id(info)



    @classmethod
    def get_all_users_posts(cls, data):
        query = "SELECT * FROM posts WHERE user_id = %(id)s"
        results = connectToMySQL("blog_schema").query_db(query, data)
        return results



    # this creates a new post and inserts the post info into my table
    @classmethod
    def create_post(cls, data):
        print(data)
        query = "INSERT INTO posts (user_id, title, category, posting, created_at, updated_at) VALUES (%(user_id)s, %(title)s, %(category)s, %(posting)s, NOW(), NOW());"
        return connectToMySQL("blog_schema").query_db(query, data)


    # this updates/edits my posts
    @classmethod
    def update(cls, data):
        query = "UPDATE posts SET title = %(title)s, category = %(category)s, posting = %(posting)s, updated_at = NOW() WHERE id = %(id)s;"

        connectToMySQL("blog_schema").query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM posts WHERE id = %(id)s"
        return connectToMySQL("blog_schema").query_db(query, data)



    @staticmethod
    def validate(post_data):
        is_valid = True

        if len(post_data['title']) < 5:
            flash("title must be at least 5 characters.")
            is_valid = False
        
        if len(post_data['category']) < 3:
            flash("category must be at least 3 characters.")
            is_valid = False

        if len(post_data['posting']) < 10:
            flash("Posting must be at least 10 characters.")
            is_valid = False

        return is_valid