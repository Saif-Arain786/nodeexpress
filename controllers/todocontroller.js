const todovalidator= require('../Validator/todovalidator');
const todomodel = require('../models/todomodel');
exports.createtodos = async (req, res) => {
    try {
        
        const check =todovalidator.validate( req.body);
        if (check.error) {
            const errorMessages = check.error.details.map((err) => err.message);
            console.error("Validation Errors:", errorMessages);
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: errorMessages,
            });
        }

        req.body.userId = req._id; // Assuming req.user is set after authentication
 

        const todo = todomodel(req.body);
        await todo.save();
        res.status(200).json({
            status: true,
            message: "Todo created successfully",
            data: todo
        });
    } catch (error) {
        res.status(501).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
exports.gettodos = async (req, res) => {
    try {
        console.log("User ID from request:", req._id); // Debugging log

        const todos = await todomodel.find({ userId: req._id });

        if (!todos || todos.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No todos found for this user",
            });
        }

        res.status(200).json({
            status: true,
            message: "Todos retrieved successfully",
            data: todos,
        });
    } catch (error) {
        console.error("Error retrieving todos:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.deletetodos = async (req, res) => {
    try {
        const todoId = req.params.id; // Assuming the ID is passed as a URL parameter

        const deletedTodo = await todomodel.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            return res.status(404).json({
                status: false,
                message: "Todo not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Todo deleted successfully",
            data: deletedTodo,
        });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}