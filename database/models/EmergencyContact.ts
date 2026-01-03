// Emergency Contact Model
import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface EmergencyContactAttributes {
  id: string;
  employeeId: string;
  name: string;
  relationship: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const initEmergencyContactModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'EmergencyContact',
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
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      relationship: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: 'emergency_contacts',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
      ],
    }
  );
};
