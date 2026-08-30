# AAC-Manual


new data structure:
{
    "id": "eat",
    "label": "Eat",
    "icon": "🍎",
    "description": "I want to eat",
    "children": [],
    "parents:" []
}

## Sharing your board with someone else

The board's data (nodes and how they're linked together) lives in a SQLite
file on the server, not in this repo, so cloning the code alone won't bring
your data with it. Use the export/import endpoints to hand it off:

1. With your server running, download your data (defaults below assume
   `docker compose up`, which maps the server to port 3098):

   ```
   curl http://localhost:3098/api/export -o aac-export.json
   ```

   (Or just open `http://localhost:3098/api/export` in a browser and save
   the file.)

2. Send them the codebase plus `aac-export.json`.

3. They start the server the same way, then load your data into their own
   database:

   ```
   curl -X POST http://localhost:3098/api/import \
     -H "Content-Type: application/json" \
     --data-binary @aac-export.json
   ```

   **Note:** this replaces whatever is currently in their database with
   your data.