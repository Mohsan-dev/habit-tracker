# ANSWERS.md

## 1. How to run the project

### Requirements
- A modern web browser (Chrome, Edge, Firefox, etc.)
- VS Code (optional but recommended)
- Live Server extension for VS Code (recommended)

---

### Run Locally

#### Option 1 — Simple
1. Clone the repository:
```bash
git clone https://github.com/Mohsan-dev/habit-tracker.git
``` id="g11"

2. Open the project folder:
```bash
cd habit-tracker
``` id="g12"

3. Open `index.html` in your browser

---

#### Option 2 — Recommended (VS Code Live Server)
1. Open the project in VS Code
2. Install the **Live Server** extension
3. Right click `index.html`
4. Click **"Open with Live Server"**

---

### Deployment

Live URL:  
https://habit-tracker-00.netlify.app/
---

## 2. Stack & Design Choices

### Why I chose this frontend stack

I used HTML, CSS, and Vanilla JavaScript because I wanted to strengthen my frontend fundamentals before moving to frameworks like React.

This project helped me practice:
- DOM manipulation
- Dynamic rendering
- Event handling
- LocalStorage management
- Responsive UI development

Using Vanilla JavaScript also helped me better understand how application state and rendering work internally.

---

### Design Decision 1 — Weekly Habit Table Layout

I used a weekly table layout instead of a simple list because habit tracking is easier to visualize when users can see all days of the week together.

This design allows users to:
- compare progress across days
- track consistency visually
- interact quickly using checkboxes

This affects the main habit tracking table section.

---

### Design Decision 2 — Delete Confirmation Modal

I added a delete confirmation modal before removing habits.

Deleting a habit also removes its streak history and stored progress, so the confirmation step helps prevent accidental deletion and improves usability.

This affects the delete interaction system inside the habit table.

---

## 3. Responsive & Accessibility

### Responsive Behavior

#### On a 360px mobile screen:
- Buttons stack vertically
- Font sizes become smaller
- Table spacing becomes compact
- Check buttons resize for touch devices
- Overflow handling prevents layout breaking

#### On a 1440px laptop screen:
- The full table layout is displayed comfortably
- Navigation buttons remain horizontally aligned
- Larger spacing improves readability

I used media queries to adapt layouts for different screen sizes.

---

### Accessibility Consideration Handled

One accessibility feature I handled was keyboard interaction support.

Users can:
- press Enter to add habits
- navigate interactive buttons using keyboard input
- interact with controls without requiring a mouse

I also maintained readable color contrast between buttons and backgrounds.

---

### Accessibility Consideration Skipped

I did not fully implement advanced screen-reader support using ARIA labels.

With more time, I would:
- add ARIA attributes
- improve semantic labeling
- add better screen-reader support

---

## 4. AI Usage

### AI Tools Used
- ChatGPT
- Claude

---

### How AI Was Used

I used AI tools mainly when I got stuck during development.

AI was used for:
- debugging JavaScript issues
- fixing Git and GitHub workflow problems
- understanding streak calculation logic
- getting help with documentation
- solving coding errors during development

I used AI as a learning and debugging assistant while building the project myself.

---

### Example of AI Output I Modified

AI suggested a simpler approach for habit rendering logic.

I modified the implementation by creating a dynamically rendered weekly habit table using JavaScript loops and integrating streak tracking with LocalStorage data.

I also adjusted parts of the rendering flow to better support week navigation and habit updates.

---

## 5. Honest Gap

One area that still needs improvement is the mobile experience on very small screens.

Although responsive layouts were added, the table can still feel crowded on narrow devices.

With another day, I would:
- redesign the mobile layout into card-based sections
- improve spacing for touch interactions
- add smoother animations
- improve accessibility support
- add backend or cloud synchronization