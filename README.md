# Static Polis Graph Explorer

<img width="1394" height="823" alt="Screenshot 2025-08-06 at 5 20 23 AM" src="https://github.com/user-attachments/assets/6676c864-3cb7-48cc-8b63-301becca0c96" />

This repository reimplements the Polis graph from naked polismath and comments JSON responses.

The intention is to create a react component (which will work on a static site) that allows data exploration of any data that matches the polismath JSON format.

Due to cross-site origin security of pol.is API responses, data must be stored in a folder within the app -- the format `public/data/<slug>` means that it can be accessed at `patcon.github.io/opinion-graph-demo?dataset=<slug>`.

Required JSON data comes from these endpoints (with any Polis conversation ID):
- <https://pol.is/api/v3/math/pca2?conversation_id=6jrufhr6dp>
- <https://pol.is/api/v3/comments?conversation_id=6jrufhr6dp>
- <https://pol.is/api/v3/conversations?conversation_id=6jrufhr6dp>
