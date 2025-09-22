import Task from '../models/Task.js';

//* @desc Get all Tasks (Admin: all tasks, User: assigned tasks)
//* @route GET /api/tasks/
//! @access Private
const getTasks =async (req, res) => {
    try{
        const { status } = req.query;
        let filter = {};

        if(status){
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin"){
            tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl');
        }else{
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id
            }).populate('assignedTo', 'name email profileImageUrl');
        }

        //todo Add Completed Task count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(item => item.completed).length; 
                return { ...task._doc, completedCount: completedCount };
            })
        );

        //* Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: 'Pending',
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: 'In Progress',
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'Completed',
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            },
        });
    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc Get Task by ID
//* @route GET /api/tasks/:id
//! @access Private
const getTaskById = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id).populate(
            'assignedTo', 
            'name email profileImageUrl'
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc Create a new Task (Admin only)
//* @route POST /api/tasks/
//! @access Private (Admin)
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,  
            attachments,
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


//* @desc Update a Task
//* @route PUT /api/tasks/:id
//! @access Private
const updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: 'Task updated successfully', updatedTask });
    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc Delete a Task
//* @route DELETE /api/tasks/:id
//! @access Private (Admin)
const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc Update task status
//* @route PUT /api/tasks/:id/status
//! @access Private
const updateTaskStatus = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}; 

//* @desc Update task checklist
//* @route PUT /api/tasks/:id/todo
//! @access Private
const updateTaskChecklist = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc Dashboard data (Admin)
//* @route GET /api/tasks/dashboard-data
//! @access Private
const getDashboardData = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//* @desc User-specific dashboard data
//* @route GET /api/tasks/user-dashboard-data
//! @access Private
const getUserDashboardData = async (req, res) => {
    try{

    }catch(error){
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};