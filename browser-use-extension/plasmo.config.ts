import type { PlasmoConfig } from "plasmo"

export default <PlasmoConfig>{
  contentScripts: ["contents/agent-box"],

  manifest: {
    permissions: ["activeTab", "scripting"],
    host_permissions: ["http://localhost:8000/*"],
    action: { default_title: "Hybrid Agent" }
  }
}
