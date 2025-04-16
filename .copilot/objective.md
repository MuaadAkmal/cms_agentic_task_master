
🚀 Project Aim
Build a web app where:

Users can chat (individually & in groups)

Upload and share documents

Enter and assign tasks

Change task status (Pending, Approved, etc.)

Search and sort tasks

Fixed number of users (no sign-up/login for now)

🎨 Design
Clean and sleek UI

White background

Primary colors: Black (with shades)

Use ShadCN UI + styled-components for custom styling

📐 Layout
less
Copy
Edit
|  NAVBAR NAVBAR NAVBAR NAVBAR |
|  FORM     FORM     CHAT     CHAT    |
|  TABLE    TABLE    TABLE   TABLE   |
Navbar: basic links (Home, Server, Employee) – use # hrefs for now

Footer: small, minimal

Main Content:

Left: Form to enter tasks

Right: Chat UI

Bottom: Task Table with sorting/filtering

🧩 Step-by-Step Breakdown
✅ Step 1: Setup Prisma
Use SQLite for development

Initialize Prisma in the project

bash
Copy
Edit
npx prisma init
✅ Step 2: Design Prisma Schema
Entities:

User

Task

Message

Document (optional, for uploads)

✅ Step 3: Functional Requirements
3a. Task Entry Form
Fields:

LSA (dropdown)

TSP (dropdown)

Dot & Lea (dropdown)

Problem Description (textarea)

Status (Pending, Approved, etc. - dropdown)

Solution Provided (optional)

Remarks (optional)

✅ Step 4: Store in SQLite
Use Prisma to write to SQLite

Save task form data in Task table

✅ Step 5: Task Search + Filter
Create a search box

Search by:

problemDescription

solutionProvided

If search is empty, show latest 6 tasks

Add sort by date (default: now() using dayjs)

✅ Step 6: Chat Feature
Use Socket.IO

Search for users

Use ShadCN chat components

Handle:

Individual chats

Group chats

✅ Step 7: Task Assignment
In the table view:

Assign task to a user

Change task status

View current assignments

