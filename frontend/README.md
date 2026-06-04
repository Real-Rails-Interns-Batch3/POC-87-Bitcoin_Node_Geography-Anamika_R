# Real Rails: Bitcoin Node Geography Dashboard

An interactive, high-fidelity real-time intelligence dashboard to visualize the global distribution of Bitcoin nodes, assess infrastructure resilience, and analyze cloud hosting provider concentration. 

Built as part of the **Real Rails Intelligence Library** (PoC ID #87: Settlement & Infrastructure).

---

## 🏗️ System Architecture

The project consists of a decoupled Python FastAPI backend and a Next.js (React/TypeScript) frontend:

```mermaid
graph TD
    Client[Next.js Client] -->|HTTP Requests| API[FastAPI Server]
    API -->|1. Try Live Snapshot| Bitnodes[Bitnodes API]
    API -.->|2. Fallback on Error/Timeout| LocalMock[Local Mock Data nodes.json]
    Client -->|Renders Map| Leaflet[Leaflet + CartoDB Dark Matter]
    Client -->|Renders Analytics| ECharts[ECharts Widgets]