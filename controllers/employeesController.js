const data = {
	employees: require("../models/employees.json"),
	setEmployees: function (data) {
		this.employees = data;
	},
};

const getAllEmployees = (req, res) => {
	res.json(data.employees);
	console.log(data.employees);
};

const createNewEmployee = (req, res) => {
	const newEmployee = {
		id: data.employees.length + 1,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
	};

	if (!newEmployee.first_name || !newEmployee.last_name) {
		return res.status(400).json({ message: "First and Last Name is required" });
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
	const employee = data.employees.findIndex((e) => e.id === req.body.id);
	if (employee === -1) return res.status(404).json({ message: "User is not Found" });

	const updated = { ...data.employees[employee] };
	if (req.body.first_name) {
		updated.first_name = req.body.first_name;
	}
	if (req.body.last_name) {
		updated.last_name = req.body.last_name;
	}
	const updatedEmployees = data.employees.with(employee, updated);
	data.setEmployees(updatedEmployees);
	res.status(201).json({ message: "Employees updated", employees: data.employees, updated: updated });
};

const deleteEmployee = (req, res) => {
	const employee = data.employees.findIndex((e) => e.id === Number(req.body.id));
	if (employee === -1) return res.status(404).json({ message: "Employees is not Found" });

	const emp = data.employees.splice(employee, 1);
	data.setEmployees([...data.employees]);
	res.json({ "message": "Employee Deleted", " employees": data.employees, "filteres": emp });
};

const getEmployee = (req, res) => {
	const employee = data.employees.find((e) => e.id === Number(req.params.id));
	if (employee) {
		return res.status(404).json({ message: "Employee not found" });
	}
	res.status(200).json({ "message": "Employees Found", "Employee": employee, " id": req.params.id });
};

module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
};
