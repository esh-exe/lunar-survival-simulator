# Lunar Survival Simulator

An interactive lunar mission training platform designed to help students explore the challenges of living and working on the Moon through realistic, educational simulations powered by NASA data.

## About the Project

Lunar Survival Simulator is an educational web application that puts students in the role of lunar mission explorers. Students complete a series of missions, make decisions, analyze environmental conditions, and learn how astronauts prepare for survival on the Moon.

The platform combines real NASA datasets with interactive scenarios to make space science more engaging and accessible.

## Key Features

- **Seven-Mission Campaign:** Complete at least seven distinct lunar survival missions.
- **Progress Tracking:** Track completed missions, achievements, and overall campaign progress.
- **Interactive Simulations:** Explore lunar challenges through decision-making scenarios.
- **NASA Data Integration:** Use real NASA datasets to support mission information and simulations.
- **Learning Dashboard:** Monitor student progress and mission performance.
- **Educational Resources:** Access guides, explanations, and a space science glossary.
- **What-If Scenarios:** Explore how different decisions and environmental conditions affect mission outcomes.

## How It Works

1. Students begin with their first lunar survival mission.
2. Each mission introduces a different challenge.
3. Students analyze the available information and make decisions.
4. The simulator presents outcomes and educational explanations.
5. Completed missions are recorded on the dashboard.
6. Students unlock subsequent missions and continue their campaign.

## Technology Stack

| Technology | Purpose |
|---|---|
| Base44 | Application development and hosting |
| React 19 | Frontend application |
| TanStack Start | Full-stack framework and routing |
| JavaScript | Application logic |
| NASA APIs | Access to real NASA datasets |
| JSON | Data handling and integration |

## NASA Data

The project incorporates NASA data to connect classroom learning with real space science.

NASA datasets provide information used to develop mission scenarios and help students understand the environmental challenges associated with lunar exploration.

## Project Structure

```text
src/
├── routes/
│   ├── index.jsx
│   ├── campaign.jsx
│   ├── classroom.jsx
│   ├── compare.jsx
│   ├── demo.jsx
│   ├── glossary.jsx
│   ├── how-to-play.jsx
│   ├── investigator.jsx
│   ├── observatory.jsx
│   ├── settings.jsx
│   ├── training.jsx
│   ├── whatif.jsx
│   └── api/
│       └── time.js
```

## Running Locally

Install dependencies:

```bash
npm ci
```

Log in to Base44:

```bash
base44 login
```

Link the project:

```bash
base44 link
```

Start the development server:

```bash
base44 dev
```

## Building and Deployment

Build the application:

```bash
npm run build
```

Deploy through Base44:

```bash
base44 deploy
```

## Purpose

The goal is to transform space science education from passive learning into an interactive experience where students can explore, experiment, make decisions, and understand the challenges of future lunar exploration.

## Challenge

Developed for the **NASA Space Apps Challenge 2026**.

---

**Built with curiosity, code, and NASA data.**
