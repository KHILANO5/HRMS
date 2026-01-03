// Designation Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface DesignationAttributes {
  id: string;
  name: string;
  description?: string;
  departmentId?: string;
  level?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const initDesignationModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Designation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'department_id',
        references: {
          model: 'departments',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'designations',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['department_id'] },
        { fields: ['is_active'] },
      ],
    }
  );
};
