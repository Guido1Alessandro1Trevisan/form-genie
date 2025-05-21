# Form Genie

This repository contains a simple demo of automating form filling using a Plasmo
based browser extension together with a Python FastAPI backend.  The backend
leverages the `browser_use` library to read pages while the extension controls
the user's active tab via Chrome's debugger API.

The extension attaches a debugger session to the active tab when its action button is clicked. It gathers the first form's field names, sends them to the backend and receives values to insert. After the fields are filled the form is submitted automatically.

## Running the Backend

Install the Python dependencies and start the API server:

```bash
cd backend
pip install -e .  # installs browser_use and FastAPI
uvicorn main:app --reload
```

The server exposes a `/fillform` endpoint. It reads the target page with
`browser_use` if field names are not supplied and returns simple demo values.

## Developing the Extension

```bash
cd browser-use-extension
npm install
npm run dev
```

Load the build output from `build/chrome-mv3-dev` as an unpacked extension in Chrome.

Click the extension icon on a page with a form to test the automatic fill behaviour.
