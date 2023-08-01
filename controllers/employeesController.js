const Employee = require("../models/Employee");
const mongoose = require("mongoose");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (!employees) {
      return res.status(204).json({ message: "No employees found" });
    }
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const createNewEmployee = async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "First name and Last name are required" });
  }
  try {
    const newEmployee = await Employee.create({ first_name, last_name });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  const { id, first_name, last_name } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ message: `No Employee matches the id:${id}` });
    }
    if (first_name) employee.first_name = first_name;
    if (last_name) employee.last_name = last_name;
    const updatedEmployee = await employee.save();
    res
      .status(200)
      .json({ message: "Employee updated", employee: updatedEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ message: `No Employee matches the id:${id}` });
    }
    res.status(200).json({ message: "Employee deleted", employee: deletedEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Id" });
  }
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ message: `No Employee matches the id:${id}` });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
