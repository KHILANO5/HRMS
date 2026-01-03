// Employee Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface EmployeeAttributes {
  id: string;
  userId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department: string;
  designation: string;
  dateOfJoining: Date;
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const initEmployeeModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      employeeCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'employee_code',
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name',
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      dateOfJoining: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date_of_joining',
      },
      profilePicture: {
        type: DataTypes.LONGTEXT,
        allowNull: true,
        field: 'profile_picture',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'employees',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_code'] },
        { fields: ['department'] },
        { fields: ['date_of_joining'] },
        { fields: ['is_active'] },
        { fields: ['created_at'] },
      ],
    }
  );
};
