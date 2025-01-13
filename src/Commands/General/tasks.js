const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../../data/tasks.json');

function loadTasks() {
    try {
        // Ensure the directory exists
        const dir = path.dirname(tasksFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Create file if it doesn't exist
        if (!fs.existsSync(tasksFilePath)) {
            fs.writeFileSync(tasksFilePath, JSON.stringify({ tasks: [] }, null, 2));
            return { tasks: [] };
        }

        // Read and parse existing file
        const fileContent = fs.readFileSync(tasksFilePath, 'utf8');
        if (!fileContent || fileContent.trim() === '') {
            // If file is empty, initialize it
            const initialData = { tasks: [] };
            fs.writeFileSync(tasksFilePath, JSON.stringify(initialData, null, 2));
            return initialData;
        }

        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error loading tasks:', error);
        // Return empty tasks array as fallback
        return { tasks: [] };
    }
}

function saveTasks(tasks) {
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

module.exports = {
    data: {
        name: "tasks",
        description: "Manage tasks",
        dm_permissions: "0",
        options: [
            {
                name: "show",
                description: "Show all tasks",
                type: 1
            },
            {
                name: "create",
                description: "Create a new task",
                type: 1,
                options: [
                    {
                        name: "title",
                        description: "Task title",
                        type: 3,
                        required: true
                    },
                    {
                        name: "description",
                        description: "Task description",
                        type: 3,
                        required: true
                    },
                    {
                        name: "due_date",
                        description: "Due date (YYYY-MM-DD)",
                        type: 3,
                        required: true
                    },
                    {
                        name: "assign_to",
                        description: "User to assign the task to",
                        type: 6,  // Type 6 is for USER type
                        required: false
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove a task (Admin only)",
                type: 1,
                options: [
                    {
                        name: "task_id",
                        description: "ID of the task to remove",
                        type: 3,
                        required: true
                    }
                ]
            },
            {
                name: "edit",
                description: "Edit a task (Admin only)",
                type: 1,
                options: [
                    {
                        name: "task_id",
                        description: "ID of the task to edit",
                        type: 3,
                        required: true
                    },
                    {
                        name: "title",
                        description: "New title",
                        type: 3,
                        required: false
                    },
                    {
                        name: "description",
                        description: "New description",
                        type: 3,
                        required: false
                    },
                    {
                        name: "due_date",
                        description: "New due date (YYYY-MM-DD)",
                        type: 3,
                        required: false
                    },
                    {
                        name: "assign_to",
                        description: "New user to assign the task to",
                        type: 6,
                        required: false
                    }
                ]
            },
            {
                name: "mark_done",
                description: "Mark your assigned task as done",
                type: 1,
                options: [
                    {
                        name: "task_id",
                        description: "ID of the task to mark as done",
                        type: 3,
                        required: true
                    }
                ]
            }
        ]
    },
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const tasksData = loadTasks();

        switch (subcommand) {
            case "show": {
                const embed = new EmbedBuilder()
                    .setTitle("Tasks List")
                    .setColor("#00FFAA");

                const sortedTasks = tasksData.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                
                sortedTasks.forEach(task => {
                    embed.addFields({
                        name: `${task.id}: ${task.title} (${task.status})`,
                        value: `Description: ${task.description}\nDue: ${task.dueDate}\nAssigned to: <@${task.assignedTo}>\nAssigned by: <@${task.assignedBy}>`
                    });
                });

                await interaction.reply({ embeds: [embed], ephemeral: false });
                break;
            }
            case "create": {
                const title = interaction.options.getString("title");
                const description = interaction.options.getString("description");
                const dueDate = interaction.options.getString("due_date");
                const assignTo = interaction.options.getUser("assign_to");

                const newTask = {
                    id: (tasksData.tasks.length + 1).toString(),
                    title,
                    description,
                    dueDate,
                    assignedTo: assignTo ? assignTo.id : interaction.user.id,
                    assignedBy: interaction.user.id,
                    status: "pending"
                };

                tasksData.tasks.push(newTask);
                saveTasks(tasksData);

                const assignedUser = assignTo ? `<@${assignTo.id}>` : "yourself";
                await interaction.reply({ 
                    content: `Task created with ID: ${newTask.id} and assigned to ${assignedUser}`, 
                    ephemeral: true 
                });
                break;
            }
            case "remove": {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return await interaction.reply({ content: "You need admin permissions to remove tasks!", ephemeral: true });
                }

                const taskId = interaction.options.getString("task_id");
                tasksData.tasks = tasksData.tasks.filter(task => task.id !== taskId);
                saveTasks(tasksData);

                await interaction.reply({ content: `Task ${taskId} removed`, ephemeral: true });
                break;
            }
            case "edit": {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return await interaction.reply({ content: "You need admin permissions to edit tasks!", ephemeral: true });
                }

                const taskId = interaction.options.getString("task_id");
                const title = interaction.options.getString("title");
                const description = interaction.options.getString("description");
                const dueDate = interaction.options.getString("due_date");
                const assignTo = interaction.options.getUser("assign_to");

                const taskIndex = tasksData.tasks.findIndex(task => task.id === taskId);
                if (taskIndex === -1) {
                    return await interaction.reply({ content: "Task not found!", ephemeral: true });
                }

                if (title) tasksData.tasks[taskIndex].title = title;
                if (description) tasksData.tasks[taskIndex].description = description;
                if (dueDate) tasksData.tasks[taskIndex].dueDate = dueDate;
                if (assignTo) {
                    tasksData.tasks[taskIndex].assignedTo = assignTo.id;
                    tasksData.tasks[taskIndex].assignedBy = interaction.user.id;
                }

                saveTasks(tasksData);
                await interaction.reply({ 
                    content: `Task ${taskId} updated${assignTo ? ` and reassigned to <@${assignTo.id}>` : ''}`, 
                    ephemeral: true 
                });
                break;
            }
            case "mark_done": {
                const taskId = interaction.options.getString("task_id");
                const taskIndex = tasksData.tasks.findIndex(task => task.id === taskId);

                if (taskIndex === -1) {
                    return await interaction.reply({ content: "Task not found!", ephemeral: true });
                }

                if (tasksData.tasks[taskIndex].assignedTo !== interaction.user.id) {
                    return await interaction.reply({ content: "You can only mark your own tasks as done!", ephemeral: true });
                }

                tasksData.tasks[taskIndex].status = "completed";
                saveTasks(tasksData);

                await interaction.reply({ content: `Task ${taskId} marked as completed`, ephemeral: true });
                break;
            }
        }
    },
};
