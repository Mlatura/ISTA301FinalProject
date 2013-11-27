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

class Collage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('collage.html')
        self.response.write(template.render())

class CollageTheme(ndb.Model):
    """Models a collage theme created by a user with an instagram tag and description"""
    instagramTag = ndb.StringProperty()
    description = ndb.StringProperty()
    public = ndb.BooleanProperty()

class CreateTheme(webapp2.RequestHandler):
    def post(self):
        tag = self.request.get('Tag')
        description = self.request.get('Description')
        public = self.request.get('Public') == 'on'

        if tag:
            new_theme = CollageTheme(instagramTag = tag, description = description, public = public)
            self.response.write( str(new_theme) )
        else:
            self.redirect('/?error=NoTag')

application = webapp2.WSGIApplication([
    ('/', Collage),
    ('/create_theme', CreateTheme)
], debug=True)
