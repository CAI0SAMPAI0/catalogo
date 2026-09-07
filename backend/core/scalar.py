from django.http import HttpResponse
from ninja.openapi.docs import DocsBase


class Scalar(DocsBase):
    def render_page(self, request, api, **kwargs):
        openapi_url = self.get_openapi_url(api, kwargs)
        html = f"""<!doctype html>
<html>
  <head>
    <title>{api.title} - Documentação</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {{
        margin: 0;
        padding: 0;
      }}
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="{openapi_url}"
      data-configuration='{{"theme": "purple", "layout": "modern"}}'>
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>"""
        return HttpResponse(html)
