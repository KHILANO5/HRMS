// Database model initialization and associations
import { Sequelize } from 'sequelize';
import { initUserModel } from './models/User';
import { initEmployeeModel } from './models/Employee';
import { initEmployeeAddressModel } from './models/EmployeeAddress';
import { initEmergencyContactModel } from './models/EmergencyContact';
import { initAttendanceModel } from './models/Attendance';
import { initLeaveBalanceModel } from './models/LeaveBalance';
import { initLeaveRequestModel } from './models/LeaveRequest';
import { initSalaryModel } from './models/Salary';
import { initSalaryComponentModel } from './models/SalaryComponent';
import { initDepartmentModel } from './models/Department';
import { initDesignationModel } from './models/Designation';
import { initAuditLogModel } from './models/AuditLog';

/**
 * Initialize all models and define associations
 */
export const initializeModels = (sequelize: Sequelize) => {
  // Initialize all models
  const User = initUserModel(sequelize);
  const Employee = initEmployeeModel(sequelize);
  const EmployeeAddress = initEmployeeAddressModel(sequelize);
  const EmergencyContact = initEmergencyContactModel(sequelize);
  const Attendance = initAttendanceModel(sequelize);
  const LeaveBalance = initLeaveBalanceModel(sequelize);
  const LeaveRequest = initLeaveRequestModel(sequelize);
  const Salary = initSalaryModel(sequelize);
  const SalaryComponent = initSalaryComponentModel(sequelize);
  const Department = initDepartmentModel(sequelize);
  const Designation = initDesignationModel(sequelize);
  const AuditLog = initAuditLogModel(sequelize);

  // Define associations
  // User associations
  User.hasOne(Employee, { foreignKey: 'user_id', as: 'employee' });
  Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Employee associations
  Employee.hasOne(EmployeeAddress, { foreignKey: 'employee_id', as: 'address' });
  EmployeeAddress.belongsTo(Employee, { foreignKey: 'employee_id' });

  Employee.hasOne(EmergencyContact, { foreignKey: 'employee_id', as: 'emergencyContact' });
  EmergencyContact.belongsTo(Employee, { foreignKey: 'employee_id' });

  // Attendance associations
  Employee.hasMany(Attendance, { foreignKey: 'employee_id', as: 'attendanceRecords' });
  Attendance.belongsTo(Employee, { foreignKey: 'employee_id' });

  // Leave balance associations
  Employee.hasMany(LeaveBalance, { foreignKey: 'employee_id', as: 'leaveBalances' });
  LeaveBalance.belongsTo(Employee, { foreignKey: 'employee_id' });

  // Leave request associations
  Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id', as: 'leaveRequests' });
  LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
  
  Employee.hasMany(LeaveRequest, { foreignKey: 'approved_by', as: 'approvalsGiven' });
  LeaveRequest.belongsTo(Employee, { foreignKey: 'approved_by', as: 'approver' });

  // Salary associations
  Employee.hasMany(Salary, { foreignKey: 'employee_id', as: 'salaries' });
  Salary.belongsTo(Employee, { foreignKey: 'employee_id' });

  Salary.hasMany(SalaryComponent, { foreignKey: 'salary_id', as: 'components' });
  SalaryComponent.belongsTo(Salary, { foreignKey: 'salary_id' });

  // Department associations
  Department.hasMany(Employee, { foreignKey: 'department', as: 'employees' });
  Department.hasOne(Employee, { foreignKey: 'id', as: 'head' });

  // Designation associations
  Designation.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
  Department.hasMany(Designation, { foreignKey: 'department_id', as: 'designations' });

  // Audit log associations
  User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
  AuditLog.belongsTo(User, { foreignKey: 'user_id' });

  return {
    User,
    Employee,
    EmployeeAddress,
    EmergencyContact,
    Attendance,
    LeaveBalance,
    LeaveRequest,
    Salary,
    SalaryComponent,
    Department,
    Designation,
    AuditLog,
  };
};

export type Models = ReturnType<typeof initializeModels>;
