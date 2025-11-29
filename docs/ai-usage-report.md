# AI Usage Report 

## Overview
This document explains how AI tools were used responsibly and ethically during development.  
AI assisted in debugging, documentation, UI suggestions, and code explanation.

---

## Tools Used

| Tool | Use |
|------|-----|
| ChatGPT (GPT-5) | Code explanation, logic review, documentation |

---

## Use Cases

AI supported:
## 2.1 Code Generation
- Initial versions of:
    - Filtering & sorting logic
    - Project rendering
    - LocalStorage handling
    - Fetching API data

## 2.2 Debugging
- Fixed JavaScript logic that wasn’t filtering correctly.
- Explained why some event listeners fired incorrectly.

## 2.3 Documentation
- Helped structure README.md
- Helped organize Technical-documentation report.

---

## AI Interaction Log 

### Prompt 1
"My tag button always shows an alert when clicked."

### AI Output
Suggested removing the `alert()`.
### My Edits
- Removed inline JavaScript
- Improved naming conventions
### What I Learned
- Why inline JS should be avoided
- How state changes propagate in the DOM
- How to connect UI components logically
---
### Prompt 2
"My filter controls go off-screen on mobile, how do I fix it?"

### AI Output
Suggested using flex-direction: column and width:100%.
### My Edits
- Implemented grid layout for mobile
- Fixed overflow
- Applied box-sizing
- Reduced spacing

### What I Learned
- CSS overflow behavior
- Mobile layout structure
- Media queries usage

---
### Prompt 3
"Does changing image size in CSS reduce file size? How can I really optimize images?"
### AI Output
Explained that CSS only resizes visually and suggested WebP + lazy loading.
### My Edits
- Converted images to WebP
- Added loading="lazy"
- Optimized image resolution manually

### What I Learned
- File size vs render size difference
- Why WebP loads faster
- How lazy loading improves performance

---
### Prompt 4
"I logged out but the username still shows, how do I fix it?"
### AI Output
Recommended clearing localStorage on logout.
### My Edits
- Manually removed only the visitorName key
- Reset UI text
- Called updateGreeting() after clearing
- Cleared visit timer

### What I Learned
- Difference between clearing keys vs clearing storage
- UI state synchronization
- Why functions should be re-called after state updates

---
### Prompt 5
“My login buttons look weird in the header, can you make them match the header style?
### AI Output
Recommended semi-transparent buttons (glass style), consistent spacing, and smaller typography in header actions.
### My Edits
- Styled #auth-section button with translucent background
- Unified radius and font size
- Ensured it stays readable on gradient

### What I Learned
- “Secondary” buttons should look quieter than main CTAs.

---
### Prompt 6
“the cursor when trying the filters is not smooth it keeps gliches”
### AI Output
Explained that global transitions (especially transforms on focus/active) can cause jank/flicker in inputs/selects.
### My Edits
- Removed * { transition: ... } global rule
- Disabled transform transitions on .controls select/input
- Kept only border-color + box-shadow transitions for form controls

### What I Learned
- Global transitions can harm performance and usability
- Inputs/selects should be styled lightly to stay stable
---
## Benefits

AI improved:

- Development speed
- Debug clarity
- Documentation structure
- Code readability

---

## Challenges

| Challenge | Resolution |
|----------|------------|
| AI suggested outdated syntax | Refactored manually |
| Overcomplicated logic | Simplified |
| Inconsistent CSS values | Tuned manually |
---

## Understanding & Modification

All AI output was:
- Reviewed
- Modified
- Rewritten
- Tested
- understood

---

## Learning Outcomes

Through AI:
- Improved debugging skill
- Stronger JS understanding
- UI/UX awareness
- Ethical AI practice

---

## Conclusion
AI helped guide development and learning but did not create the project for me.  
Final implementation was tested, refined, and is fully understood.