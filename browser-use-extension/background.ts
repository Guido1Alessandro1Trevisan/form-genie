chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return
  const tabId = tab.id
  try {
    await chrome.debugger.attach({ tabId }, "1.3")
    await chrome.debugger.sendCommand({ tabId }, "Runtime.enable")
    await chrome.debugger.sendCommand({ tabId }, "DOM.enable")

    const formFieldsResult = await chrome.debugger.sendCommand(
      { tabId },
      "Runtime.evaluate",
      {
        expression:
          "JSON.stringify(Array.from(document.forms[0]?.elements).map(e => e.name))",
        returnByValue: true
      }
    )
    const fields = JSON.parse(formFieldsResult.result.value ?? "[]")
    const response = await fetch("http://localhost:8000/fillform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tab.url, fields })
    })
    const data = await response.json()
    if (data.fieldValues) {
      for (const [name, value] of Object.entries(data.fieldValues)) {
        await chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
          expression: `(() => {const el=document.querySelector('[name="${name}"]'); if(el){el.focus(); el.value=${JSON.stringify(
            value
          )}; el.dispatchEvent(new Event('input', {bubbles:true}));}})();`
        })
      }
      await chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
        expression: `document.forms[0]?.submit();`
      })
    }
  } catch (e) {
    console.error("form fill error", e)
  } finally {
    try {
      await chrome.debugger.detach({ tabId })
    } catch {}
  }
})

chrome.debugger.onDetach.addListener((_source, reason) => {
  console.log("Debugger detached", reason)
})
