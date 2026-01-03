// Employee Address Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface EmployeeAddressAttributes {
  id: string;
  employeeId: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const initEmployeeAddressModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'EmployeeAddress',
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
        unique: true,
        field: 'employee_id',
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'zip_code',
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'employee_addresses',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['city'] },
      ],
    }
  );
};
