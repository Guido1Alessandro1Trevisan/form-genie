from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio

# browser_use is a small helper around Playwright used to inspect the target
# page.  The library is only imported when needed so that the backend can start
# even if the dependency is missing in development environments.


app = FastAPI()

class FillRequest(BaseModel):
    url: str
    fields: Optional[List[str]] = None

class FillResponse(BaseModel):
    fieldValues: Dict[str, str]

@app.post("/fillform", response_model=FillResponse)
def fill_form(req: FillRequest):
    """Return values for the given form fields.

    If the request does not provide field names, the backend uses the
    ``browser_use`` library to fetch the page and read the first form's
    input names.  This demonstrates using ``browser_use`` to read the page
    while the extension itself uses Chrome's debugger to manipulate it.
    """

    async def _read_fields(url: str) -> List[str]:
        from browser_use import Browser  # imported lazily

        async with Browser() as b:
            page = await b.page()
            await page.goto(url)
            return await page.evaluate(
                "Array.from(document.forms[0]?.elements).map(e => e.name)"
            )

    fields = req.fields
    if not fields:
        # Run the asynchronous browser_use routine
        fields = asyncio.run(_read_fields(req.url))

    # simple demo: fill each field with its name reversed
    field_values = {name: name[::-1] for name in fields}
    return {"fieldValues": field_values}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
