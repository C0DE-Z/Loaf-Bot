# Loaf Bot v2


### Warning this project is still WIP features will be added and removed! 

A Discord bot with moderation and task management capabilities.

## Used in Mourning Dove Developement 
Discord.gg/QUKCjt3d35 - Makes Roblox games coming out soon! About to hit 250 members!

## Features

### Task Management
- Create tasks with titles, descriptions, and due dates
- Assign tasks to specific users
- Mark tasks as complete
- View all tasks in a sorted list
- Admin controls for editing and removing tasks

### Moderation
- Ban users with customizable message deletion periods
- Role hierarchy respect
- Automatic DM notifications to banned users
- Detailed ban logging

## Commands

### Tasks
- `/tasks show` - Display all tasks
- `/tasks create` - Create a new task
  - Options: title, description, due_date, assign_to (optional)
- `/tasks edit` - Edit existing task (Admin only)
  - Options: task_id, title, description, due_date, assign_to
- `/tasks remove` - Remove a task (Admin only)
  - Options: task_id
- `/tasks mark_done` - Mark your assigned task as completed
  - Options: task_id

### Moderation
- `/ban` - Ban a user from the server (Requires Ban Permission)
  - Options: user, reason (optional), delete_messages (0/1/7 days)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with your bot token:
```env
TOKEN=your_bot_token_here
```
4. Start the bot:
```bash
node index.js
```

## Requirements
- Node.js v16.9.0 or higher
- Discord.js v14
- Write permissions in the data directory for task storage

## Permissions
The bot requires the following permissions:
- Ban Members
- Send Messages
- View Channels
- Read Message History

## Contributing
Feel free to submit issues and pull requests for new features or bug fixes.
