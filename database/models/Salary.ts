// Salary Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface SalaryAttributes {
  id: string;
  employeeId: string;
  basicPay: number;
  hra: number;
  allowances: number;
  pfContribution: number;
  taxDeduction: number;
  grossSalary: number;
  netSalary: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const initSalaryModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Salary',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'employee_id',
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      basicPay: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'basic_pay',
      },
      hra: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      allowances: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pfContribution: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'pf_contribution',
      },
      taxDeduction: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'tax_deduction',
      },
      grossSalary: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'gross_salary',
      },
      netSalary: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'net_salary',
      },
      effectiveFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'effective_from',
      },
      effectiveTo: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'effective_to',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'salaries',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['effective_from'] },
        { fields: ['is_active'] },
        { fields: ['created_at'] },
      ],
    }
  );
};
