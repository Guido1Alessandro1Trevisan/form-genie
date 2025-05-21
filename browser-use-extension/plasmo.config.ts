import type { PlasmoConfig } from "plasmo"

export default <PlasmoConfig>{
  manifest: {
    permissions: ["activeTab", "debugger"],
    host_permissions: ["http://localhost:8000/*"],
    action: { default_title: "Form Genie" }
  }
}
