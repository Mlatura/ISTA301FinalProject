import os
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class CanvasImage(ndb.Model):
    """Models an image created and submitted by a user"""
    author = ndb.UserProperty()
    imageBlob = ndb.BlobProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)

class ImageCreator(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if user:
            template_values = {
                "username": user.nickname(),
                "logout_url": users.create_logout_url(self.request.uri)
            }
            template = JINJA_ENVIRONMENT.get_template('imageCreator.html')
            self.response.write(template.render(template_values))
        else:
            self.redirect(users.create_login_url(self.request.uri)) 

#class Collage(webapp2.RequestHandler):


application = webapp2.WSGIApplication([
    ('/', ImageCreator)
#    ('/collage', Collage),
], debug=True)
