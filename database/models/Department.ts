// Department Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface DepartmentAttributes {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const initDepartmentModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'Department',
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
      headId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'head_id',
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'departments',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['is_active'] },
      ],
    }
  );
};
