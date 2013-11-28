import os
import urllib

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class Collage(webapp2.RequestHandler):
    def get(self):
        description = self.request.get('description', "")
        template_values = {
            'description': description
        }
        template = JINJA_ENVIRONMENT.get_template('collage.html')
        self.response.write(template.render(template_values))

application = webapp2.WSGIApplication([
    ('/', Collage),
], debug=True)
