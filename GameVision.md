# Galacticon: Game Vision

## Overview
Galacticon is a session-based strategy game set in a procedurally generated galaxy. The game is designed for quick, engaging playthroughs that can be completed in a single session. Players compete or cooperate to expand their influence, develop their planets, and outmaneuver rivals through clever use of resources, research, and limited information.

---

## Core Design Goals
- **Strategically accessible:** Depth without overwhelming complexity; no sprawling tech trees or micromanagement.
- **Session-based:** Playable and completable in one sitting (1–2 hours).
- **Multiple resource sinks:** Four main ways to spend resources, each with meaningful impact.
- **Simple ship design:** Ships are easy to configure or can be auto-configured.
- **Streamlined research:** No tech trees; research areas simply improve efficiency and unlock new capabilities.
- **Limited information:** Players have access to basic astronomical data, but must use espionage to uncover rivals' specifics.

---

## Resource Spending
Players can allocate resources in four main areas:

### 1. Building Infrastructure
- **Purpose:** Improve planetary output, defense, and quality of life.
- **Examples:**
  - Mining facilities (increase resource extraction)
  - Power plants (boost energy for all activities)
  - Defense grids (protect against invasions and espionage)
  - Spaceports (enable ship construction and trade)
- **Strategic Impact:** Infrastructure investments are persistent and provide long-term benefits.

### 2. Building Space Ships
- **Purpose:** Explore, defend, attack, and transport resources or people.
- **Configuration:**
  - **Auto-configure:** Players can select a role (explorer, fighter, transport, etc.) and the game suggests an optimal design.
  - **Simple Customization:** Players can tweak a few key parameters (speed, armor, cargo, sensors) via sliders or presets.
- **Fleet Management:**
  - Fleets are groups of ships with a shared mission.
  - Fleet strength and composition are hidden from other players unless scouted.

### 3. Research
- **Purpose:** Improve efficiency and unlock new capabilities.
- **No Tech Tree:**
  - Research is divided into broad areas (e.g., Propulsion, Materials, Sensors, Cybernetics).
  - Each area has a level; investing resources increases the level, which boosts all related activities.
  - Occasional breakthroughs may unlock new ship modules or infrastructure types.
- **Strategic Impact:** Research is a long-term investment that can shift the balance of power.

---

## Tech
All technologies in Galacticon are available to every player from the very start of the game. Research does not unlock new capabilities, but instead makes existing technologies more efficient, powerful, or cost-effective. Below is a complete list of all core technologies and their broad in-game effects:

- **Propulsion:** Enables all ship movement and interplanetary travel. Research increases speed, range, and fuel efficiency.
- **Armor:** Provides basic protection for ships and infrastructure. Research increases durability and reduces construction costs.
- **Energy Shields:** Protects ships and infrastructure from attacks by absorbing damage. Research increases shield strength and recharge rate.
- **Point Defense:** Automated systems to intercept incoming threats (especially missiles and small craft). Research improves interception rate and reduces vulnerability.
- **Energy Weapons:** Ship and planetary weapons that use directed energy (lasers, plasma, etc.). Research increases damage and efficiency.
- **Rocket Weapons:** Ship and planetary weapons that use missiles or rockets. Research increases accuracy, damage, and reload speed.
- **Projectile Weapons:** Ship and planetary weapons that use kinetic projectiles (railguns, cannons, etc.). Research increases damage, rate of fire, and penetration.
- **Construction:** Covers all building and repair activities for ships and infrastructure. Research speeds up build times and reduces resource usage.
- **Sensors:** Detects planets, fleets, and anomalies. Research increases detection range, accuracy, and data quality.
- **Automation:** Automates mining, farming, manufacturing, and ship operations. Research increases output, reliability, and reduces crew requirements.
- **Energy Systems:** Power generation and storage for ships and infrastructure. Research increases energy output, storage capacity, and reduces maintenance.
- **Ecology:** Keeps populations healthy on ships and planets. Research reduces upkeep and increases population growth.
- **Terraforming:** Adjusts planetary environments for habitability. Research reduces time and cost for terraforming projects.
- **Espionage:** Enables information gathering and sabotage against rivals. Research increases the effectiveness and stealth of espionage actions.

All of these technologies are available from the start. Investing in research simply makes them better, not available. This ensures all players have access to the same tools and can focus on strategy and efficiency rather than unlocking new options.

---

## Knowledge & Espionage
- **Open Data:** All players have access to raw astronomical data (planet types, orbits, star types, etc.).
- **Hidden Data:**
  - Fleet strength, ship designs, infrastructure, and research levels are hidden.
  - Players must invest in espionage (probes) to uncover rivals' specifics.
- **Espionage Actions:**
  - Scout fleets/planets (reveal fleet size, ship types, infrastructure)
  - Steal research (gain a boost in a research area)
  - Sabotage (temporarily disable infrastructure or ships)
- **Counter-Espionage:**
  - Invest in security to reduce the effectiveness of enemy spies.

---

## Gameplay Structure
- **Turn-based or Simultaneous Turns:** Players plan actions, then all actions resolve at once.
- **Victory Conditions:**
  - Dominate the galaxy (military or economic supremacy)
  - Achieve a scientific breakthrough
  - Complete a unique civilization project
- **Session Length:** Designed for 1–2 hour play sessions.

---

## User Interface Principles
- **Relative Layouts:** All UI elements use relative units and fill available space.
- **Clarity:** Information is presented clearly, with tooltips and summaries for all actions.
- **Accessibility:** Ship and research configuration is simple and intuitive.

---

## Next Steps
- Prototype resource management and infrastructure building.
- Implement basic ship design and fleet management UI.
- Add research and education systems.
- Develop espionage and information hiding mechanics.
- Playtest for session length and strategic depth. 