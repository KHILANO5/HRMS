// Salary Component Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface SalaryComponentAttributes {
  id: string;
  salaryId: string;
  componentName: string;
  componentType: 'earning' | 'deduction';
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const initSalaryComponentModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'SalaryComponent',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      salaryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'salary_id',
        references: {
          model: 'salaries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      componentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'component_name',
      },
      componentType: {
        type: DataTypes.ENUM('earning', 'deduction'),
        allowNull: false,
        field: 'component_type',
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'salary_components',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['salary_id'] },
      ],
    }
  );
};
