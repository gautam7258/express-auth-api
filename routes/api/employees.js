const express = require("express");
const router = express.Router();
const path = require("path");
const employeesController = require("../../controllers/employeesController");
 const {getAllEmployees,getEmployee,createNewEmployee,updateEmployee,deleteEmployee} = employeesController;
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
router.route("/")
.get(getAllEmployees)
.post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),createNewEmployee)
.put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),updateEmployee)
.delete(verifyRoles(ROLES_LIST.Admin),deleteEmployee);

router.route('/:id')
.get(getEmployee)

module.exports = router;